using CustomerPortal.Services.Core.ApplicationDbContext;
using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.JobActivity;
using Microsoft.EntityFrameworkCore;

namespace CustomerPortal.Services.Repositories.JobActivityRepo
{
    public class JobActivityRepo : IJobActivityRepo
    {
        public JobActivityRepo(CustomerPortalDbContext dbContext)
        {
            DbContext = dbContext;
        }

        public CustomerPortalDbContext DbContext { get; }

        public async Task<PostJobStatusResponse> EditJobStatus(StatusChangeDto _statusChangeDto, PostJobStatusResponse response)
        {
            response.Status = true;
            response.Message = "";
            var job = await DbContext.Job.Where(x => x.Job_Id == _statusChangeDto.JobId).FirstOrDefaultAsync();
            if(job == null)
            {
                response.Status = false;
                response.Message = "Job Not Found";
                return response;
            }
            job.Status_Id = _statusChangeDto.StatusId;
            job.Changed_By = _statusChangeDto.UserId;
            job.Changed_Date = DateTime.Now;
            DbContext.Update(job);
            DbContext.SaveChanges();
            response.Message = "Job Status changed successfully";
            return response;
        }
    }
}
