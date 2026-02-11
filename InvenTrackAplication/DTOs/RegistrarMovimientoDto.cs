namespace InventTrackAI.API.DTOs
{
    public class RegistrarMovimientoDto
    {
        public int ProductoId { get; set; }
        public string Tipo { get; set; }
        public int Cantidad { get; set; }
        public string? Observacion { get; set; }
    }
}
