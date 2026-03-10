using InventTrackAI.API.Repositories;
using InventTrackAI.API.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace InventTrackAI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly ProductoRespository _productoRepository;
        private readonly IUsuarioRepository _usuarioRepository;

        public TestController(ProductoRespository productoRepository, IUsuarioRepository usuarioRepository)
        {
            _productoRepository = productoRepository;
            _usuarioRepository = usuarioRepository;
        }

        [HttpGet("connection")]
        public IActionResult TestConnection()
        {
            try
            {
                var productos = _productoRepository.GetAll();
                return Ok(new
                {
                    success = true,
                    message = "Database connection successful",
                    productCount = productos.Count
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Database connection failed",
                    error = ex.Message
                });
            }
        }

        [HttpGet("usuarios")]
        public IActionResult TestUsuariosTable()
        {
            try
            {
                var usuarios = _usuarioRepository.GetAll();
                return Ok(new
                {
                    success = true,
                    message = "Usuarios table accessible",
                    userCount = usuarios.Count(),
                    users = usuarios.Select(u => new { u.Id, u.Nombre, u.Email, u.Rol, u.Activo })
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Usuarios table not accessible or doesn't exist",
                    error = ex.Message
                });
            }
        }

        [HttpPost("test-register")]
        public IActionResult TestUserRegistration()
        {
            try
            {
                var testUser = new Models.Usuario
                {
                    Nombre = "Test User",
                    Email = "test@example.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("test123"),
                    Rol = "Operador",
                    Activo = true
                };

                _usuarioRepository.CrearUsuario(testUser);
                return Ok(new
                {
                    success = true,
                    message = "Test user created successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Failed to create test user",
                    error = ex.Message
                });
            }
        }
    }
}
