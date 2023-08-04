using CustomerPortal.Services.Core.DataTransferObjects;
using System.ComponentModel.DataAnnotations;

namespace CustomerPortal.Services.Validations.CustomValidations
{
    public class TypeValidation : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var addNewInLookUp = (AddNewInLookUp)validationContext.ObjectInstance;
            if ((addNewInLookUp.flag.ToLower() == "organization" || addNewInLookUp.flag.ToLower() == "region" || addNewInLookUp.flag.ToLower() == "role"))
            {
                return ValidationResult.Success;
               
            }
            else
            {
                return new ValidationResult("Invalid Type");
            }

        }
    }
}
