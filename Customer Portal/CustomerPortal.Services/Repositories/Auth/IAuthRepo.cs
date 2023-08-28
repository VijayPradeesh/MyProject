using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Models;

namespace CustomerPortal.Services.Repositories.Auth
{
    public interface IAuthRepo
    {
        Task<User> RegisterUser(RegisterDto userDto, byte[] passwordHash, byte[] passwordSalt);

        Task<User> GetUser(string UserName);
        Task<string> UpdateLoginData(LoginDto _loginDto, string flag);

        Task<string> GetRole(int UserId);

        Task<User> ResetPassword(ResetPasswordDto _resetUserDto, byte[] passwordHash, byte[] passwordSalt);

        Task<List<PasswordHistory>> GetPasswordHistory(int UserId);

        Task UpdateUserAndPasswordHistory(User user, byte[] passwordSalt, byte[] passwordHash, int UserId, int? AdminId);
    }
}
