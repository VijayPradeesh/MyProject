using CustomerPortal.Services.Core.Responses.LookUp;

namespace CustomerPortal.Services.Repositories.LookUpRepo
{
    public interface ILookUpRepo
    {
        Task<List<RoleType>> GetAllRoles();

        Task<List<UsersDto>> GetAllUsers(int id);

        Task<List<ModuleUserRole>> GetModuleUserRoles(int id);
    }
}
