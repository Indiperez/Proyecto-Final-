namespace InventTrackAI.API.DTOs
{
    // Internal DTO used by ProductoRespository.GetByIdConProveedor
    // and PrediccionService to load product + supplier data for analysis.
    public class ProductoConProveedorDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public int StockActual { get; set; }
        public int StockMinimo { get; set; }
        public int TiempoEntregaDias { get; set; }
    }
}
