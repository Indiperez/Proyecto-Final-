using InventTrackAI.API.DTOs;
using InventTrackAI.API.Repositories;
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
            // --- BYPASS AUTHENTICATION ---
            // Accept any credentials and log in as Admin
            return GenerateToken(1, "Admin");
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
