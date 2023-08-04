using ClosedXML.Excel;
using CustomerPortal.Services.Core.Responses.Reports;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace CustomerPortal.Services.Controllers.Helper.Reports
{
    public class ReportHelper : ControllerBase, IReportHelper
    {
        [EnableCors("AllowAll")]
        [NonAction]
        public FileContentResult GenerateExcel(List<JobReportResponse> data)
        {
            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("SpireReport");
                worksheet.Range("A1:J1").Merge().Value = "Spire Report \r\n " + DateTime.Now.ToShortDateString().ToString();

                worksheet.Range("A1:J1").Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);

                var row1 = worksheet.Row(1);
                
                worksheet.Range("A1:J1").Style.Fill.BackgroundColor = XLColor.LightGreen;
                worksheet.Range("A1:J1").Style.Border.OutsideBorder = XLBorderStyleValues.Medium;
                row1.Height = 30;
                var currentRow = 2;
                #region Header
                worksheet.Cell(currentRow, 1).Value = "Job Number";
                worksheet.Cell(currentRow, 2).Value = "Date";
                worksheet.Cell(currentRow, 3).Value = "Foreman Name";
                worksheet.Cell(currentRow, 4).Value = "WorkOrder";
                worksheet.Cell(currentRow, 5).Value = "PurchaseOrder";
                worksheet.Cell(currentRow, 6).Value = "Address";
                worksheet.Cell(currentRow, 7).Value = "PayItem";
                worksheet.Cell(currentRow, 8).Value = "Description";
                worksheet.Cell(currentRow, 9).Value = "QTY";
                worksheet.Cell(currentRow, 10).Value = "UOM";
                worksheet.Range("A1:J2").Style.Font.Bold = true;
                #endregion

                #region Body
                foreach (var result in data)
                {
                    currentRow++;
                    worksheet.Cell(currentRow, 1).Value = result.JobNumber;
                    worksheet.Cell(currentRow, 2).Value = result.JobDate;
                    worksheet.Cell(currentRow, 3).Value = result.ForemanName;
                    worksheet.Cell(currentRow, 4).Value = result.WorkOrder;
                    worksheet.Cell(currentRow, 5).Value = result.PurchaseOrder;
                    worksheet.Cell(currentRow, 6).Value = result.Address;
                    worksheet.Cell(currentRow, 7).Value = result.PayItemName;
                    worksheet.Cell(currentRow, 8).Value = result.PayItemDecsription;
                    worksheet.Cell(currentRow, 9).Value = result.Quantity;
                    worksheet.Cell(currentRow, 10).Value = result.UOM;
                }
                worksheet.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cells().Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                worksheet.Columns().AdjustToContents();
                #endregion
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return  File(content, "application/vnd.ms-excel", "SpireReport" + DateTime.Now.Ticks.ToString());
                }
            }
        }
    }
}
