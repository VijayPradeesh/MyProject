using ClosedXML.Excel;
using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.Reports;
using CustomerPortal.Services.Repositories.ReportsRepo;

namespace CustomerPortal.Services.Services.Reports
{
    public class Reports : IReports
    {
        public Reports(IReportsRepo reportsRepo)
        {
            IReportsRepo = reportsRepo;
        }
        public IReportsRepo IReportsRepo { get; set; }
        public async Task<ReportResponse> GenerateReport(GenerateReportDto _generateReportsDto)
        {
            var data = new ReportResponse();
            if(!_generateReportsDto.IsResurfacing)
            {
                data = await IReportsRepo.GenerateReport(_generateReportsDto);
            }else
            {
                data = await IReportsRepo.GenerateReportResurfacing(_generateReportsDto);
            }
            
            //var fl = new ReportResponse();
            if (_generateReportsDto.download)
            {
                if(!_generateReportsDto.IsResurfacing)
                {
                    
                    data.file = await GenerateExcel(data.ReportData, _generateReportsDto.FromDate.ToString("MM/dd/yyyy") + " to " + _generateReportsDto.ToDate.ToString("MM/dd/yyyy"));
                }
                else
                {
                    
                    data.file = await GenerateExcel(data.ResurfacingReportData, _generateReportsDto.FromDate.ToString("MM/dd/yyyy") + " to " + _generateReportsDto.ToDate.ToString("MM/dd/yyyy"));
                }
                
            }
            return data;
            // return await GenerateExcel(data, _generateReportsDto.FromDate.ToShortDateString() + " - " + _generateReportsDto.ToDate.ToShortDateString());
        }
        public async Task<byte[]> GenerateExcel(List<JobReportResponse> data, string FromToDate)
        {
            using (var workbook = new XLWorkbook())
            {
                var range = "A1:N1";
                var worksheet = workbook.Worksheets.Add("Customer Portal");
                worksheet.Range(range).Merge().Value = "Customer Portal Report \r\n " + FromToDate;

                worksheet.Range(range).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);

                var row1 = worksheet.Row(1);
                worksheet.Range(range).Style.Font.Bold = true;

                worksheet.Range(range).Style.Fill.BackgroundColor = XLColor.OrangePeel;
                // worksheet.Range(range).Style.Border.OutsideBorder = XLBorderStyleValues.Medium;
                row1.Height = 30;
                var currentRow = 2;
                int y = 0;
                #region Header
                worksheet.Cell(currentRow, ++y).Value = "Job Number";
                worksheet.Cell(currentRow, ++y).Value = "Date";
                worksheet.Cell(currentRow, ++y).Value = "Foreman Name";
                worksheet.Cell(currentRow, ++y).Value = "WorkOrder";
                worksheet.Cell(currentRow, ++y).Value = "PurchaseOrder";
                worksheet.Cell(currentRow, ++y).Value = "Address";
                worksheet.Cell(currentRow, ++y).Value = "PayItem";
                worksheet.Cell(currentRow, ++y).Value = "Description";
                worksheet.Cell(currentRow, ++y).Value = "QTY";
                worksheet.Cell(currentRow, ++y).Value = "UOM";
                worksheet.Cell(currentRow, ++y).Value = "Foreman Comments";
                worksheet.Cell(currentRow, ++y).Value = "Contract Number";
                worksheet.Cell(currentRow, ++y).Value = "WBS Description";
                worksheet.Cell(currentRow, ++y).Value = "Status";
                
                worksheet.Range("A2:N2").Style.Font.Bold = true;
                #endregion
                int i = 0;
                #region Body
                foreach (var result in data)
                {
                    currentRow++;
                    i = 0;
                    worksheet.Cell(currentRow, ++i).Value = result.JobNumber;
                    worksheet.Cell(currentRow, ++i).Value = result.JobDate;
                    worksheet.Cell(currentRow, ++i).Value = result.ForemanName;
                    worksheet.Cell(currentRow, ++i).Value = result.WorkOrder;
                    worksheet.Cell(currentRow, ++i).Value = result.PurchaseOrder;
                    worksheet.Cell(currentRow, ++i).Value = result.Address;
                    worksheet.Cell(currentRow, ++i).Value = result.PayItemName;
                    worksheet.Cell(currentRow, ++i).Value = result.PayItemDecsription;
                    worksheet.Cell(currentRow, ++i).Value = result.Quantity;
                    worksheet.Cell(currentRow, ++i).Value = result.UOM;
                    worksheet.Cell(currentRow, ++i).Value = result.ForemanComments;
                    worksheet.Cell(currentRow, ++i).Value = result.ContractNumber;
                    worksheet.Cell(currentRow, ++i).Value = result.WBSDescription;
                    worksheet.Cell(currentRow, ++i).Value = result.Status;
                }
                worksheet.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                // worksheet.Cells().Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                worksheet.Columns().AdjustToContents();
                #endregion
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return content;
                    //return File(content, "application/vnd.ms-excel", "SpireReport" + DateTime.Now.Ticks.ToString());
                }
            }

        }

        public async Task<byte[]> GenerateExcel(List<ResurfacingReportResponse> data, string FromToDate)
        {
            using (var workbook = new XLWorkbook())
            {
                var range = "A1:Q1";
                var worksheet = workbook.Worksheets.Add("Customer Portal");
                worksheet.Range(range).Merge().Value = "Customer Portal Report \r\n " + FromToDate;

                worksheet.Range(range).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);

                var row1 = worksheet.Row(1);
                worksheet.Range(range).Style.Font.Bold = true;

                worksheet.Range(range).Style.Fill.BackgroundColor = XLColor.OrangePeel;
                // worksheet.Range(range).Style.Border.OutsideBorder = XLBorderStyleValues.Medium;
                row1.Height = 30;
                var currentRow = 2;
                int y = 0;
                #region Header
                worksheet.Cell(currentRow, ++y).Value = "Job Number";
                worksheet.Cell(currentRow, ++y).Value = "Date";
                worksheet.Cell(currentRow, ++y).Value = "Foreman Name";
                worksheet.Cell(currentRow, ++y).Value = "Contract Number";
                worksheet.Cell(currentRow, ++y).Value = "WorkOrder";
                worksheet.Cell(currentRow, ++y).Value = "PurchaseOrder";
                worksheet.Cell(currentRow, ++y).Value = "Address";
                worksheet.Cell(currentRow, ++y).Value = "Surface Type";
                worksheet.Cell(currentRow, ++y).Value = "Material Type";
                worksheet.Cell(currentRow, ++y).Value = "Length";
                worksheet.Cell(currentRow, ++y).Value = "Width";
                worksheet.Cell(currentRow, ++y).Value = "Diameter";
                worksheet.Cell(currentRow, ++y).Value = "Depth";
                worksheet.Cell(currentRow, ++y).Value = "Type";
                worksheet.Cell(currentRow, ++y).Value = "Total";
                worksheet.Cell(currentRow, ++y).Value = "UOM";
                worksheet.Cell(currentRow, ++y).Value = "Status";
                worksheet.Range("A2:Q2").Style.Font.Bold = true;
                #endregion
                int i = 0;
                #region Body
                foreach (var result in data)
                {
                    currentRow++;
                    i = 0;
                    worksheet.Cell(currentRow, ++i).Value = result.JobNumber;
                    worksheet.Cell(currentRow, ++i).Value = result.JobDate;
                    worksheet.Cell(currentRow, ++i).Value = result.ForemanName;
                    worksheet.Cell(currentRow, ++i).Value = result.ContractNumber;
                    worksheet.Cell(currentRow, ++i).Value = result.WorkOrder;
                    worksheet.Cell(currentRow, ++i).Value = result.PurchaseOrder;
                    worksheet.Cell(currentRow, ++i).Value = result.Address;
                    worksheet.Cell(currentRow, ++i).Value = result.SurfaceType;
                    worksheet.Cell(currentRow, ++i).Value = result.MaterialType;
                    worksheet.Cell(currentRow, ++i).Value = result.Length;
                    worksheet.Cell(currentRow, ++i).Value = result.Width;
                    worksheet.Cell(currentRow, ++i).Value = result.Diameter;
                    worksheet.Cell(currentRow, ++i).Value = result.Depth;
                    worksheet.Cell(currentRow, ++i).Value = result.Type;
                    worksheet.Cell(currentRow, ++i).Value = result.Total;
                    worksheet.Cell(currentRow, ++i).Value = result.UOM;
                    worksheet.Cell(currentRow, ++i).Value = result.Status;
                }
                worksheet.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                // worksheet.Cells().Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                worksheet.Columns().AdjustToContents();
                #endregion
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return content;
                    //return File(content, "application/vnd.ms-excel", "SpireReport" + DateTime.Now.Ticks.ToString());
                }
            }

        }
    }
}

