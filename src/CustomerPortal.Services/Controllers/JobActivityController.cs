using CustomerPortal.Services.Controllers.Helper;
using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.JobActivity;
using CustomerPortal.Services.Services.ErrorLogging;
using CustomerPortal.Services.Services.JobActivity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace CustomerPortal.Services.Controllers
{
    [Route("customerPortal/[controller]")]
    [ApiController]
    public class JobActivityController : ControllerBase
    {
        public JobActivityController(IJobActivityService jobActivityService, IErrorLogging errorLogging, ICentralHelper centralhelper)
        {
            JobActivityService = jobActivityService;
            ErrorLogging = errorLogging;
            Centralhelper = centralhelper;
        }

        public IJobActivityService JobActivityService { get; }
        public IErrorLogging ErrorLogging { get; }
        public ICentralHelper Centralhelper { get; }

        [Authorize]
        [HttpPost("PostJobStatus")]
        public async Task<ActionResult> UpdateStatusActivity(StatusChangeDto _statusChangeDto)
        {
            try
            {
                IPAddress[]? arr;
                string ip = Request.HttpContext.Connection.RemoteIpAddress.ToString();
                if (ip == "::1")
                {
                    arr = Dns.GetHostEntry(Dns.GetHostName()).AddressList;
                    var ar = arr.Select(x => x.ToString()).ToList();
                    if(arr.Count() == 0)
                    {
                        _statusChangeDto.IPAddress = "";
                    }else
                    {
                        _statusChangeDto.IPAddress = ar[ar.Count - 1];
                    }
                    
                }else
                {
                    _statusChangeDto.IPAddress = ip;
                }
                _statusChangeDto.UserId = Convert.ToInt64(HttpContext.User.FindFirst("UserId").Value);
                var response = new PostJobStatusResponse();
                response =  await JobActivityService.EditJobStatus(_statusChangeDto,response);
                if(response.Status == false)
                {
                    return NotFound(response);
                }
                return Ok(response);
            }catch(Exception ex)
            {
                var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                await ErrorLogging.AddErrorLogging("500", controllerName, innerException, ex, ex.Message.ToString());
                return StatusCode(500, "Internal Server error");
            }
            
        }

        [Authorize]
        [HttpGet]
        [Route("GetViewApproval")]
        public async Task<ActionResult> GetViewApproval(long Id, bool flag)
        {
            try
            {
                var response =new ViewApprovalResponse();
                if(!flag)
                {
                    response = await JobActivityService.GetViewApproval(Id);
                }else
                {
                    response = await JobActivityService.GetViewApprovalResurfacing(Id);
                }
                
                if(response.status == true)
                {
                    return Ok(response);
                }
                return StatusCode(500, response);
                
            }catch(Exception ex)
            {
                var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                await ErrorLogging.AddErrorLogging("500", controllerName, innerException, ex, ex.Message.ToString());
                return StatusCode(500, "Internal Server error");
            }
            
        }

        [Authorize]
        [HttpPost("GetAllJobs")]
        public async Task<ActionResult> GetAllJobs(GetAllJobsDto _getDto)
        {
            // var Id = Convert.ToInt64(HttpContext.User.FindFirst("UserId").Value);
            try
            {
                _getDto.UserId = Convert.ToInt64(HttpContext.User.FindFirst("UserId").Value);
                var response1 = new JobListResponse();
                var response2 = new ResurfacingListResponse();
                if (!_getDto.IsResurfacing)
                {
                    response1 = await JobActivityService.GetAllJobs(_getDto);
                    return Ok(response1);
                }
                else
                {
                    response2 = await JobActivityService.GetAllJobsResurfacing(_getDto);
                    return Ok(response2);
                }
                
              
            }catch(Exception ex)
            {
                var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                await ErrorLogging.AddErrorLogging("500", controllerName, innerException, ex, ex.Message.ToString());
                return StatusCode(500, ErrorMessages.ServerError);
            }
            
        }

        [Authorize]
        [HttpGet("GetJobStatus/{Id}/{flag}")]
        public async Task<ActionResult> GetJobStatus(long Id, bool flag)
        {
            try
            {
                if(!flag)
                {
                    var res = await JobActivityService.GetJobStatus(Id);
                    return Ok(res);
                }else
                {
                    var res = await JobActivityService.GetResurfacingStatus(Id);
                    return Ok(res);
                }
                
            }
            catch(Exception ex)
            {
                var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                await ErrorLogging.AddErrorLogging("500", controllerName, innerException, ex, ex.Message.ToString());
                return StatusCode(500, ErrorMessages.ServerError);
            }
            
        }

        [Authorize]
        [HttpGet("GetJobDetails/{Id}/{flag}")]
        public async Task<ActionResult> GetJobDetails(long Id, bool flag)
        {
            try
            {
                if(!flag)
                {
                    var res = await JobActivityService.GetJobDetails(Id);
                    return Ok(res);
                }
                else
                {
                    var res = await JobActivityService.GetResurfacingDetails(Id);
                    return Ok(res);
                }
                
            }
            catch(Exception ex)
            {
                var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                await ErrorLogging.AddErrorLogging("500", controllerName, innerException, ex, ex.Message.ToString());
                return StatusCode(500, ErrorMessages.ServerError);
            }
            
        }

        [Authorize]
        //[AllowAnonymous]
        [HttpGet("GetResurfacingImages")]
        public async Task<ActionResult> GetImages(long Id)
        {
            try
            {
                var response = await JobActivityService.GetResurfacingImages(Id);
                return Ok(response);
            }catch(Exception ex)
            {
                var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                await ErrorLogging.AddErrorLogging("500", controllerName, innerException, ex, ex.Message.ToString());
                return StatusCode(500, ErrorMessages.ServerError);
            }
            
        }

        [Authorize]
        [HttpGet("GetRejectionStatus")]
        public async Task<ActionResult> GetRejectionStatus()
        {
            try
            {
                var response = await JobActivityService.GetRejectionStatus();
                return Ok(response);
            }
            catch(Exception ex)
            {
                var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                await ErrorLogging.AddErrorLogging("500", controllerName, innerException, ex, ex.Message.ToString());
                return StatusCode(500, ErrorMessages.ServerError);
            }
           
        }
    }
}
