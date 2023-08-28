using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.AccountUser;

namespace CustomerPortal.Services.Services.UserService
{
    public interface IUserService
    {
        Task<EditUserResponse> EditUserData(EditUserDto _editUserDto, EditUserResponse response);
    }
}
