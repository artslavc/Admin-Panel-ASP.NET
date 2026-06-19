using AdminAPI.Services;
using Microsoft.AspNetCore.Mvc;
using AdminAPI.Models;
using System.Text.Json;

[ApiController]
[Route("api/[controller]")]  // /api/admin
public class AdminController : ControllerBase
{
    private readonly ILogger<AuthController> _logger;
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService, ILogger<AuthController> logger)
    {
        _adminService = adminService;
        _logger = logger;
    }

    // GET: /api/admin/users
    [HttpGet("users")]
    public async Task<IActionResult> Users()
    {
        // Вытаскивает токен из заголовка Authorization
        var authorizationHeader = Request.Headers["Authorization"].ToString();

        if (string.IsNullOrEmpty(authorizationHeader))
            return BadRequest("Authorization header is missing");

        if (!authorizationHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            return BadRequest("Invalid authorization header format. Expected 'Bearer <token>'");

        var token = authorizationHeader.Substring("Bearer ".Length).Trim();

        if (string.IsNullOrEmpty(token))
            return BadRequest("Token is empty");

        var clientIp = HttpContext.Connection.RemoteIpAddress?.ToString();
        _logger.LogInformation($"[*] {DateTime.Now} | {clientIp} -> GET /api/admin/users");

        var result = await _adminService.UsersList(token);

        return result != null ? Ok(result) : Unauthorized();
    }

    // PATCH: /api/admin/users/[id]
    [HttpPatch("users/{id}")]
    public async Task<IActionResult> Role(int id, [FromBody] EditRoleRequest request)
    {
        // Вытаскивает токен из заголовка Authorization
        var authorizationHeader = Request.Headers["Authorization"].ToString();

        if (string.IsNullOrEmpty(authorizationHeader))
            return BadRequest("Authorization header is missing");

        if (!authorizationHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            return BadRequest("Invalid authorization header format. Expected 'Bearer <token>'");

        var token = authorizationHeader.Substring("Bearer ".Length).Trim();

        if (string.IsNullOrEmpty(token))
            return BadRequest("Token is empty");

        var clientIp = HttpContext.Connection.RemoteIpAddress?.ToString();
        _logger.LogInformation($"[*] {DateTime.Now} | {clientIp} -> PATCH /api/admin/users/{id}");

        var result = await _adminService.EditRole(token, id, request.Role);

        return result ? Ok() : Unauthorized();
    }
}