using InventTrackAI.API.DTOs;
using InventTrackAI.API.Repositories;
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

        [HttpGet]
        public IActionResult GetAll()
        {
            var productos = _repository.GetAll();
            return Ok(productos);
        }

        [HttpPost]
        public IActionResult Create([FromBody] DTOs.ProductoCreateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Nombre))
                return BadRequest(new { message = "El nombre del producto es obligatorio." });

            if(dto.StockMinimo < 0 || dto.StockActual < 0)
                return BadRequest(new { message = "Los valores de stock no puede ser negativo." });

            if (dto.StockMinimo > dto.StockActual)
                return BadRequest(new { message = "El stock actual no puede ser menor al stock minimo." });

            _repository.Create(dto);
            return Ok(new { message = "Producto creado con exito!" });

        }

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

        [HttpGet("Rotacion-Baja")]
        public IActionResult GetProductosRotacionBaja()
        {
            return Ok(_repository.GetBajaRotacion());
        }
    }
}