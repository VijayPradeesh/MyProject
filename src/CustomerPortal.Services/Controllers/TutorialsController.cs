using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Services.Turorials;
using Microsoft.AspNetCore.Authorization;
using CustomerPortal.Services.Services.ErrorLogging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CustomerPortal.Services.Controllers
{
    [Route("CustomerPortal/[controller]")]
    [ApiController]
    public class TutorialsController : ControllerBase
    {
        public TutorialsController(ITutorialsService tutorials, IErrorLogging errorLogging)
        {
            Tutorials = tutorials;
            ErrorLogging = errorLogging;
        }

        public ITutorialsService Tutorials { get; }
        public IErrorLogging ErrorLogging { get; }

        [HttpPost]
        [Route("GetFiles")]
        [Authorize]
        //[AllowAnonymous]
        public async Task<ActionResult> GetFiles(TutorialsDto tutorialsDto)
        {
            try
            {
                tutorialsDto.UserId = Convert.ToInt64(HttpContext.User.FindFirst("UserId").Value);
                tutorialsDto.Company = HttpContext.User.FindFirst("Organization").Value;
                //tutorialsDto.Company = "Spire";
                //tutorialsDto.UserId = 1;
                if (tutorialsDto.Company == null || tutorialsDto.UserId == 0)
                {
                    return BadRequest();
                }
                var data = Tutorials.GetFiles(tutorialsDto);

                return Ok(data);
            }catch(Exception ex) {
                var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                await ErrorLogging.AddErrorLogging("500", controllerName, innerException, ex, ex.Message.ToString());
                return StatusCode(500, ErrorMessages.ServerError);
            }
           
        }
    }
}
