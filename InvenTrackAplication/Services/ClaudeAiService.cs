using System.Net.Http.Json;

namespace InventTrackAI.API.Services
{
    public class ClaudeAiService : IClaudeAiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _model;
        private readonly string _baseUrl;

        public ClaudeAiService(IConfiguration configuration, HttpClient httpClient)
        {
            _httpClient = httpClient;
            _apiKey = configuration["OpenRouter:ApiKey"]
                ?? throw new Exception("OpenRouter API key not configured");
            _model = configuration["OpenRouter:Model"]
                ?? "meta-llama/llama-3.1-8b-instruct:free";
            _baseUrl = configuration["OpenRouter:BaseUrl"]
                ?? "https://openrouter.ai/api/v1/chat/completions";
        }

        public async Task<string> GenerarRecomendacionAsync(
            string nombreProducto,
            int stockActual,
            int stockMinimo,
            decimal consumoDiario,
            decimal demandaEstimada30Dias,
            string tendencia,
            decimal puntoReorden,
            string tipoAlerta)
        {
            var prompt = $@"Eres un sistema experto en gestión de inventarios con capacidades
de análisis predictivo. Genera una recomendación profesional y detallada en español
basada en el siguiente análisis estadístico del producto.

DATOS DEL ANÁLISIS:
- Producto: {nombreProducto}
- Stock actual: {stockActual} unidades
- Stock mínimo requerido: {stockMinimo} unidades
- Consumo diario promedio (últimos 30 días): {consumoDiario:F2} unidades/día
- Demanda proyectada próximos 30 días: {demandaEstimada30Dias:F0} unidades
- Tendencia de consumo: {tendencia}
- Punto de reorden calculado: {puntoReorden:F0} unidades
- Tipo de alerta detectada: {tipoAlerta}
- Días de stock restante estimado: {(consumoDiario > 0 ? (int)(stockActual / consumoDiario) : 999)} días

INSTRUCCIONES:
1. Responde ÚNICAMENTE en español
2. Máximo 3 oraciones
3. Incluye números específicos del análisis
4. Menciona el impacto si no se actúa
5. Da una acción concreta con cantidad y urgencia
6. NO uses markdown, NO uses listas, solo texto corrido profesional

Recomendación:";

            var requestBody = new
            {
                model = _model,
                max_tokens = 150,
                messages = new[]
                {
                    new { role = "user", content = prompt }
                }
            };

            var request = new HttpRequestMessage(HttpMethod.Post, _baseUrl);
            request.Headers.Add("Authorization", $"Bearer {_apiKey}");
            request.Headers.Add("HTTP-Referer", "https://inventrack.ai");
            request.Headers.Add("X-Title", "InvenTrack AI");
            request.Content = JsonContent.Create(requestBody);

            Console.WriteLine($"[OpenRouter] Enviando request para producto: {nombreProducto}");

            var response = await _httpClient.SendAsync(request);

            Console.WriteLine($"[OpenRouter] Response status: {response.StatusCode}");

            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"[OpenRouter] Error body: {errorBody}");
                throw new Exception($"OpenRouter API error {response.StatusCode}: {errorBody}");
            }

            var result = await response.Content.ReadFromJsonAsync<OpenRouterResponse>();
            var text = result?.Choices?.FirstOrDefault()?.Message?.Content
                ?? "Revisar inventario de este producto.";

            if (text.Length > 500)
                text = text.Substring(0, 497) + "...";

            Console.WriteLine($"[OpenRouter] Recomendación: {text.Substring(0, Math.Min(80, text.Length))}...");

            return text;
        }
    }

    public class OpenRouterResponse
    {
        public List<OpenRouterChoice>? Choices { get; set; }
    }

    public class OpenRouterChoice
    {
        public OpenRouterMessage? Message { get; set; }
    }

    public class OpenRouterMessage
    {
        public string? Content { get; set; }
    }
}
