using InventTrackAI.API.DTOs;
using InventTrackAI.API.Models;
using InventTrackAI.API.Repositories;
using InventTrackAI.API.Repositories.Interfaces;

namespace InventTrackAI.API.Services
{
    public class PrediccionService : IPrediccionService
    {
        private readonly IHistoricoConsumoRepository _historicoRepo;
        private readonly IPrediccionRepository _prediccionRepo;
        private readonly ProductoRespository _productoRepo;
        private readonly AlertaRepository _alertaRepo;
        private readonly ConsumptionAnalyzer _analyzer;

        public PrediccionService(
            IHistoricoConsumoRepository historicoRepo,
            IPrediccionRepository prediccionRepo,
            ProductoRespository productoRepo,
            AlertaRepository alertaRepo,
            ConsumptionAnalyzer analyzer)
        {
            _historicoRepo = historicoRepo;
            _prediccionRepo = prediccionRepo;
            _productoRepo = productoRepo;
            _alertaRepo = alertaRepo;
            _analyzer = analyzer;
        }

        public async Task EjecutarAnalisisAsync(int productoId)
        {
            // a. Skip if already calculated within the last 60 minutes
            var yaCalculado = await Task.Run(() => _prediccionRepo.FueCalculadaHace(productoId, 60));
            if (yaCalculado)
                return;

            // b. Load product with supplier delivery time
            var producto = await Task.Run(() => _productoRepo.GetByIdConProveedor(productoId));
            if (producto == null)
                return;

            // c. Get the last 60 days of consumption history
            var historial = await Task.Run(() => _historicoRepo.ObtenerUltimos(productoId, 60));

            // d. No history → nothing to predict
            if (historial == null || historial.Count == 0)
                return;

            // e. Run analysis
            var promedioDiario = _analyzer.CalcularPromedioDiario(historial, 30);
            var tendencia      = _analyzer.DetectarTendencia(historial);
            var demanda30      = _analyzer.PredecirDemanda(promedioDiario, 30);
            var rop            = _analyzer.CalcularPuntoReorden(promedioDiario, producto.TiempoEntregaDias, producto.StockMinimo);

            // f. Persist (upsert) the new prediction
            var prediccion = new PrediccionDemanda
            {
                ProductoId             = productoId,
                ConsumoDiarioPromedio  = promedioDiario,
                DemandaEstimada30Dias  = demanda30,
                Tendencia              = tendencia,
                PuntoReorden           = rop,
                CalculadoEn            = DateTime.Now
            };

            await Task.Run(() => _prediccionRepo.Upsert(prediccion));

            // g. Generate alerts where conditions are met
            if (producto.StockActual <= producto.StockMinimo)
            {
                await Task.Run(() =>
                    _alertaRepo.CrearSiNoExiste(productoId,
                        $"Stock mínimo alcanzado para {producto.Nombre}"));
            }

            if (producto.StockActual <= (int)rop)
            {
                await Task.Run(() =>
                    _alertaRepo.CrearSiNoExiste(productoId,
                        $"Punto de reorden alcanzado para {producto.Nombre}"));
            }

            if (tendencia == "Sube" && demanda30 > producto.StockActual)
            {
                await Task.Run(() =>
                    _alertaRepo.CrearSiNoExiste(productoId,
                        $"Alta demanda proyectada para {producto.Nombre}"));
            }

            if (_analyzer.TieneBajaRotacion(historial))
            {
                await Task.Run(() =>
                    _alertaRepo.CrearSiNoExiste(productoId,
                        $"Baja rotación detectada para {producto.Nombre}"));
            }
        }
    }
}
