using AdminAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace AdminAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        // Таблица Users
        public DbSet<User> Users { get; set; }
    }
}