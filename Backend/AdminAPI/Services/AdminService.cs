using AdminAPI.Data;

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

        public async Task<string> UsersList(string token)
        {
            return null;
        }

        public async Task<bool> EditRole(string token, string login)
        {
            return false;
        }

        public async Task<bool> BlockUser(string token, string login)
        {
            return false;
        }

        public async Task<bool> UnblockUser(string token, string login)
        {
            return false;
        }
    }
}
