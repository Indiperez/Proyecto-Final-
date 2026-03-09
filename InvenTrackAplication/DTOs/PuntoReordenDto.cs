namespace InventTrackAI.API.DTOs
{
    public class PuntoReordenDto
    {
        public int ProductoId { get; set; }
        public string Producto { get; set; }
        public int StockActual { get; set; }
        public int StockMinimo { get; set; }
        public int PuntoReorden { get; set; }
        public int TiempoEntregaDias { get; set; }
        public bool Reordenar { get; set; }



    }
}
