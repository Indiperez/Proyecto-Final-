using InventTrackAI.API.Models;

namespace InventTrackAI.API.Repositories.Interfaces
{
    public interface IPrediccionRepository
    {
        void Upsert(PrediccionDemanda prediccion);
        PrediccionDemanda? ObtenerPorProducto(int productoId);
        bool FueCalculadaHace(int productoId, int minutos);
    }
}
