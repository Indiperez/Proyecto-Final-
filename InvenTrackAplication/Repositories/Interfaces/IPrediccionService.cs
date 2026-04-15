namespace InventTrackAI.API.Repositories.Interfaces
{
    public interface IPrediccionService
    {
        Task EjecutarAnalisisAsync(int productoId);
        Task EjecutarAnalisisForzadoAsync(int productoId);
    }
}
