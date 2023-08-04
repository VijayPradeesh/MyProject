namespace CustomerPortal.Services.Core.Responses.Auth
{
    public class ResetPasswordResponse
    {
        public long UserId { get; set; }
        public string Password { get; set; }
        public string Message { get; set; }
        public bool Status { get; set; }    
    }
}
