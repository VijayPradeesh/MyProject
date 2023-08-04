using CustomerPortal.Services.Controllers.Helper;
using CustomerPortal.Services.Controllers.Helper.Auth;
using CustomerPortal.Services.Core.ApplicationDbContext;
using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Models;
using CustomerPortal.Services.Core.Responses.Auth;
using CustomerPortal.Services.Services.Auth;
using CustomerPortal.Services.Services.ErrorLogging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace CustomerPortal.Services.Controllers
{
    
    [Route("customerPortal/[controller]")]
    [Authorize]
    [ApiController]
    public class AuthController : ControllerBase
    {
        public class LoginResponse
        {
            public string? Token { get; set; }
            public bool IsInvalidPassword { get; set; }
            public bool IsLockedOut { get; set; }
            public bool IsPasswordExpired { get; set; }
            public bool IsActiveUser { get; set; }
            public bool IsAttemptsExceeded { get; set; }
            public bool IsUserFound { get; set; }
            public string? message { get; set; }
            public bool flag { get; set; }
            public bool IsNewUser { get; set; }

            public List<Screens> Screens { get; set; }
        }

        public class Screens
        {
            public long Id { get; set; }
            public string Screen { get; set; }
            public bool IsAssigned { get; set; }
        }
        public IConfiguration Configuration { get; }
        public CustomerPortalDbContext DbContext { get; }
        private IAuthService AuthService { get; }
        public IAuthHelper AuthHelper { get; }
        public IErrorLogging ErrorLogging { get; }
        public ICentralHelper CentralHelper { get; }

        public AuthController(IConfiguration configuration, CustomerPortalDbContext dbContext, IAuthService authService, IAuthHelper authHelper, IErrorLogging errorLogging, ICentralHelper centralHelper)
        {
            Configuration = configuration;
            DbContext = dbContext;
            AuthService = authService;
            AuthHelper = authHelper;
            ErrorLogging = errorLogging;
            CentralHelper = centralHelper;
        }


        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto _registerDto)
        {
            var response = new RegisterResponse();
            try
            {
                _registerDto.AdminId = Convert.ToInt32(HttpContext.User.FindFirst("UserId").Value);
                response = await AuthService.Register(_registerDto, response);
                // var response = new RegisterResponse();
                if (response.Status == false)
                {
                    return StatusCode(403, response);
                }
                response.Status = true;
                response.Message = ErrorMessages.UserCreatedSuccessfully;
                return Ok(response);
            }catch(Exception ex)
            {
                response.Status = false;
                response.Message = ErrorMessages.ServerError;
                var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                await ErrorLogging.AddErrorLogging("500", controllerName, innerException, ex, ex.Message.ToString());
                // return StatusCode(500, ex.Message);
                return StatusCode(500, response);
            }
            
        }


        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult> Login(LoginDto _loginDto)
        {
            try
            {
                var response = new LoginResponse();
                response = await AuthService.Login(_loginDto, response);
                if (response.IsInvalidPassword == true)
                {
                    return NotFound(response);
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
            catch(Exception ex)
            {
                var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                await ErrorLogging.AddErrorLogging("500", controllerName, innerException, ex, ex.Message.ToString());
                return StatusCode(500, ErrorMessages.ServerError);  
            }
               
        }

        [Authorize]
        [HttpPost("ResetPassword")]
        public async Task<ActionResult<ResetPasswordResponse>> ResetPassword(ResetPasswordDto _resetPasswordDto)
        {
            try
            {
                var response = new ResetPasswordResponse();
                _resetPasswordDto.UserId = Convert.ToInt32(HttpContext.User.FindFirst("UserId").Value);
                var user = await AuthService.ResetPassword(_resetPasswordDto);
                if (user == null)
                {
                    response.Status = false;
                    response.Message = ErrorMessages.UserNotFound; // "User Not Found";
                    return NotFound(response);
                }
                else if (user != null && user.IsActive == false)
                {
                    response.Status = false;
                    response.Message = ErrorMessages.InActiveUser; // "Inactive User";
                    return StatusCode(403, response);
                }
                else if (user != null && user.IsLockedOut)
                {
                    response.Status = false;
                    response.Message = ErrorMessages.LockedOut; // "User is Locked Out";
                    return StatusCode(423, response);
                }
                //else if (user != null && user.IsForgetPassword == false)
                //{
                //    response.Status = false;
                //    response.Message =  "Please contact the user to request for a password";
                //    return StatusCode(403, response);
                //}
                response.Password = user.Password;
                response.Status = true;
                response.Message = ErrorMessages.PasswordChangedSuccessfully; // "Password Changed Successfully!";
                return Ok(response);
            }
            catch(Exception ex)
            {
                var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                await ErrorLogging.AddErrorLogging("500", controllerName, innerException, ex, ex.Message.ToString());
                return StatusCode(500, ex.Message);
            }
             
        }

        [Authorize]
        [HttpPost("changePassword")]
        public async Task<ActionResult> ChangePassword (ChangePasswordDto _changePasswordDto)
        {
            var response = new ChangePasswordResponse();
            try 
            {
                var id = Convert.ToInt32(HttpContext.User.FindFirst("UserId").Value);
                _changePasswordDto.UserId = id;
                response = await AuthService.ChangePassword(_changePasswordDto, response);
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
