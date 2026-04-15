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
        private readonly IClaudeAiService _claudeAiService;

        public PrediccionService(
            IHistoricoConsumoRepository historicoRepo,
            IPrediccionRepository prediccionRepo,
            ProductoRespository productoRepo,
            AlertaRepository alertaRepo,
            IClaudeAiService claudeAiService)
        {
            _historicoRepo = historicoRepo;
            _prediccionRepo = prediccionRepo;
            _productoRepo = productoRepo;
            _alertaRepo = alertaRepo;
            _analyzer = new ConsumptionAnalyzer();
            _claudeAiService = claudeAiService;
        }

        public async Task EjecutarAnalisisForzadoAsync(int productoId)
        {
            // Forced recalculation — skips the 60-minute cooldown check.
            await EjecutarAnalisisInternoAsync(productoId);
        }

        public async Task EjecutarAnalisisAsync(int productoId)
        {
            // a. Skip if already calculated within the last 60 minutes
            var yaCalculado = await Task.Run(() => _prediccionRepo.FueCalculadaHace(productoId, 60));
            if (yaCalculado)
                return;

            await EjecutarAnalisisInternoAsync(productoId);
        }

        private async Task EjecutarAnalisisInternoAsync(int productoId)
        {
            // b. Load product with supplier delivery time
            var producto = await Task.Run(() => _productoRepo.GetByIdConProveedor(productoId));
            if (producto == null)
                return;

            // c. Get the last 60 days of consumption history
            var historial = await Task.Run(() => _historicoRepo.ObtenerUltimos(productoId, 60));

            // d. No history → nothing to predict
            Console.WriteLine($"[IA] Historial obtenido: {historial.Count} registros para producto {productoId}");
            if (historial == null || historial.Count == 0)
                return;

            // e. Run analysis
            var promedioDiario = _analyzer.CalcularPromedioDiario(historial, 30);
            var tendencia      = _analyzer.DetectarTendencia(historial);
            var demanda30      = _analyzer.PredecirDemanda(promedioDiario, 30);
            var rop            = _analyzer.CalcularPuntoReorden(promedioDiario, producto.TiempoEntregaDias, producto.StockMinimo);
            Console.WriteLine($"[IA] Análisis: promedio={promedioDiario:F2}, tendencia={tendencia}, rop={rop:F2}");

            // f. Persist (upsert) the new prediction
            var prediccion = new PrediccionDemanda
            {
                ProductoId            = productoId,
                ConsumoDiarioPromedio = promedioDiario,
                DemandaEstimada30Dias = demanda30,
                Tendencia             = tendencia,
                PuntoReorden          = rop,
                CalculadoEn           = DateTime.Now
            };

            await Task.Run(() => _prediccionRepo.Upsert(prediccion));

            // g. Generate alerts with Claude AI recommendations
            var alertas = new List<(bool condicion, string tipoAlerta)>
            {
                (producto.StockActual <= producto.StockMinimo,
                    "Stock mínimo alcanzado"),
                (producto.StockActual <= (int)rop && producto.StockActual > producto.StockMinimo,
                    "Punto de reorden alcanzado"),
                (tendencia == "Sube" && demanda30 > producto.StockActual,
                    "Alta demanda proyectada"),
                (_analyzer.TieneBajaRotacion(historial),
                    "Baja rotación detectada"),
            };

            foreach (var (condicion, tipoAlerta) in alertas)
            {
                Console.WriteLine($"[IA] Evaluando condición: {tipoAlerta}, condicion={condicion}");
                if (!condicion) continue;

                Console.WriteLine($"[IA] Llamando a Claude para: {tipoAlerta}");
                try
                {
                    var mensaje = await _claudeAiService.GenerarRecomendacionAsync(
                        nombreProducto:      producto.Nombre,
                        stockActual:         producto.StockActual,
                        stockMinimo:         producto.StockMinimo,
                        consumoDiario:       promedioDiario,
                        demandaEstimada30Dias: demanda30,
                        tendencia:           tendencia,
                        puntoReorden:        rop,
                        tipoAlerta:          tipoAlerta
                    );

                    _alertaRepo.CrearSiNoExiste(productoId, mensaje);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Claude AI Error: {ex.Message}");
                    // Fallback to default message if Claude API fails
                    var mensajeFallback = $"{tipoAlerta} para {producto.Nombre}";
                    _alertaRepo.CrearSiNoExiste(productoId, mensajeFallback);
                }
            }
        }
    }
}

