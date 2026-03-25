namespace InventTrackAI.API.DTOs
{
    // Internal DTO: product + supplier data used by PrediccionService
    public class ProductoConProveedorDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public int StockActual { get; set; }
        public int StockMinimo { get; set; }
        public int TiempoEntregaDias { get; set; }
    }
}
