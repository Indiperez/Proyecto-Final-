using InventTrackAI.API.DTOs;
using InventTrackAI.API.Models;
using InventTrackAI.API.Repositories.Interfaces;
using InventTrackAI.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InventTrackAI.API.Controllers
{
    // [Authorize(Roles = "Admin, Operador")]
    [ApiController]
    [Route("api/movimientos")]
    public class MovimientosController : Controller
    {
        private readonly IMovimientoInventarioRepository _repository;
        private readonly IPrediccionService _prediccionService;

        public MovimientosController(
            IMovimientoInventarioRepository repository,
            IPrediccionService prediccionService)
        {
            _repository = repository;
            _prediccionService = prediccionService;
        }

        [HttpPost]
        public IActionResult Registrar(RegistrarMovimientoDto dto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "1");

                var movimiento = new MovimientoInventario
                {
                    ProductoId = dto.ProductoId,
                    Tipo = dto.Tipo,
                    Cantidad = dto.Cantidad,
                    UsuarioId = userId,
                    Observacion = dto.Observacion
                };

                _repository.RegistrarMovimiento(movimiento);

                if (dto.Tipo == "Salida")
                {
                    _ = Task.Run(async () =>
                    {
                        try { await _prediccionService.EjecutarAnalisisAsync(dto.ProductoId); }
                        catch { /* fire-and-forget: errors don't affect the HTTP response */ }
                    });
                }

                return Ok(new { mensaje = "Movimiento registrado correctamente" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
