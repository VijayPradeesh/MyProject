using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApplication4.Models
{
    public class Student
    {
        //student id
        //student name
        //address
        //parent's name
        //dob
        //grade
        [Key]
        public int id { get; set; }// id of type integer is conssidered as a primary key in entity framework(convention-based)
        //data annotations for validations
        [Required(ErrorMessage ="The field is mandatory")] //error message can also be specified
        [MaxLength(30,ErrorMessage ="Maximum length should be 30 characters")]
        [MinLength(3,ErrorMessage ="Minimum length should be 3 characters")]
        [RegularExpression("^[a-zA-Z]*$",ErrorMessage ="Only alphabets are allowed")]
        public string student_name { get; set; }

        public string address { get; set; }
        [RegularExpression("^[a-zA-Z]*$", ErrorMessage = "Only alphabets are allowed")]
        public string parent_name { get; set; }

        [DisplayFormat(DataFormatString = "{0:dd MMM yyyy}")]
        [Display(Name = "Date of Birthday")]
        [DataType(DataType.Date,ErrorMessage ="incorrect format")]
        [dateValidation]
        public DateTime DOB { get; set; }
        [Range(1,12,ErrorMessage ="grade should be from 1 to 12")]
        public int grade { get; set; }

        


    }
}