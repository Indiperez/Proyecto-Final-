using InventTrackAI.API.DTOs;
using InventTrackAI.API.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace InventTrackAI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProveedorController : Controller
    {
        private readonly ProveedorRepository _repository;
        public ProveedorController(ProveedorRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var proveedores = _repository.GetAll();

            if(proveedores.IsNullOrEmpty())
                return NotFound(new { message = "No se encontraron proveedores."});

            return Ok(proveedores);
        }

        [HttpPost]
        public IActionResult Create([FromBody] ProveedorCreateDto dto)
        {
            _repository.Create(dto);
            return Ok(new {message = "Proveedor creado con exito!"});
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody]ProveedorUpdateDto dto)
        {
            var update =  _repository.Update(id, dto);
            if(!update) return NotFound(new { message = "Proveedor no encontrado."});

            return Ok(new { message = "Proveedor actualizado con exito!"});
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var deleted = _repository.Delete(id);
            if (!deleted) return NotFound(new { message = "Proveedor no encontrado."});
            return Ok( new { message = "Proveedor eliminado con exito!"});
        }

    }
}
