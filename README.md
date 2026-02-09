# InvenTrack AI – Backend

Sistema inteligente de gestión de inventarios desarrollado como API REST para uso real en almacenes y comercios.

## 🧠 Descripción General
InvenTrack AI permite administrar productos, proveedores e inventario utilizando un enfoque basado en movimientos, garantizando trazabilidad, control de stock y generación automática de alertas.

El backend está diseñado para ser consumido por cualquier frontend (Web, Mobile, Desktop).

---

## 🚀 Tecnologías Utilizadas
- ASP.NET Core Web API
- ADO.NET (sin ORM)
- SQL Server
- JWT (Autenticación y Autorización)
- Swagger
- Arquitectura en capas

---

## 🔐 Seguridad
- Autenticación mediante JWT
- Control de acceso por roles:
  - Admin
  - Operador
  - Supervisor
- Protección de endpoints con `[Authorize]`

---

## 📦 Principios Clave del Sistema
- El stock **NO se modifica directamente**
- Todo cambio de inventario se realiza mediante **movimientos**
- Cada movimiento queda asociado a un usuario autenticado
- Las alertas se generan automáticamente

---

## 📂 Módulos Principales
- Autenticación y usuarios
- Productos
- Proveedores
- Movimientos de inventario
- Alertas automáticas
- Reportes de stock y rotación

---

## 🔄 Flujo de Inventario
1. Usuario se autentica
2. Se registra un movimiento (entrada/salida/ajuste)
3. El sistema actualiza el stock
4. Se valida stock negativo
5. Se generan alertas automáticamente (si aplica)

---

## 🧪 Pruebas
La API puede probarse usando:
- Swagger
- Postman

Todas las rutas protegidas requieren token JWT.

---

## 🛠️ Configuración
Configurar la cadena de conexión en: appsettings.json ConnectionStrings


---

## 🗣️ Info para frontend (FRONTEND)

> La API funciona con JWT y roles.  
> El flujo correcto es:
>
> 1. Hacer login y guardar el token
> 2. Enviar el token en el header `Authorization: Bearer {token}`
> 3. **NO existe edición directa de stock**
> 4. El stock se modifica únicamente registrando movimientos
>
> Para restar o sumar inventario debes usar:
> `POST /api/movimientos`
>
> Las alertas y el stock se actualizan automáticamente.
>
> Los productos solo se editan para datos descriptivos (nombre, precio, stock mínimo, etc.), no el stock actual.
>
> Los CRUD de proveedores y Productos funcionan pero el update de Productos en el caso de modificacion de Stock se recomienda que se haga por movimientos.
> 
> Si el frontend respeta este flujo, el sistema funciona correctamente.

---

## 📌 REGLAS IMPORTANTES PARA EL FRONTEND

### ❌ NO hacer en frontend
- No editar stock manualmente
- No calcular stock en frontend
- No crear alertas manuales

### ✅ SÍ hacer en frontend
- Mostrar stock desde la API
- Registrar movimientos
- Mostrar alertas generadas por el backend
- Manejar errores mostrados por la API

---

## 📡 CONTRATO FRONTEND–BACKEND (RESUMIDO)

### Login
```http
POST /api/auth/login

```json
appsettings.json
