using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.AccountUser;

namespace CustomerPortal.Services.Repositories.UserRepo
{
    public interface IUserRepo
    {
        Task<EditUserResponse> EditUserData(EditUserDto _editUserDto, EditUserResponse response);
    }
}
