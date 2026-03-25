namespace InventTrackAI.API.DTOs
{
    public class ProductoAnalisisDto
    {
        public int ProductoId { get; set; }
        public string Nombre { get; set; }
        public int StockActual { get; set; }
        public decimal Promedio30d { get; set; }
        public decimal Promedio60d { get; set; }
        public string Tendencia { get; set; }
        public string Rotacion { get; set; }
        public decimal PuntoReorden { get; set; }
        public decimal DemandaEstimada30Dias { get; set; }
        public DateTime CalculadoEn { get; set; }
    }
}
