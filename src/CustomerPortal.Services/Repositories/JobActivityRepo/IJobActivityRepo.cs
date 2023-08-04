using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.JobActivity;

namespace CustomerPortal.Services.Repositories.JobActivityRepo
{
    public interface IJobActivityRepo
    {
        Task<PostJobStatusResponse> EditJobStatus(StatusChangeDto _statusChangeDto, PostJobStatusResponse response);

        Task<JobListResponse> GetAllJobs(GetAllJobsDto _getDto);

        Task<List<JobStatusResponse>> GetJobStatus(long Id);
        Task<JobDetailsResponse> GetJobDetails(long Id);

        Task<List<RejectionReasonDto>> GetRejectionStatus();
        Task<ViewApprovalResponse> GetViewApproval(long Id);
    }
}
