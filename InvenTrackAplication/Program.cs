using InventTrackAI.API.Data;
using InventTrackAI.API.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Registrar la connexion a la base de datos como un servicio singleton
builder.Services.AddSingleton<DbConnection>();

// Registrar los repositorios como servicios scoped
builder.Services.AddScoped<ProductoRespository>();
builder.Services.AddScoped<ProveedorRepository>();
builder.Services.AddScoped<AlertaRepository>();
builder.Services.AddScoped<UsuarioRepository>();

builder.Services.AddAuthorization();

// --- CONFIGURACIÓN DE JWT (Obligatorio para Postman) ---
var jwt = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwt["Key"]);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwt["Issuer"],
        ValidAudience = jwt["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});
// --------------------------------------------------------

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // app.UseDeveloperExceptionPage(); // Opcional
}

app.UseHttpsRedirection();

app.UseRouting();

// --- ORDEN IMPORTANTE ---
app.UseAuthentication();
app.UseAuthorization();  
// ------------------------

app.MapControllers();

app.Run();