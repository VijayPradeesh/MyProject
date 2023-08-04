using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.LookUp;

namespace CustomerPortal.Services.Repositories.LookUpRepo
{
    public interface ILookUpRepo
    {
        Task<List<RoleType>> GetAllRoles(long Id);

        Task<List<AllUsersDto>> GetAllUsers(long id, GetUsersDto _getUsersDto);

        Task<List<ModuleUserRole>> GetModuleUserRoles(int id);

        Task<List<UserType>> GetUserTypeList();

        Task<List<UserRegion>> GetRegions(long Id);

        Task<DropDownDto> GetDropDownValues(long Id);

        Task<AllUsersDto?> GetUser(long Id);
    }
}
