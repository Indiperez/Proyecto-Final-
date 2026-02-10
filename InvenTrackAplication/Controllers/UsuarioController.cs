using InventTrackAI.API.DTOs;
using InventTrackAI.API.Models;
using InventTrackAI.API.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InventTrackAI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : Controller
    {
        private readonly IUsuarioRepository _repository;
    
        public UsuarioController(IUsuarioRepository reposository)
        {
            _repository = reposository;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("listar-usuarios")]
        public IActionResult ObtenerTodos()
        {

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized(); 
            }

            var userId = int.Parse(userIdClaim.Value);
           
            var usuarios = _repository.GetAll();
            return Ok(usuarios);
        }

        [HttpPost("crear-usuario")]
        public IActionResult Crear(CrearUsuarioDto dto)
        {
            var usuario = new Usuario
            {
                Nombre = dto.Nombre,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Rol = dto.Rol,
                Activo = true,
            };

            _repository.CrearUsuario(usuario);
            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/estado")]
        public IActionResult CambiarEstado(int id, [FromQuery] bool activo)
        {
            _repository.CambiarEstado(id, activo);
            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/rol")]
        public IActionResult CambiarRol(int id, CambiarRolDto dto)
        {
            _repository.CambiarRol(id, dto.Rol);
            return Ok();
        }

        [Authorize]
        [HttpPut("cambiar-password")]
        public IActionResult CambiarPassword(CambiarPasswordDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var usuario = _repository.ObtenerPorId(userId);

            if (!BCrypt.Net.BCrypt.Verify(dto.PasswordActual, usuario.PasswordHash))
                return BadRequest("Contraseña actual incorrecta");

            var nuevoHash = BCrypt.Net.BCrypt.HashPassword(dto.NuevaPassword);
            _repository.ActualizarPassword(userId, nuevoHash);

            return Ok();
        }
    }
}
