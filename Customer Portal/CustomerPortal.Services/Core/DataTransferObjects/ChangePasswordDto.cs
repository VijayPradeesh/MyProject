using System.ComponentModel.DataAnnotations;

namespace CustomerPortal.Services.Core.DataTransferObjects
{
    public class ChangePasswordDto
    {
        [Required(ErrorMessage ="User Id is required")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; }


        [Required(ErrorMessage = "Current Password is required")]
        public string CurrentPassword { get; set; }


        [Required(ErrorMessage = "New Password is required")]
        [RegularExpression("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#$^+=!*()@%&]).{12,}$", ErrorMessage ="Invalid Password. Your password should have an Upper case, Lower case, numerical value and a special character")]
        public string NewPassword { get; set; }


        [Compare("NewPassword", ErrorMessage ="New password is not same as the comfirm password")]
        [Required(ErrorMessage = "Confirm Password is required")]
        public string ConfirmNewPassword { get; set; }

    }
}
