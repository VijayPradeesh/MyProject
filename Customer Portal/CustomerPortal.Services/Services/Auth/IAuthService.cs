using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Models;
using CustomerPortal.Services.Core.Responses.Auth;
using static CustomerPortal.Services.Controllers.AuthController;

namespace CustomerPortal.Services.Services.Auth
{
    public interface IAuthService
    {
        Task<User> Register(RegisterDto _userDto);
        Task<LoginResponse> Login(LoginDto _loginDto, LoginResponse response);

        Task<User> ResetPassword(ResetPasswordDto _resetPasswordDto);

        Task<ChangePasswordResponse> ChangePassword(ChangePasswordDto changePasswordDto, ChangePasswordResponse changePasswordResponse);
    }
}
