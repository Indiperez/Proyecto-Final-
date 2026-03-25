using InventTrackAI.API.Models;

namespace InventTrackAI.API.Repositories.Interfaces
{
    public interface IHistoricoConsumoRepository
    {
        void Registrar(HistoricoConsumo consumo);
        List<HistoricoConsumo> ObtenerUltimos(int productoId, int dias);
    }
}
