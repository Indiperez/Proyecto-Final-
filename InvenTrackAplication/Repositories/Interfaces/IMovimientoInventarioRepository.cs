using InventTrackAI.API.Models;

namespace InventTrackAI.API.Repositories.Interfaces
{
    public interface IMovimientoInventarioRepository
    {
        void RegistrarMovimiento(MovimientoInventario movimiento);
    }
}
