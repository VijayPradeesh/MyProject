using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.JobActivity;
using CustomerPortal.Services.Repositories.JobActivityRepo;

namespace CustomerPortal.Services.Services.JobActivity
{
    public class JobActivityService : IJobActivityService
    {
        public JobActivityService(IJobActivityRepo jobActivityRepo, IResurfacingRepo resurfacingRepo)
        {
            JobActivityRepo = jobActivityRepo;
            ResurfacingRepo = resurfacingRepo;
        }

        public IJobActivityRepo JobActivityRepo { get; }
        public IResurfacingRepo ResurfacingRepo { get; }

        public async Task<PostJobStatusResponse> EditJobStatus(StatusChangeDto _statusChangeDto, PostJobStatusResponse response)
        {
            if (!_statusChangeDto.IsResurfacing)
            {
                return await JobActivityRepo.EditJobStatus(_statusChangeDto, response);
            }
            else
            {
                return await ResurfacingRepo.EditJobStatus(_statusChangeDto, response);
            }
            
        }

        public async Task<JobListResponse> GetAllJobs(GetAllJobsDto _getDto)
        {
            return await JobActivityRepo.GetAllJobs(_getDto);
        }

        public async Task<ResurfacingListResponse> GetAllJobsResurfacing(GetAllJobsDto _getDto)
        {
            return await ResurfacingRepo.GetAllResurfacingJobs(_getDto);
        }
        public async Task<List<JobStatusResponse>> GetJobStatus(long Id)
        {
            return await JobActivityRepo.GetJobStatus(Id);
        }

        public async Task<List<JobStatusResponse>> GetResurfacingStatus(long Id)
        {
            return await ResurfacingRepo.GetJobStatus(Id);
        }

        public async Task<JobDetailsResponse> GetJobDetails(long Id)
        {
            return await JobActivityRepo.GetJobDetails(Id);
        }

        public async Task<Resurfacing> GetResurfacingDetails(long Id)
        {
            return await ResurfacingRepo.GetResurfacingDetails(Id);
        }

        public async Task<List<RejectionReasonDto>> GetRejectionStatus()
        {
           return await JobActivityRepo.GetRejectionStatus();
        }

        public async Task<ViewApprovalResponse> GetViewApproval(long Id)
        {
            return await JobActivityRepo.GetViewApproval(Id);
        }

        public async Task<ViewApprovalResponse> GetViewApprovalResurfacing(long Id)
        {
            return await ResurfacingRepo.GetViewApproval(Id);
        }

        public async Task<List<ResurfacingImages>> GetResurfacingImages(long Id)
        {
            return await ResurfacingRepo.GetResurfacingImages(Id);
        }
    }
}
