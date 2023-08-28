using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.JobActivity;

namespace CustomerPortal.Services.Repositories.JobActivityRepo
{
    public interface IJobActivityRepo
    {
        Task<PostJobStatusResponse> EditJobStatus(StatusChangeDto _statusChangeDto, PostJobStatusResponse response);
    }
}
