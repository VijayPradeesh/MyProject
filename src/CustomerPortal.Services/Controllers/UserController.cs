using CustomerPortal.Services.Controllers.Helper;
using CustomerPortal.Services.Core.ApplicationDbContext;
using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.AccountUser;
using CustomerPortal.Services.Core.Responses.UserResponse;
using CustomerPortal.Services.Services.ErrorLogging;
using CustomerPortal.Services.Services.UserService;
using CustomerPortal.Services.Validations.AccountUser;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CustomerPortal.Services.Controllers
{
    [Route("customerPortal/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        public UserController(CustomerPortalDbContext dbContext, IUserService userService, IEditUserDataValidations _editUserDataValidations, IErrorLogging errorLogging, ICentralHelper centralhelper)
        {
            DbContext = dbContext;
            UserService = userService;
            EditUserDataValidations = _editUserDataValidations;
            ErrorLogging = errorLogging;
            Centralhelper = centralhelper;
        }

        public CustomerPortalDbContext DbContext;
        public IUserService UserService { get; }
        public IEditUserDataValidations EditUserDataValidations { get; }
        public IErrorLogging ErrorLogging { get; }
        public ICentralHelper Centralhelper { get; }

        [HttpPost("EditUser")]
        [Authorize]
        public async Task<ActionResult> EditUserData(EditUserDto _editUserdto)
        {
            try
            {
                _editUserdto.AdminId = Convert.ToInt64(HttpContext.User.FindFirst("UserId").Value);
                var response = new EditUserResponse();
                response = EditUserDataValidations.ValidateUserData(_editUserdto, response);
                if (response.status == false)
                {
                    return BadRequest(response);
                }
                response = await UserService.EditUserData(_editUserdto, response);
                if (response.status == false)
                {
                    return NotFound(response);
                }
                return Ok(response);
            }
            catch(Exception ex)
            {
                var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                await ErrorLogging.AddErrorLogging("500", controllerName, innerException, ex, ex.Message.ToString());
                return StatusCode(500, ErrorMessages.ServerError);
            }
           
        }

        [HttpPost("EditProfile")]
        [Authorize]
        public async Task<ActionResult> EditProfile(EditProfile editProfile)
        {
            try
            {
                editProfile.Id = Convert.ToInt64(HttpContext.User.FindFirst("UserId").Value);
                if (editProfile.Id == 0)
                {
                    return BadRequest();
                }
                var response = await UserService.EditProfile(editProfile);
                if (response.status == false)
                {
                    return StatusCode(404, response);
                }
                return Ok(response);
            }catch(Exception ex)
            {
                var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                await ErrorLogging.AddErrorLogging("500", controllerName, innerException, ex, ex.Message.ToString());
                return StatusCode(500, ErrorMessages.ServerError);
            }
            
        }


        [HttpPost("ForgotPassword")]
        [AllowAnonymous]
        public async Task<ActionResult> ForgetPassword(ForgetPasswordDto forgetPasswordDto)
        {
            try
            {
                var response = new ForgetPasswordResponse();
                response = await UserService.ForgetPassword(forgetPasswordDto.Email, response);
                if(response.Status == false)
                {
                    return StatusCode(404, response);
                }
                return Ok(response);
            }
            catch(Exception ex)
            {
                    var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                    var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                    await ErrorLogging.AddErrorLogging("500", controllerName, innerException, ex, ex.Message.ToString());
                    return StatusCode(500, ErrorMessages.ServerError);
            }
            
        }
    }
}
