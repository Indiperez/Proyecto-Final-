using InventTrackAI.API.Models;

namespace InventTrackAI.API.Repositories.Interfaces
{
    public interface IUsuarioRepository
    {
        public IEnumerable<Usuario> GetAll();

        void CrearUsuario(Usuario usuario);

        void CambiarEstado(int id, bool estado);

        void CambiarRol(int id, string nuevoRol);

        Usuario ObtenerPorId(int id);

        void ActualizarPassword(int id, string nuevaPassword);
    }
}
