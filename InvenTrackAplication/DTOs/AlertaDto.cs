namespace InventTrackAI.API.DTOs
{
    public class AlertaDto
    {
        public int Id { get; set; }
        public int ProductoId { get; set; }
        public string Mensaje { get; set; }
        public DateTime Fecha { get; set; }
        public bool Leida { get; set; }
    }
}
