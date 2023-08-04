namespace CustomerPortal.Services.Core.DataTransferObjects
{
    public class ResetPasswordTempDto
    {
        public string Password { get; set; }
        public bool IsActive { get; set; }
        public bool IsLockedOut { get; set; }

        public bool? IsForgetPassword { get; set; }

    }
}
