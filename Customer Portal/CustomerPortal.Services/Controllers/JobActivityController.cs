using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.JobActivity;
using CustomerPortal.Services.Services.JobActivity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CustomerPortal.Services.Controllers
{
    [Route("customerPortal/[controller]")]
    [ApiController]
    public class JobActivityController : ControllerBase
    {
        public JobActivityController(IJobActivityService jobActivityService)
        {
            JobActivityService = jobActivityService;
        }

        public IJobActivityService JobActivityService { get; }

        [Authorize]
        [HttpPost("PostJobStatus")]
        public async Task<ActionResult> UpdateStatusActivity(StatusChangeDto _statusChangeDto)
        {
            try
            {
                _statusChangeDto.UserId = Convert.ToInt32(HttpContext.User.FindFirst("UserId").Value);
                var response = new PostJobStatusResponse();
                response =  await JobActivityService.EditJobStatus(_statusChangeDto,response);
                if(response.Status == false)
                {
                    return NotFound(response);
                }
                return Ok();
            }catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return StatusCode(500, "Internal Server Error");
            }
            
        }
    }
}
