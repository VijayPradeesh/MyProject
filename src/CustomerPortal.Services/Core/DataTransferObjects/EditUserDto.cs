using CustomerPortal.Services.Core.Responses.LookUp;
using System.ComponentModel.DataAnnotations;

namespace CustomerPortal.Services.Core.DataTransferObjects
{
    public class EditUserDto
    {

        public long AdminId { get; set; }
        [Required(ErrorMessage ="User Id is Required")]
        public long UserId { get; set; }

        [Required(ErrorMessage ="Email is required")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Firstname is required")]
        [MaxLength(20, ErrorMessage ="Maximum length should be less than 20 characters")]
        public string FirstName { get; set; }
        [Required(ErrorMessage = "Lastname is required")]
        [MaxLength(20, ErrorMessage = "Maximum length should be less than 20 characters")]
        public string LastName { get; set; }

        [Required(ErrorMessage ="Organisation is required")]
        public long TypeId { get; set; }


        [Required(ErrorMessage ="Please select atleast one region")]
        public List<UserRegion> Region { get; set; }

        [Required(ErrorMessage ="Role is required")]
        public long RoleId { get; set; }

        [Required(ErrorMessage ="User status is required")]
        public bool IsActive { get; set; }

    }

    public class EditProfile
    {
        public long Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string Signature { get; set; }

        public bool flag { get; set; }

    }


}
