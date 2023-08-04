using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.Reports;

namespace CustomerPortal.Services.Services.Reports
{
    public interface IReports
    {
        Task<ReportResponse> GenerateReport(GenerateReportDto _generateReportsDto);
    }
}
