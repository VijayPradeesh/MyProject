using CustomerPortal.Services.Core.Responses.LookUp;

namespace CustomerPortal.Services.Services.LookUp
{
    public interface ILookUp
    {
        Task<List<RoleType>> GetAllRoles();

        Task<List<UsersDto>> GetAllUsers(int Id);

        Task<List<ModuleUserRole>> GetModuleUserRoles(int id);
    }
}
