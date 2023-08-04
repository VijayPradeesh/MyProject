using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.Reports;

namespace CustomerPortal.Services.Repositories.ReportsRepo
{
    public interface IReportsRepo
    {
        Task<ReportResponse> GenerateReport(GenerateReportDto _generateReportsDto);

        Task<ReportResponse> GenerateReportResurfacing(GenerateReportDto _generateReportsDto);
    }
}
