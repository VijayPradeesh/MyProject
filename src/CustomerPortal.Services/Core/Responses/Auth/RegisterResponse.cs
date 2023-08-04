namespace CustomerPortal.Services.Core.Responses.Auth
{
    public class RegisterResponse
    {
        public long UserId { get; set; }
        public bool Status { get; set; }
        public string Password { get; set; }
        public string Message { get; set; }

        public bool UserNameTaken { get; set; }
        public bool TypeRoleNotFound { get; set; }

    }
}
