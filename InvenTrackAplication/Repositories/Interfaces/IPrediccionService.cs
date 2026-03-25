namespace InventTrackAI.API.Repositories.Interfaces
{
    public interface IPrediccionService
    {
        Task EjecutarAnalisisAsync(int productoId);
    }
}
