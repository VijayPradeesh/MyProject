using CustomerPortal.Services.Core.Responses.Reports;
using Microsoft.AspNetCore.Mvc;

namespace CustomerPortal.Services.Controllers.Helper.Reports
{
    public interface IReportHelper
    {
        FileContentResult GenerateExcel(List<JobReportResponse> data);
    }
}
