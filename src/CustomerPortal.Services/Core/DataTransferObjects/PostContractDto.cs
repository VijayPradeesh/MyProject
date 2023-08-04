using System.ComponentModel.DataAnnotations;

namespace CustomerPortal.Services.Core.DataTransferObjects
{
    public class PostContractDto
    {
        public long UserId { get; set; }
        [Required(ErrorMessage ="Customer is Required")]
        public long CustomerId { get; set; }


        [Required(ErrorMessage = "Contract is Required")]
        public string ContractNumber { get; set; }


        [Required(ErrorMessage = "Action is Required")]
        public bool IsChecked { get; set; }
    }
}
