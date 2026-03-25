using InventTrackAI.API.Data;
using InventTrackAI.API.Models;
using InventTrackAI.API.Repositories.Interfaces;
using MySql.Data.MySqlClient;

namespace InventTrackAI.API.Repositories
{
    public class HistoricoConsumoRepository : IHistoricoConsumoRepository
    {
        private readonly DbConnection _db;

        public HistoricoConsumoRepository(DbConnection db)
        {
            _db = db;
        }

        public void Registrar(HistoricoConsumo consumo)
        {
            using var conn = _db.GetConnection();
            var query = @"INSERT INTO HistoricoConsumo (ProductoId, Cantidad, Fecha)
                          VALUES (@ProductoId, @Cantidad, @Fecha)";

            var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@ProductoId", consumo.ProductoId);
            cmd.Parameters.AddWithValue("@Cantidad", consumo.Cantidad);
            cmd.Parameters.AddWithValue("@Fecha", consumo.Fecha);
            conn.Open();
            cmd.ExecuteNonQuery();
        }

        public List<HistoricoConsumo> ObtenerUltimos(int productoId, int dias)
        {
            var historial = new List<HistoricoConsumo>();

            using var conn = _db.GetConnection();
            var query = @"SELECT Id, ProductoId, Cantidad, Fecha
                          FROM HistoricoConsumo
                          WHERE ProductoId = @ProductoId
                            AND Fecha >= DATE_SUB(NOW(), INTERVAL @Dias DAY)
                          ORDER BY Fecha ASC";

            var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@ProductoId", productoId);
            cmd.Parameters.AddWithValue("@Dias", dias);
            conn.Open();
            var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                historial.Add(MapHistorico(reader));
            }

            return historial;
        }

        private HistoricoConsumo MapHistorico(MySqlDataReader reader)
        {
            return new HistoricoConsumo
            {
                Id = Convert.ToInt32(reader["Id"]),
                ProductoId = Convert.ToInt32(reader["ProductoId"]),
                Cantidad = Convert.ToInt32(reader["Cantidad"]),
                Fecha = Convert.ToDateTime(reader["Fecha"])
            };
        }
    }
}
