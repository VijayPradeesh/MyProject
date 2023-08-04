using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.Configurations;

namespace CustomerPortal.Services.Repositories.Configurations
{
    public interface IConfigurationsRepo
    {
        Task<List<Organisations>> GetOrganisations(bool flag);

        Task<List<Contracts>> GetContracts(long Id);

        Task<RegionResponse> GetAllRegions(string Contract);

        Task<AddNewResponse> AddNewInLookUp(AddNewInLookUp addNewInLookUp);

        Task<List<ScreensResponse>> GetAllScreens(ScreensDto _screensDto);

        Task<List<RolesResponse>> GetRoles(long OrganisationId);

        Task<PostContractResponse> PostContract(PostContractDto postContractDto);

        Task<PostRegionResponse> PostRegion(PostRegion postRegion);

        Task<PostRoleResponse> PostRole(PostRoleDto postRoleDto);

        Task<PostScreenResponse> PostScreens(PostScreensDto postScreensDto);
    }
}
