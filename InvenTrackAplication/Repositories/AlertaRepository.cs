using InventTrackAI.API.Data;
using InventTrackAI.API.DTOs;
using Microsoft.Data.SqlClient;

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
                IF NOT EXISTS (SELECT 1 FROM Alertas WHERE ProductoId = @ProductoId AND Leida = 0)
                BEGIN
                    INSERT INTO Alertas (ProductoId, Mensaje)
                    VALUES (@ProductoId, @Mensaje)
                END";

            var cmd = new SqlCommand(query, conn);
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

            var cmd = new SqlCommand(query, conn);
            conn.Open();
            var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                alertas.Add(new AlertaDto
                {
                    ProductoId = (int)reader["ProductoId"],
                    Mensaje = (string)reader["Mensaje"],
                    Fecha = (DateTime)reader["Fecha"],
                    Leida = (bool)reader["Leida"]
                });
            }
            return alertas;
        }

        public void MarcarLeida(int id)
        {
            using var conn = _db.GetConnection();
            var query = "UPDATE Alertas SET Leida = 1 WHERE Id = @Id";
            var cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@Id", id);
            conn.Open();
            cmd.ExecuteNonQuery();
        }
        


    }
}
