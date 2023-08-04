using System.ComponentModel.DataAnnotations;

namespace CustomerPortal.Services.Core.DataTransferObjects
{
    public class UserDto
    {
        [Required(ErrorMessage ="Username is mandatory")]
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        [Required(ErrorMessage ="Email Id is mandatory")]
        [EmailAddress(ErrorMessage = "Enter valid Email address")]
        public string Email { get; set; }
    }
}
