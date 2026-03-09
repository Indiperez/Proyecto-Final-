using InventTrackAI.API.Data;
using InventTrackAI.API.Models;
using InventTrackAI.API.Repositories.Interfaces;
using MySql.Data.MySqlClient;

namespace InventTrackAI.API.Repositories
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly DbConnection _db;
        public UsuarioRepository(DbConnection db) { _db = db; }

        public IEnumerable<Usuario> GetAll()
        {
            using var conn = _db.GetConnection();
            var cmd = new MySqlCommand("SELECT Id, Nombre, Email, Rol, Activo, FechaCreacion FROM Usuarios", conn);
            conn.Open();
            var reader = cmd.ExecuteReader();
            var usuarios = new List<Usuario>();
            while (reader.Read())
                usuarios.Add(MapUsuario(reader));
            return usuarios;
        }

        public Usuario ObtenerPorId(int id)
        {
            using var conn = _db.GetConnection();
            var cmd = new MySqlCommand("SELECT Id, Nombre, Email, Rol, Activo, FechaCreacion FROM Usuarios WHERE Id = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);
            conn.Open();
            var reader = cmd.ExecuteReader();
            if (reader.Read()) return MapUsuario(reader);
            return null!;
        }

        public Usuario? GetByEmail(string email)
        {
            using var conn = _db.GetConnection();
            var cmd = new MySqlCommand("SELECT Id, Nombre, Email, PasswordHash, Rol, Activo, FechaCreacion FROM Usuarios WHERE Email = @Email", conn);
            cmd.Parameters.AddWithValue("@Email", email);
            conn.Open();
            var reader = cmd.ExecuteReader();
            if (reader.Read()) return MapUsuarioConHash(reader);
            return null;
        }

        public void CrearUsuario(Usuario usuario)
        {
            using var conn = _db.GetConnection();
            var cmd = new MySqlCommand(@"INSERT INTO Usuarios (Nombre, Email, PasswordHash, Rol, Activo, FechaCreacion)
                VALUES (@Nombre, @Email, @PasswordHash, @Rol, @Activo, @FechaCreacion)", conn);
            cmd.Parameters.AddWithValue("@Nombre", usuario.Nombre);
            cmd.Parameters.AddWithValue("@Email", usuario.Email);
            cmd.Parameters.AddWithValue("@PasswordHash", usuario.PasswordHash);
            cmd.Parameters.AddWithValue("@Rol", usuario.Rol);
            cmd.Parameters.AddWithValue("@Activo", usuario.Activo);
            cmd.Parameters.AddWithValue("@FechaCreacion", usuario.FechaCreacion);
            conn.Open();
            cmd.ExecuteNonQuery();
        }

        public bool CambiarEstado(int id, bool estado)
        {
            using var conn = _db.GetConnection();
            var cmd = new MySqlCommand("UPDATE Usuarios SET Activo = @Activo WHERE Id = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);
            cmd.Parameters.AddWithValue("@Activo", estado);
            conn.Open();
            return cmd.ExecuteNonQuery() > 0;
        }

        public bool CambiarRol(int id, string nuevoRol)
        {
            using var conn = _db.GetConnection();
            var cmd = new MySqlCommand("UPDATE Usuarios SET Rol = @Rol WHERE Id = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);
            cmd.Parameters.AddWithValue("@Rol", nuevoRol);
            conn.Open();
            return cmd.ExecuteNonQuery() > 0;
        }

        public void ActualizarPassword(int id, string nuevaPassword)
        {
            using var conn = _db.GetConnection();
            var cmd = new MySqlCommand("UPDATE Usuarios SET PasswordHash = @PasswordHash WHERE Id = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);
            cmd.Parameters.AddWithValue("@PasswordHash", nuevaPassword);
            conn.Open();
            cmd.ExecuteNonQuery();
        }

        private static Usuario MapUsuario(MySqlDataReader reader)
        {
            return new Usuario
            {
                Id = (int)reader["Id"],
                Nombre = reader["Nombre"].ToString()!,
                Email = reader["Email"].ToString()!,
                Rol = reader["Rol"].ToString()!,
                Activo = Convert.ToInt32(reader["Activo"]) == 1,
                FechaCreacion = Convert.ToDateTime(reader["FechaCreacion"])
            };
        }

        private static Usuario MapUsuarioConHash(MySqlDataReader reader)
        {
            var u = MapUsuario(reader);
            u.PasswordHash = reader["PasswordHash"].ToString()!;
            return u;
        }
    }
}
