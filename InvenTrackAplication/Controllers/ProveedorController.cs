using InventTrackAI.API.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace InventTrackAI.API.Controllers
{
    [ApiController]
    [Route("api/{controller}")]
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
            return Ok(proveedores);
        }

    }
}
