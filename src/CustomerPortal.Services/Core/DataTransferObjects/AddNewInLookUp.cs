using CustomerPortal.Services.Validations.CustomValidations;
using System.ComponentModel.DataAnnotations;

namespace CustomerPortal.Services.Core.DataTransferObjects
{
    public class AddNewInLookUp
    {
        public long UserId { get; set; }
        [Required(ErrorMessage ="This field is required")]
        public string Value { get; set; }
        [Required(ErrorMessage ="Type is required")]

        [TypeValidation]
        public string flag { get; set; }

        public string Type { get; set; }
        public string Description { get; set; }

        public void SetTypeAndDescription()
        {
            if(this.flag.ToLower().Trim() == "organization")
            {
                this.Type = "Company";
                this.Description = "Company";
            }
            else if(this.flag.ToLower().Trim() == "region")
            {
                this.Type = "ContractRegion";
                // this.Description = this.Description;
            }
            else if(this.flag.ToLower().Trim() == "role")
            {
                this.Type = "UserRole";
                this.Description = this.Value + " Role";
            }
        }
    }
}
