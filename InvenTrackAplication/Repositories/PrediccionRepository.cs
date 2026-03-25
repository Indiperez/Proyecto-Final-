using InventTrackAI.API.Data;
using InventTrackAI.API.DTOs;
using InventTrackAI.API.Models;
using InventTrackAI.API.Repositories.Interfaces;
using MySql.Data.MySqlClient;

namespace InventTrackAI.API.Repositories
{
    public class PrediccionRepository : IPrediccionRepository
    {
        private readonly DbConnection _db;

        public PrediccionRepository(DbConnection db)
        {
            _db = db;
        }

        public void Upsert(PrediccionDemanda prediccion)
        {
            using var conn = _db.GetConnection();
            // ProductoId has a UNIQUE constraint — INSERT sets the row the first time,
            // ON DUPLICATE KEY UPDATE refreshes it on every subsequent call.
            var query = @"INSERT INTO PrediccionDemanda
                              (ProductoId, ConsumoDiarioPromedio, DemandaEstimada30Dias,
                               Tendencia, PuntoReorden, CalculadoEn)
                          VALUES
                              (@ProductoId, @ConsumoDiarioPromedio, @DemandaEstimada30Dias,
                               @Tendencia, @PuntoReorden, @CalculadoEn)
                          ON DUPLICATE KEY UPDATE
                              ConsumoDiarioPromedio  = VALUES(ConsumoDiarioPromedio),
                              DemandaEstimada30Dias  = VALUES(DemandaEstimada30Dias),
                              Tendencia              = VALUES(Tendencia),
                              PuntoReorden           = VALUES(PuntoReorden),
                              CalculadoEn            = VALUES(CalculadoEn)";

            var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@ProductoId", prediccion.ProductoId);
            cmd.Parameters.AddWithValue("@ConsumoDiarioPromedio", prediccion.ConsumoDiarioPromedio);
            cmd.Parameters.AddWithValue("@DemandaEstimada30Dias", prediccion.DemandaEstimada30Dias);
            cmd.Parameters.AddWithValue("@Tendencia", prediccion.Tendencia);
            cmd.Parameters.AddWithValue("@PuntoReorden", prediccion.PuntoReorden);
            cmd.Parameters.AddWithValue("@CalculadoEn", prediccion.CalculadoEn);
            conn.Open();
            cmd.ExecuteNonQuery();
        }

        public PrediccionDemanda? ObtenerPorProducto(int productoId)
        {
            using var conn = _db.GetConnection();
            var query = @"SELECT Id, ProductoId, ConsumoDiarioPromedio, DemandaEstimada30Dias,
                                 Tendencia, PuntoReorden, CalculadoEn
                          FROM PrediccionDemanda
                          WHERE ProductoId = @ProductoId";

            var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@ProductoId", productoId);
            conn.Open();
            var reader = cmd.ExecuteReader();

            if (reader.Read())
                return MapPrediccion(reader);

            return null;
        }

        public List<PrediccionDemanda> ObtenerTodos()
        {
            var lista = new List<PrediccionDemanda>();
            using var conn = _db.GetConnection();
            var query = @"SELECT Id, ProductoId, ConsumoDiarioPromedio, DemandaEstimada30Dias,
                                 Tendencia, PuntoReorden, CalculadoEn
                          FROM PrediccionDemanda";

            var cmd = new MySqlCommand(query, conn);
            conn.Open();
            var reader = cmd.ExecuteReader();

            while (reader.Read())
                lista.Add(MapPrediccion(reader));

            return lista;
        }

        public bool FueCalculadaHace(int productoId, int minutos)
        {
            using var conn = _db.GetConnection();
            var query = @"SELECT CalculadoEn
                          FROM PrediccionDemanda
                          WHERE ProductoId = @ProductoId";

            var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@ProductoId", productoId);
            conn.Open();
            var result = cmd.ExecuteScalar();

            if (result == null || result == DBNull.Value)
                return false;

            var calculadoEn = Convert.ToDateTime(result);
            return (DateTime.Now - calculadoEn).TotalMinutes < minutos;
        }

        public List<ProductoAnalisisDto> ObtenerAnalisisCompleto()
        {
            var lista = new List<ProductoAnalisisDto>();
            using var conn = _db.GetConnection();
            var query = @"SELECT
                              pd.ProductoId,
                              p.Nombre,
                              p.StockActual,
                              pd.ConsumoDiarioPromedio AS Promedio30d,
                              IFNULL((
                                  SELECT SUM(hc.Cantidad) / 60.0
                                  FROM HistoricoConsumo hc
                                  WHERE hc.ProductoId = pd.ProductoId
                                    AND hc.Fecha >= DATE_SUB(NOW(), INTERVAL 60 DAY)
                              ), 0) AS Promedio60d,
                              pd.Tendencia,
                              CASE
                                  WHEN pd.ConsumoDiarioPromedio >= 1.0 THEN 'Alta'
                                  WHEN pd.ConsumoDiarioPromedio >= 0.3 THEN 'Media'
                                  ELSE 'Baja'
                              END AS Rotacion,
                              pd.PuntoReorden,
                              pd.DemandaEstimada30Dias,
                              pd.CalculadoEn
                          FROM PrediccionDemanda pd
                          INNER JOIN Productos p ON pd.ProductoId = p.Id
                          ORDER BY pd.ConsumoDiarioPromedio DESC";

            var cmd = new MySqlCommand(query, conn);
            conn.Open();
            var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                lista.Add(new ProductoAnalisisDto
                {
                    ProductoId            = Convert.ToInt32(reader["ProductoId"]),
                    Nombre                = reader["Nombre"].ToString(),
                    StockActual           = Convert.ToInt32(reader["StockActual"]),
                    Promedio30d           = Convert.ToDecimal(reader["Promedio30d"]),
                    Promedio60d           = Convert.ToDecimal(reader["Promedio60d"]),
                    Tendencia             = reader["Tendencia"].ToString(),
                    Rotacion              = reader["Rotacion"].ToString(),
                    PuntoReorden          = Convert.ToDecimal(reader["PuntoReorden"]),
                    DemandaEstimada30Dias = Convert.ToDecimal(reader["DemandaEstimada30Dias"]),
                    CalculadoEn           = Convert.ToDateTime(reader["CalculadoEn"])
                });
            }

            return lista;
        }

        private PrediccionDemanda MapPrediccion(MySqlDataReader reader)
        {
            return new PrediccionDemanda
            {
                Id = Convert.ToInt32(reader["Id"]),
                ProductoId = Convert.ToInt32(reader["ProductoId"]),
                ConsumoDiarioPromedio = Convert.ToDecimal(reader["ConsumoDiarioPromedio"]),
                DemandaEstimada30Dias = Convert.ToDecimal(reader["DemandaEstimada30Dias"]),
                Tendencia = reader["Tendencia"].ToString(),
                PuntoReorden = Convert.ToDecimal(reader["PuntoReorden"]),
                CalculadoEn = Convert.ToDateTime(reader["CalculadoEn"])
            };
        }
    }
}
