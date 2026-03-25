namespace InventTrackAI.API.Models
{
    public class Producto
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string? Descripcion { get; set; }
        public int StockActual { get; set; }
        public int StockMinimo { get; set; }
        public DateTime FechaDeCreacion { get; set; }
    }
}
