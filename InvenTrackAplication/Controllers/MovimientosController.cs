using InventTrackAI.API.DTOs;
using InventTrackAI.API.Models;
using InventTrackAI.API.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InventTrackAI.API.Controllers
{
    [Authorize(Roles = "Admin, Operador")]
    [ApiController]
    [Route("api/movimientos")]
    public class MovimientosController : Controller
    {
        private readonly IMovimientoInventarioRepository _repository;

        public MovimientosController(IMovimientoInventarioRepository repository)
        {
            _repository = repository;
        }

        [HttpPost]
        public IActionResult Registrar(RegistrarMovimientoDto dto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

                var movimiento = new MovimientoInventario
                {
                    ProductoId = dto.ProductoId,
                    Tipo = dto.Tipo,
                    Cantidad = dto.Cantidad,
                    UsuarioId = userId,
                    Observacion = dto.Observacion
                };

                _repository.RegistrarMovimiento(movimiento);

                return Ok(new { mensaje = "Movimiento registrado correctamente" });

            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
                Console.WriteLine(ex.Message);

            }

        }
    }
}
