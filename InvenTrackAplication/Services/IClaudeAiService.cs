namespace InventTrackAI.API.Services
{
    public interface IClaudeAiService
    {
        Task<string> GenerarRecomendacionAsync(
            string nombreProducto,
            int stockActual,
            int stockMinimo,
            decimal consumoDiario,
            decimal demandaEstimada30Dias,
            string tendencia,
            decimal puntoReorden,
            string tipoAlerta);
    }
}
