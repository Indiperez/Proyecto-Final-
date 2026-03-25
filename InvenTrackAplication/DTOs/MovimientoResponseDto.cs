namespace InventTrackAI.API.DTOs
{
    public class MovimientoResponseDto
    {
        public int Id { get; set; }
        public int ProductoId { get; set; }
        public string NombreProducto { get; set; }
        public int UsuarioId { get; set; }
        public string Tipo { get; set; }
        public int Cantidad { get; set; }
        public DateTime Fecha { get; set; }
        public string? Observacion { get; set; }
    }
}
