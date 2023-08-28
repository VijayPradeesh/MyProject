using CustomerPortal.Services.Validations.CustomValidations;
using System.ComponentModel.DataAnnotations;

namespace CustomerPortal.Services.Core.DataTransferObjects
{
    public class StatusChangeDto
    {
        [Required(ErrorMessage ="Job Id is required")]
        public long JobId { get; set; }

        public int UserId { get; set; }

        [Required(ErrorMessage = "Status is required")]
        public int  StatusId { get; set; }

        [CommentsValidation]
        public string Comments { get; set; }
    }
}
