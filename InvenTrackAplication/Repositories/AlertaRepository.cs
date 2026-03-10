using InventTrackAI.API.Data;
using InventTrackAI.API.DTOs;
using MySql.Data.MySqlClient;

namespace InventTrackAI.API.Repositories
{
    public class AlertaRepository
    {
        private readonly DbConnection _db;

        public AlertaRepository(DbConnection db)
        {
            _db = db;
        }

        public void CrearSiNoExiste(int productoId, string mensaje)
        {
            using var conn = _db.GetConnection();
            var query = @"
                INSERT INTO Alertas (ProductoId, Mensaje)
                SELECT @ProductoId, @Mensaje FROM DUAL
                WHERE NOT EXISTS (
                    SELECT 1 FROM Alertas WHERE ProductoId = @ProductoId AND Leida = 0
                )";

            var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@ProductoId", productoId);
            cmd.Parameters.AddWithValue("@Mensaje", mensaje);
            conn.Open();
            cmd.ExecuteNonQuery();
        }

        public List<AlertaDto> GetPendientes()
        {
            var alertas = new List<AlertaDto>();
            using var conn = _db.GetConnection();

            var query = "SELECT * FROM Alertas WHERE Leida = 0";

            var cmd = new MySqlCommand(query, conn);
            conn.Open();
            var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                alertas.Add(new AlertaDto
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    ProductoId = Convert.ToInt32(reader["ProductoId"]),
                    Mensaje = reader["Mensaje"].ToString(),
                    Fecha = Convert.ToDateTime(reader["Fecha"]),
                    Leida = Convert.ToInt32(reader["Leida"]) == 1
                });
            }
            return alertas;
        }

        public void MarcarLeida(int id)
        {
            using var conn = _db.GetConnection();
            var query = "UPDATE Alertas SET Leida = 1 WHERE Id = @Id";
            var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@Id", id);
            conn.Open();
            cmd.ExecuteNonQuery();
        }
    }
}
