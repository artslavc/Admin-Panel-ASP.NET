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
    }
}
