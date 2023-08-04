using ClosedXML.Excel;
using CustomerPortal.Services.Controllers.Helper.Reports;
using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Services.Reports;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using CustomerPortal.Services.Services.ErrorLogging;

namespace CustomerPortal.Services.Controllers
{
    [Route("CustomerPortal/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        public IReports Reports { get; set; }
        public IErrorLogging ErrorLogging { get; }

        public ReportsController(IReports reports, IErrorLogging errorLogging)
        {
            Reports = reports;
            ErrorLogging = errorLogging;
        }
        [HttpPost]
        [Authorize]
        [Route("GenerateReport")]
        public async Task<ActionResult> GenerateReport(GenerateReportDto _generateReportsDto)
        {
            try
            {
                _generateReportsDto.UserId = Convert.ToInt64(HttpContext.User.FindFirst("UserId").Value);
                var data = await Reports.GenerateReport(_generateReportsDto);
                if (!_generateReportsDto.download)
                {
                    return Ok(data);
                }
                //return


                return Ok(data);
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
