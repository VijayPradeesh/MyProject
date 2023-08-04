using System.ComponentModel.DataAnnotations;

namespace CustomerPortal.Services.Core.DataTransferObjects
{
    public class RegisterDto
    {
        public long AdminId { get; set; }


        [Required(ErrorMessage = "First Name is mandatory")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Last Name is mandatory")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Email Id is mandatory")]
        [EmailAddress(ErrorMessage = "Enter valid Email address")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Role is required")]
        public long RoleId { get; set; }

        [Required(ErrorMessage ="Organisation is required")]
        public long OrganisationId { get; set; }

        [Required(ErrorMessage ="Please select atleast one region")]
        public List<RegionRequest> Region { get; set; }

    }

    public class RegionRequest
    {
        public long Id { get; set; }
        public string RegionType { get; set; }
    }
}
