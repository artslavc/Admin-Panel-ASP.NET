namespace AdminAPI.Services
{
    public interface IAdminService
    {
        Task<string> UsersList(string token);
        Task<bool> EditRole(string token, string login);
        Task<bool> BlockUser(string token, string login);
        Task<bool> UnblockUser(string token, string login);
    }
}
