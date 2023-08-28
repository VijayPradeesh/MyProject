using CustomerPortal.Services.Controllers.Helper.Auth;
using CustomerPortal.Services.Core.ApplicationDbContext;
using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Models;
using CustomerPortal.Services.Core.Responses.Auth;
using CustomerPortal.Services.Services.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace CustomerPortal.Services.Controllers
{
    [Route("customerPortal/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        public class LoginResponse
        {
            public int Id { get; set; }
            public string userName { get; set; }
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
            public bool IsAdmin { get; set; }
            public HttpContext Res { get; set; }
        }
        public IConfiguration Configuration { get; }
        public CustomerPortalDbContext DbContext { get; }
        private IAuthService AuthService { get; }
        public IAuthHelper AuthHelper { get; }

        public AuthController(IConfiguration configuration, CustomerPortalDbContext dbContext, IAuthService authService, IAuthHelper authHelper)
        {
            Configuration = configuration;
            DbContext = dbContext;
            AuthService = authService;
            AuthHelper = authHelper;
        }

        [Authorize]
        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto _registerDto)
        {
            try
            {
               var user = await AuthService.Register(_registerDto);
                var response = new RegisterResponse();
                if (user.UserId == 0)
                {
                    response.Status = false;
                    response.Message = "Username or email already taken";
                    return StatusCode(403, response);
                }
                response.Status = true;
                response.Message = "User Created Successfully";
                return Ok(response);
            }catch(Exception ex)
            {
                Console.WriteLine(ex.InnerException.ToString());
                return StatusCode(500, "Internal Server Error");
            }
            
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginDto _loginDto)
        {
            try
            {
                var response = new LoginResponse();
                response = await AuthService.Login(_loginDto, response);
                return AuthHelper.ValidateLogin(response);
            }catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return StatusCode(500, "Internal Server Error");  
            }
               
        }

        [Authorize(Roles = "Mears-Admin")]
        [HttpPost("ResetAccount")]
        public async Task<ActionResult<ResetPasswordResponse>> ResetPassword(ResetPasswordDto _resetPasswordDto)
        {
            try
            {
                var response = new ResetPasswordResponse();
                _resetPasswordDto.UserId = Convert.ToInt32(HttpContext.User.FindFirst("UserId").Value);
                var user = await AuthService.ResetPassword(_resetPasswordDto);
                return AuthHelper.ValidateReset(user, response);
            }catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return StatusCode(500, "Internal Server Error");
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
                return AuthHelper.ValidateChangePassword(response);
                
            }catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return StatusCode(500, "Internal Server Error");
            }
            
        }
    }
}
