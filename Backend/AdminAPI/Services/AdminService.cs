using AdminAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AdminAPI.Models;

namespace AdminAPI.Services
{
    public class AdminService : IAdminService
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public AdminService(IConfiguration configuration, ApplicationDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        private bool CheckJwtTokenForAdmin(string token)
        {
            // Настройки из appsettings.json
            var secretKey = _configuration["JwtSettings:SecretKey"];
            var issuer = _configuration["JwtSettings:Issuer"];
            var audience = _configuration["JwtSettings:Audience"];

            var tokenHandler = new JwtSecurityTokenHandler();

            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = issuer,
                ValidAudience = audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
                ClockSkew = TimeSpan.Zero
            };

            try
            {
                var principal = tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);

                var roleClaim = principal.FindFirst(ClaimTypes.Role)?.Value;
                if (roleClaim != "admin")
                {
                    return false;
                }

                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<List<User>> UsersList(string token)
        {
            if (CheckJwtTokenForAdmin(token))
            {
                var users = await _context.Users
                .Select(u => new User
                {
                    Id = u.Id,
                    Login = u.Login,
                    Role = u.Role,
                    Status = u.Status,
                })
                .ToListAsync();

                return users;
            }

            return null;
        }

        public async Task<bool> EditRole(string token, int id, string role)
        {
            if (role != "admin" && role != "user") return false;

            try
            {
                if (!CheckJwtTokenForAdmin(token))
                    return false;

                var user = await _context.Users.FindAsync(id);
                if (user == null)
                    return false;

                if (string.IsNullOrEmpty(role))
                    return false;

                user.Role = role;

                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<bool> BlockUser(string token, int id)
        {
            return false;
        }

        public async Task<bool> UnblockUser(string token, int id)
        {
            return false;
        }
    }
}
