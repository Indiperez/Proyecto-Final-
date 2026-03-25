namespace InventTrackAI.API.Models
{
    public class HistoricoConsumo
    {
        public int Id { get; set; }
        public int ProductoId { get; set; }
        public int Cantidad { get; set; }
        public DateTime Fecha { get; set; }
    }
}
