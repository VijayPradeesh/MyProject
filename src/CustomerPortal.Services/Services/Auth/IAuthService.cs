using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Models;
using CustomerPortal.Services.Core.Responses.Auth;
using static CustomerPortal.Services.Controllers.AuthController;

namespace CustomerPortal.Services.Services.Auth
{
    public interface IAuthService
    {
        Task<RegisterResponse> Register(RegisterDto _userDto, RegisterResponse response);
        Task<LoginResponse> Login(LoginDto _loginDto, LoginResponse response);

        Task<ResetPasswordTempDto> ResetPassword(ResetPasswordDto _resetPasswordDto);

        Task<ChangePasswordResponse> ChangePassword(ChangePasswordDto changePasswordDto, ChangePasswordResponse changePasswordResponse);
    }
}
