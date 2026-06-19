using AdminAPI.Models;

namespace AdminAPI.Services
{
    public interface IAdminService
    {
        Task<List<User>> UsersList(string token);
        Task<bool> EditRole(string token, int id, string role);
        Task<bool> BlockUser(string token, int id);
        Task<bool> UnblockUser(string token, int id);
    }
}
