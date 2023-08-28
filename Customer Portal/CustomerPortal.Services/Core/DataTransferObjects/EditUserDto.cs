using System.ComponentModel.DataAnnotations;

namespace CustomerPortal.Services.Core.DataTransferObjects
{
    public class EditUserDto
    {

        public int CurrentUserId { get; set; }
        [Required(ErrorMessage ="User Id is Required")]
        public int UserId { get; set; }

        [Required(ErrorMessage ="Email is required")]
        public string Email { get; set; }

        [Required(ErrorMessage ="Role is required")]
        public List<int> RoleId { get; set; }

        [Required(ErrorMessage ="User status is required")]
        public bool IsActive { get; set; }

    }
}
