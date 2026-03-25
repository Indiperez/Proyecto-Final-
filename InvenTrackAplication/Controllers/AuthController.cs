using InventTrackAI.API.DTOs;
using InventTrackAI.API.Models;
using InventTrackAI.API.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace InventTrackAI.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : Controller
    {
        private UsuarioRepository _repositorio;
        private IConfiguration _config;

        public AuthController(UsuarioRepository repositorio, IConfiguration config)
        {
            _repositorio = repositorio;
            _config = config;
        }

        [HttpPost("login")]
        public IActionResult Login(LoginDto dto)
        {
            var usuario = _repositorio.GetByEmail(dto.Email);

            if (usuario == null)
                return Unauthorized(new { message = "Credenciales inválidas" });

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, usuario.Value.PasswordHash))
                return Unauthorized(new { message = "Credenciales inválidas" });

            return GenerateToken(usuario.Value.Id, usuario.Value.Rol);
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register([FromBody] CrearUsuarioDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Nombre) || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest(new { message = "Todos los campos son obligatorios." });

            var existente = _repositorio.GetByEmail(dto.Email);
            if (existente != null)
                return BadRequest(new { message = "Ya existe un usuario con ese correo." });

            var usuario = new Usuario
            {
                Nombre = dto.Nombre,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Rol = dto.Rol ?? "Operador",
                Activo = true,
            };

            _repositorio.CrearUsuario(usuario);
            return Ok(new { message = "Usuario creado exitosamente." });
        }

        private IActionResult GenerateToken(int userId, string rol)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Role, rol)
            };

            var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"]));

            var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(
                int.Parse(_config["Jwt:ExpireMinutes"])),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return Ok(new AuthResponseDto
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Rol = rol
            });
        }
    }
}
