using InventTrackAI.API.DTOs;
using InventTrackAI.API.Models;

namespace InventTrackAI.API.Repositories.Interfaces
{
    public interface IUsuarioRepository
    {
        public IEnumerable<Usuario> GetAll();

        void CrearUsuario(Usuario usuario);

        bool CambiarEstado(int id, bool estado);

        bool CambiarRol(int id, string nuevoRol);

        Usuario ObtenerPorId(int id);

        void ActualizarPassword(int id, string nuevaPassword);
    }
}
