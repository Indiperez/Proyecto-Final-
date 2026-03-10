namespace InventTrackAI.API.DTOs
{
    public class ProductoCreateDto
    {
        public string Nombre { get; set; }
        public string? Descripcion { get; set; }
        public int StockActual { get; set; }
        public int StockMinimo { get; set; }
        public int? ProveedorId { get; set; } // Optional, will use default if not provided
        public int? PuntoReorden { get; set; } // Optional, will calculate if not provided
    }
}
