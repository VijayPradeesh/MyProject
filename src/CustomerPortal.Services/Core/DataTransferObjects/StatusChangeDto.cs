using CustomerPortal.Services.Validations.CustomValidations;
using System.ComponentModel.DataAnnotations;

namespace CustomerPortal.Services.Core.DataTransferObjects
{
    public class StatusChangeDto
    {
        [Required(ErrorMessage ="Job Id is required")]
        public long JobId { get; set; }

        public long UserId { get; set; }

        [Required(ErrorMessage = "Status is required")]
        public string   Status{ get; set; }

        public string Comments { get; set; }

        public long? ReasonRejectionId { get; set; }

        public string? IPAddress { get; set; }

        public string? Signature { get; set; }

        public string? Requester { get; set; }

        public bool IsResurfacing { get; set; }
    }
}
