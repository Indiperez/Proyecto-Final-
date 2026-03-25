namespace InventTrackAI.API.Models
{
    public class PrediccionDemanda
    {
        public int Id { get; set; }
        public int ProductoId { get; set; }
        public decimal ConsumoDiarioPromedio { get; set; }
        public decimal DemandaEstimada30Dias { get; set; }
        public string Tendencia { get; set; }
        public decimal PuntoReorden { get; set; }
        public DateTime CalculadoEn { get; set; }
    }
}
