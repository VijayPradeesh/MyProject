namespace CustomerPortal.Services.Core.Responses.Reports
{
    public class ReportResponse
    {
        public byte[] file { get; set; }
        public MemoryStream stream { get; set; }
        public List<string> ForemanList { get; set; }
        public List<string> WOList { get; set; }
        public List<string> StatusList { get; set; }
        public List<string> ContractList { get; set; }

        public List<JobReportResponse> ReportData { get; set; }
        public List<ResurfacingReportResponse> ResurfacingReportData { get; set; }
    }

    public class BaseReportResponse
    {
        public long JobId { get; set; }
        public string JobNumber { get; set; }
        public string ForemanName { get; set; }
        public string Status { get; set; }
        public string ContractNumber { get; set; }
        public DateTime JobDate { get; set; }

       

        public string WorkOrder { get; set; }

        public string Address { get; set; }

        public string PurchaseOrder { get; set; }
    }
    public class JobReportResponse : BaseReportResponse
    {
        public string WBSDescription { get; set; }
        public string PayItemName { get; set; }
        public string PayItemDecsription { get; set; }
        public decimal? Quantity { get; set; }
        public string ForemanComments { get; set; }
        public string UOM { get; set; }

    }

    public class ResurfacingReportResponse : BaseReportResponse 
    {
        public string SurfaceType { get; set; }
        public string MaterialType { get; set; }
        public decimal? Length { get; set; }
        public decimal? Width { get; set; }
        public decimal? Depth { get; set; }
        public decimal? Diameter { get; set; }
        public decimal? Total { get; set; }
        public string? Type { get; set; }
        public decimal? Quantity { get; set; }
        public string UOM { get; set; }
    }
}
