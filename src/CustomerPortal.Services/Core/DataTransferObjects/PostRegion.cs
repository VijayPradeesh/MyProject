using System.ComponentModel.DataAnnotations;

namespace CustomerPortal.Services.Core.DataTransferObjects
{
    public class PostRegion
    {
        public long UserId { get; set; }

        [Required(ErrorMessage ="Company is required")]
        public long CustomerId { get; set; }

        [Required(ErrorMessage = "Contract is required")]
        public string Contract { get; set; }

        [Required(ErrorMessage = "Region is required")]
        public long RegionId { get; set; }

        [Required]
        public bool IsChecked { get; set; }
    }
}
