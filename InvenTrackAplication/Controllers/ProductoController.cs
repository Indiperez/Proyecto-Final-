using InventTrackAI.API.DTOs;
using InventTrackAI.API.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;

namespace InventTrackAI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductoController : Controller
    {
        private readonly ProductoRespository _repository;

        public ProductoController(ProductoRespository repository)
        {
            _repository = repository;
        }

        // [Authorize(Roles = "Admin")]
        [HttpGet]
        public IActionResult GetAll()
        {
            var productos = _repository.GetAll();
            return Ok(productos);
        }

        // [Authorize(Roles = "Admin")]
        [HttpPost]
        public IActionResult Create([FromBody] DTOs.ProductoCreateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Nombre))
                return BadRequest(new { message = "El nombre del producto es obligatorio." });

            if (dto.StockMinimo < 0 || dto.StockActual < 0)
                return BadRequest(new { message = "Los valores de stock no puede ser negativo." });

            if (dto.StockMinimo > dto.StockActual)
                return BadRequest(new { message = "El stock actual no puede ser menor al stock minimo." });

            _repository.Create(dto);
            return Ok(new { message = "Producto creado con exito!" });

        }

        // [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] ProductoUpdateDto dto)
        {
            var updated = _repository.Update(id, dto);
            if (!updated) return NotFound(new { message = "Producto no encontrado" });
            return Ok(new { message = "Producto actualizado con exito!" });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var deleted = _repository.Delete(id);
            if (!deleted) return NotFound(new { message = "Producto no encontrado" });
            return Ok(new { message = "Producto eliminado con exito!" });


        }

        // [Authorize(Roles = "Admin")]
        [HttpGet("Stock-bajo")]
        public IActionResult GetProductosStockBajo()
        {
            var productos = _repository.GetStockBajo();
            return Ok(productos);
        }

        [HttpGet("Rotacion-Alta")]
        public IActionResult GetProductosRotacionAlta()
        {
            return Ok(_repository.GetAltaRotacion());
        }

        // [Authorize(Roles = "Admin")]
        [HttpGet("Rotacion-Baja")]
        public IActionResult GetProductosRotacionBaja()
        {
            return Ok(_repository.GetBajaRotacion());
        }

        // [Authorize(Roles = "Admin")]
        [HttpGet("Punto-Reorden")]
        public IActionResult GetProductosPuntoReorden([FromServices] AlertaRepository alertas)
        {
            var items = _repository.GetPuntoReorden();
            foreach (var i in items.Where(x => x.Reordenar))
            {
                alertas.CrearSiNoExiste(i.ProductoId, $"Reabastecimiento necesario: '{i.Producto}'. El nivel de stock actual requiere generar una orden de compra.");
            }

            return Ok(items);
        }
    }
}