namespace CustomerPortal.Services.Core.Responses.Auth
{
    public class ChangePasswordResponse
    {
        public bool InValidPassword { get; set; }
        public bool IsUserFound { get; set; }   
        public bool IsInvalidUser { get; set; }
        public bool IsActiveUser { get; set; }
        public bool IsUserLockedOut { get; set; }

        public bool IsAlreadyExistingPassword { get; set; }
        public bool ExceptionOccured { get; set; }
        public bool Status { get; set; }
        public string Message { get; set; }
    }
}
