namespace InventTrackAI.API.DTOs
{
    public class ProductoAnalisisDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public int StockActual { get; set; }
        public int StockMinimo { get; set; }
        public int TiempoEntregaDias { get; set; }
    }
}
