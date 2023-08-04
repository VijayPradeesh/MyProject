using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Models;
using CustomerPortal.Services.Core.Responses.Auth;
using static CustomerPortal.Services.Controllers.AuthController;

namespace CustomerPortal.Services.Repositories.Auth
{
    public interface IAuthRepo
    {
        Task<RegisterResponse> RegisterUser(RegisterDto userDto, byte[] passwordHash, byte[] passwordSalt, RegisterResponse response);

        Task<UserDataDto> GetUser(string UserName);
        Task<string> UpdateLoginData(LoginDto _loginDto, string flag);

        Task<List<UserRolesDto>> GetRole(long UserId);

        Task<User> ResetPassword(ResetPasswordDto _resetUserDto, byte[] passwordHash, byte[] passwordSalt);

        Task<List<PasswordHistory>> GetPasswordHistory(long UserId);

        Task UpdateUserAndPasswordHistory(User user, byte[] passwordSalt, byte[] passwordHash, long UserId, long? AdminId);

        Task<List<Screens>> GetAllScreens(long OrganizationId, long RoleId);
    }
}
