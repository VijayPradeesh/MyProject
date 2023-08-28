using CustomerPortal.Services.Core.Models;
using CustomerPortal.Services.Core.Responses.Auth;
using Microsoft.AspNetCore.Mvc;
using static CustomerPortal.Services.Controllers.AuthController;

namespace CustomerPortal.Services.Controllers.Helper.Auth
{
    public class AuthHelper : ControllerBase, IAuthHelper
    {
        [NonAction]
        public ActionResult ValidateLogin(LoginResponse response)
        {
            if (response.IsInvalidPassword == true)
            {
                return Unauthorized(response);
            }
            else if (response.IsUserFound == false)
            {
                return NotFound(response);
            }
            else if (response.IsLockedOut)
            {
                return StatusCode(423, response);
            }
            else if (response.IsPasswordExpired)
            {
                return StatusCode(403, response);
            }
            else if (response.IsAttemptsExceeded)
            {
                return Unauthorized(response);
            }
            else if (!response.IsActiveUser)
            {
                return StatusCode(403, response);
            }
            return Ok(response);
        }

        [NonAction]
        public ActionResult ValidateReset(User user, ResetPasswordResponse response)
        {
            if (user == null)
            {
                response.Status = false;
                response.Message = "User Not Found";
                return NotFound(response);
            }
            else if (user != null && user.IsActive == false)
            {
                response.Status = false;
                response.Message = "Inactive User";
                return StatusCode(403, response);
            }
            else if (user != null && user.IsLockOut)
            {
                response.Status = false;
                response.Message = "User is Locked Out";
                return StatusCode(423, response);
            }
            response.Status = true;
            response.Message = "Password Changed Successfully! An email been sent to the Account User.";
            return Ok("Password Changed Successfully");
        }

        [NonAction]
        public ActionResult ValidateChangePassword(ChangePasswordResponse response)
        {
            if (response.InValidPassword)
            {
                return Unauthorized(response);
            }
            else if (!response.IsUserFound)
            {
                return NotFound(response);
            }
            else if (!response.IsActiveUser)
            {
                return StatusCode(403, response);
            }
            else if (response.IsUserLockedOut)
            {
                return StatusCode(423, response);
            }
            else if (response.IsAlreadyExistingPassword)
            {
                return BadRequest(response);
            }
            else if (response.ExceptionOccured)
            {
                return StatusCode(500, response);
            }
            return Ok(response);
            // return Ok();
        }
    }
}
