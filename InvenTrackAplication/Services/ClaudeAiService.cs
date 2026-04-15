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
            var prompt = $@"Eres un asistente experto en gestión de inventarios.
Analiza la siguiente situación y genera UNA recomendación concisa y accionable
en español (máximo 2 oraciones). Sé específico con los números.

Producto: {nombreProducto}
Stock actual: {stockActual} unidades
Stock mínimo requerido: {stockMinimo} unidades
Consumo diario promedio: {consumoDiario:F1} unidades/día
Demanda estimada próximos 30 días: {demandaEstimada30Dias:F0} unidades
Tendencia: {tendencia}
Punto de reorden: {puntoReorden:F0} unidades
Tipo de alerta: {tipoAlerta}

Responde SOLO con la recomendación, sin explicaciones adicionales ni formato markdown.";

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
