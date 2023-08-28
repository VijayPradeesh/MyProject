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

        public async Task<List<RoleType>> GetAllRoles()
        {
            var rolesType = await LookUpRepo.GetAllRoles();
            return rolesType;
        }

        public async Task<List<UsersDto>> GetAllUsers(int Id)
        {
           var response =  await LookUpRepo.GetAllUsers(Id);
            return response;
        }

        public async Task<List<ModuleUserRole>> GetModuleUserRoles(int Id)
        {
           return await LookUpRepo.GetModuleUserRoles(Id);
        }
    }
}
