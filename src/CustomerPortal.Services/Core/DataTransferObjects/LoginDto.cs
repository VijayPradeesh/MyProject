using System.ComponentModel.DataAnnotations;

namespace CustomerPortal.Services.Core.DataTransferObjects
{
    public class LoginDto
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
