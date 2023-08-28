using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.JobActivity;
using CustomerPortal.Services.Repositories.JobActivityRepo;

namespace CustomerPortal.Services.Services.JobActivity
{
    public class JobActivityService : IJobActivityService
    {
        public JobActivityService(IJobActivityRepo jobActivityRepo)
        {
            JobActivityRepo = jobActivityRepo;
        }

        public IJobActivityRepo JobActivityRepo { get; }

        public async Task<PostJobStatusResponse> EditJobStatus(StatusChangeDto _statusChangeDto, PostJobStatusResponse response)
        {
            return await JobActivityRepo.EditJobStatus(_statusChangeDto, response);
        }
    }
}
