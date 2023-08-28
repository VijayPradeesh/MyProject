using System.ComponentModel.DataAnnotations;

namespace CustomerPortal.Services.Core.DataTransferObjects
{
    public class RegisterDto
    {
        

        [Required(ErrorMessage = "First Name is mandatory")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Last Name is mandatory")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Email Id is mandatory")]
        [EmailAddress(ErrorMessage = "Enter valid Email address")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Role is required")]
        public int RoleId { get; set; }

    }
}
