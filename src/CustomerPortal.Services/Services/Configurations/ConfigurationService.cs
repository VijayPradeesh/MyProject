using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.Configurations;
using CustomerPortal.Services.Repositories.Configurations;

namespace CustomerPortal.Services.Services.Configurations
{
    public class ConfigurationService : IConfigurationService
    {
        public ConfigurationService(IConfigurationsRepo configurationsRepo)
        {
            ConfigurationsRepo = configurationsRepo;
        }

        public IConfigurationsRepo ConfigurationsRepo { get; }

        public async Task<List<Organisations>> GetOrganisations(bool flag)
        {
             return await ConfigurationsRepo.GetOrganisations( flag);
        }

        public async Task<List<Contracts>> GetContracts(long Id)
        {
            return await ConfigurationsRepo.GetContracts(Id);
        }

        public async Task<RegionResponse> GetAllRegions(string Contract)
        {
            return await ConfigurationsRepo.GetAllRegions(Contract);
        }

        public async Task<AddNewResponse> AddNewInLookUp(AddNewInLookUp addNewInLookUp)
        {
            return await ConfigurationsRepo.AddNewInLookUp(addNewInLookUp);
        }

        public async Task<List<ScreensResponse>> GetAllScreens(ScreensDto screensDto)
        {
           return await ConfigurationsRepo.GetAllScreens(screensDto);
        }

        public async Task<List<RolesResponse>> GetRoles(long OrganisationId)
        {
            return await ConfigurationsRepo.GetRoles(OrganisationId);
        }

        public async Task<PostContractResponse> PostContract(PostContractDto postContractDto)
        {
           return  await ConfigurationsRepo.PostContract(postContractDto);
        }

        public async Task<PostRegionResponse> PostRegion(PostRegion postRegion)
        {
            return await ConfigurationsRepo.PostRegion(postRegion);
        }

        public async Task<PostRoleResponse> PostRole(PostRoleDto postRoleDto)
        {
            return await ConfigurationsRepo.PostRole(postRoleDto);
        }

        public async Task<PostScreenResponse> PostScreen(PostScreensDto postScreensDto)
        {
            return await ConfigurationsRepo.PostScreens(postScreensDto);
        }
    }
}
