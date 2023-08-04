using System.ComponentModel.DataAnnotations;

namespace CustomerPortal.Services.Core.DataTransferObjects
{
    public class PostScreensDto : PostRoleDto
    {
        [Required(ErrorMessage ="Screen is required")]
        public long ScreenId { get; set; }
    }
}
