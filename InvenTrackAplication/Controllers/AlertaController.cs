using InventTrackAI.API.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace InventTrackAI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AlertaController : Controller
    {
        private readonly AlertaRepository _repository;

        public AlertaController(AlertaRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public IActionResult GetPendientes()
        {
            return Ok(_repository.GetPendientes());
        } 

        [HttpGet("{id}/leida")]
        public IActionResult MarcarLeida(int id)
        {
            _repository.MarcarLeida(id);
            return Ok(new { message = "Alerta marcada como leida." });
        }
    }
}
