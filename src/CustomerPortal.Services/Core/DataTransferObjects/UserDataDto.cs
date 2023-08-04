using CustomerPortal.Services.Core.Models;

namespace CustomerPortal.Services.Core.DataTransferObjects
{
    public class UserDataDto : User
    {
        public byte[] passwordSalt { get; set; }
        public byte[] passwordHash { get; set; }
        public bool IsPasswordActive { get; set; }
    }
}
