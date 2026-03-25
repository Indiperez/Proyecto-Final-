using InventTrackAI.API.Repositories.Interfaces;
using InventTrackAI.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace InventTrackAI.API.Controllers
{
    [ApiController]
    [Route("api/prediccion")]
    public class PrediccionController : ControllerBase
    {
        private readonly IPrediccionService _prediccionService;
        private readonly IPrediccionRepository _prediccionRepository;

        public PrediccionController(
            IPrediccionService prediccionService,
            IPrediccionRepository prediccionRepository)
        {
            _prediccionService = prediccionService;
            _prediccionRepository = prediccionRepository;
        }

        // GET api/prediccion/{productoId}
        [HttpGet("{productoId}")]
        public IActionResult ObtenerPorProducto(int productoId)
        {
            var prediccion = _prediccionRepository.ObtenerPorProducto(productoId);

            if (prediccion == null)
                return NotFound(new { mensaje = "No existe predicción para este producto." });

            return Ok(prediccion);
        }

        // POST api/prediccion/{productoId}/recalcular
        [HttpPost("{productoId}/recalcular")]
        public async Task<IActionResult> Recalcular(int productoId)
        {
            await _prediccionService.EjecutarAnalisisAsync(productoId);

            var prediccion = _prediccionRepository.ObtenerPorProducto(productoId);

            return Ok(prediccion);
        }

        // GET api/prediccion/analisis
        [HttpGet("analisis")]
        public IActionResult ObtenerTodos()
        {
            var predicciones = _prediccionRepository.ObtenerTodos();
            return Ok(predicciones);
        }
    }
}
