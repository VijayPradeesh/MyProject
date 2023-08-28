using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.AccountUser;
using CustomerPortal.Services.Repositories.UserRepo;

namespace CustomerPortal.Services.Services.UserService
{
    public class UserService : IUserService
    {
        public UserService(IUserRepo userRepo)
        {
            UserRepo = userRepo;
        }

        public IUserRepo UserRepo { get; }

        public async Task<EditUserResponse> EditUserData(EditUserDto _editUserDto, EditUserResponse response)
        {
            return await UserRepo.EditUserData(_editUserDto, response);
        }
    }
}
