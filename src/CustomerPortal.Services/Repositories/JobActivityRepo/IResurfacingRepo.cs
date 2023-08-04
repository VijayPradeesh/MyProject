using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.JobActivity;

namespace CustomerPortal.Services.Repositories.JobActivityRepo
{
    public interface IResurfacingRepo
    {
        Task<ResurfacingListResponse> GetAllResurfacingJobs(GetAllJobsDto _getDto);

        Task<Resurfacing> GetResurfacingDetails(long Id);

        Task<PostJobStatusResponse> EditJobStatus(StatusChangeDto _statusChangeDto, PostJobStatusResponse response);

        Task<List<JobStatusResponse>> GetJobStatus(long Id);

        Task<ViewApprovalResponse> GetViewApproval(long Id);

        Task<List<ResurfacingImages>> GetResurfacingImages(long Id);
    }
}
