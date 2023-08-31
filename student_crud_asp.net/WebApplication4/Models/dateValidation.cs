using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace WebApplication4.Models
{
    public class dateValidation : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var student = (Student)validationContext.ObjectInstance;

            if (student.DOB == null) { return new ValidationResult("Date of Birth is mandatory"); }

            var age = DateTime.Now.Year - student.DOB.Year;
            return (age < 19 && age > 4) ? ValidationResult.Success :new ValidationResult("invalid Date of Birth. Age should be between 4 an d 19");
           
        }
    }
}