using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.JobActivity;

namespace CustomerPortal.Services.Services.JobActivity
{
    public interface IJobActivityService
    {
        Task<PostJobStatusResponse> EditJobStatus(StatusChangeDto _statusChangeDto, PostJobStatusResponse response);
    }
}
