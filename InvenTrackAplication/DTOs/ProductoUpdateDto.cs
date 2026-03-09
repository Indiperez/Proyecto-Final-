namespace InventTrackAI.API.DTOs
{
    public class ProductoUpdateDto
    {
        public string Nombre { get; set; }
        public string? Descripcion { get; set; }
        public int StockActual { get; set; }
        public int StockMinimo { get; set; }
    }
}
