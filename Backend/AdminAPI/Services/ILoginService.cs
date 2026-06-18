namespace AdminAPI.Services
{
    public interface ILoginService
    {
        Task<string> ValidateUserLogin(string login, string password);
        Task<bool> CheckJwtToken(string token);
        Task<string> ValidateUserRegister(string login, string password);
    }
}
