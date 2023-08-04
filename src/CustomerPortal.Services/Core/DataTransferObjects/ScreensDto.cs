using System.ComponentModel.DataAnnotations;

namespace CustomerPortal.Services.Core.DataTransferObjects
{
    public class ScreensDto
    {
        [Required(ErrorMessage ="Organization is required")]
        public long OrganizationId { get; set; }

        [Required(ErrorMessage ="Role is required")]
        public long RoleId { get; set; }

    }
}
