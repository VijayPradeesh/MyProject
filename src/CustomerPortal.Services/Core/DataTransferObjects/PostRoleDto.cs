using System.ComponentModel.DataAnnotations;

namespace CustomerPortal.Services.Core.DataTransferObjects
{
    public class PostRoleDto
    {
        public long UserId { get; set; }

        [Required(ErrorMessage = "Company is required")]
        public long CustomerId { get; set; }

        [Required(ErrorMessage ="Role is required")]
        public long RoleId { get; set; }

        public bool IsChecked { get; set; }
    }
}
