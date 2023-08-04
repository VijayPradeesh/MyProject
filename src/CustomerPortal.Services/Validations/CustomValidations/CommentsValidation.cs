using CustomerPortal.Services.Core.DataTransferObjects;
using System.ComponentModel.DataAnnotations;

namespace CustomerPortal.Services.Validations.CustomValidations
{
    public class CommentsValidation : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var statusChangeDto = (StatusChangeDto)validationContext.ObjectInstance;
            if (statusChangeDto.Status.ToLower() =="rejected" && (statusChangeDto.ReasonRejectionId == null ||statusChangeDto.ReasonRejectionId == Int64.Parse("36") ) ) {
                if(statusChangeDto.Comments == null || statusChangeDto.Comments == "")
                {
                    return new ValidationResult("Comments is mandatory to reject a job");
                }else
                {
                    return ValidationResult.Success;
                }
            }else
            {
                return ValidationResult.Success;
            }
        }
    }

    
}
