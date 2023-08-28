namespace CustomerPortal.Services.Core.DataTransferObjects
{
    public class ResetPasswordDto
    {
        public int UserId { get; set; }
        public int RequestedUserId { get; set; }
    }
}
