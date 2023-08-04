using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.AccountUser;
using CustomerPortal.Services.Core.Responses.UserResponse;

namespace CustomerPortal.Services.Repositories.UserRepo
{
    public interface IUserRepo
    {
        Task<EditUserResponse> EditUserData(EditUserDto _editUserDto, EditUserResponse response);
        Task<ForgetPasswordResponse> ForgetPassword(string Email, ForgetPasswordResponse response);

        Task<EditProfileResponse> EditProfile(EditProfile editProfile);
    }
}
