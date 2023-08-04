using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.LookUp;
using CustomerPortal.Services.Repositories.LookUpRepo;

namespace CustomerPortal.Services.Services.LookUp
{
    public class LookUp: ILookUp 
    {
        public LookUp(ILookUpRepo _lookUpRepo)
        {
            LookUpRepo = _lookUpRepo;
        }

        public ILookUpRepo LookUpRepo { get; }

        public async Task<List<RoleType>> GetAllRoles(long Id)
        {
            var rolesType = await LookUpRepo.GetAllRoles(Id);
            return rolesType;
        }

        public async Task<List<AllUsersDto>> GetAllUsers(long Id, GetUsersDto _getUsersDto)
        {
          return await LookUpRepo.GetAllUsers(Id, _getUsersDto);
        }

        public async Task<List<ModuleUserRole>> GetModuleUserRoles(int Id)
        {
           return await LookUpRepo.GetModuleUserRoles(Id);
        }
        public async Task<List<UserType>> GetUserTypeList()
        {
            return await LookUpRepo.GetUserTypeList();
        }

        public async Task<List<UserRegion>> GetRegions(long Id)
        {
            return  await LookUpRepo.GetRegions(Id);
        }

        public async Task<DropDownDto> GetDropDownValues(long Id)
        {
            return await LookUpRepo.GetDropDownValues(Id);
        }

        public async Task<AllUsersDto?> GetUser(long Id)
        {
            return await LookUpRepo.GetUser(Id);
        }
    }
}
