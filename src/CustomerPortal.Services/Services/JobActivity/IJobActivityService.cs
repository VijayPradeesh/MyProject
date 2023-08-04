using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.JobActivity;

namespace CustomerPortal.Services.Services.JobActivity
{
    public interface IJobActivityService
    {
        Task<PostJobStatusResponse> EditJobStatus(StatusChangeDto _statusChangeDto, PostJobStatusResponse response);

        Task<JobListResponse> GetAllJobs(GetAllJobsDto _getDto);
        Task<List<JobStatusResponse>> GetJobStatus(long Id);
        Task<JobDetailsResponse> GetJobDetails(long Id);

        Task<List<RejectionReasonDto>> GetRejectionStatus();

        

        Task<ViewApprovalResponse> GetViewApproval(long Id);


      


        //Resurfacing
        Task<ResurfacingListResponse> GetAllJobsResurfacing(GetAllJobsDto _getDto);

        Task<ViewApprovalResponse> GetViewApprovalResurfacing(long Id);

        Task<Resurfacing> GetResurfacingDetails(long Id);

        Task<List<JobStatusResponse>> GetResurfacingStatus(long Id);

        Task<List<ResurfacingImages>> GetResurfacingImages(long Id);
    }
}
