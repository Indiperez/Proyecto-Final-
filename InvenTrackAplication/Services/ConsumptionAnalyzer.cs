using InventTrackAI.API.Models;

namespace InventTrackAI.API.Services
{
    public class ConsumptionAnalyzer
    {
        // 1. Average daily consumption over the given window.
        public decimal CalcularPromedioDiario(List<HistoricoConsumo> historial, int dias)
        {
            if (historial == null || historial.Count == 0 || dias <= 0)
                return 0;

            var limite = DateTime.Now.AddDays(-dias);
            var total = historial
                .Where(h => h.Fecha >= limite)
                .Sum(h => h.Cantidad);

            return (decimal)total / dias;
        }

        // 2. Trend detection by comparing two consecutive half-periods.
        public string DetectarTendencia(List<HistoricoConsumo> historial, int mitadPeriodo = 15)
        {
            if (historial == null || historial.Count == 0)
                return "Estable";

            var ahora = DateTime.Now;
            var inicioReciente = ahora.AddDays(-mitadPeriodo);
            var inicioAnterior = ahora.AddDays(-mitadPeriodo * 2);

            var periodoReciente = historial
                .Where(h => h.Fecha >= inicioReciente)
                .Sum(h => h.Cantidad);

            var periodoAnterior = historial
                .Where(h => h.Fecha >= inicioAnterior && h.Fecha < inicioReciente)
                .Sum(h => h.Cantidad);

            if (periodoAnterior == 0)
                return "Estable";

            var cambio = (decimal)(periodoReciente - periodoAnterior) / periodoAnterior;

            if (cambio > 0.10m)
                return "Sube";

            if (cambio < -0.10m)
                return "Baja";

            return "Estable";
        }

        // 3. Project daily average over a future window.
        public decimal PredecirDemanda(decimal promedioDiario, int diasFuturos)
        {
            return promedioDiario * diasFuturos;
        }

        // 4. Reorder point = demand during lead time + safety stock.
        public decimal CalcularPuntoReorden(decimal promedioDiario, int tiempoEntregaDias, decimal stockSeguridad = 0)
        {
            return (promedioDiario * tiempoEntregaDias) + stockSeguridad;
        }

        // 5. True when no movement has been recorded within the threshold window.
        public bool TieneBajaRotacion(List<HistoricoConsumo> historial, int diasUmbral = 30)
        {
            if (historial == null || historial.Count == 0)
                return true;

            var limite = DateTime.Now.AddDays(-diasUmbral);
            return !historial.Any(h => h.Fecha >= limite);
        }
    }
}
