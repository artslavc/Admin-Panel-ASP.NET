namespace AdminAPI.Models
{
    public class LoginRequest
    {
        public LoginRequest() { }

        public string Login { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}