namespace CustomerPortal.Services.Core.DataTransferObjects
{
    public class GetAllJobsDto
    {
        public long UserId { get; set; }
        public string? ForemanName { get; set; }
        public string JobNumber { get; set; }
        public string Status { get; set; }
        public bool CurrentWeek { get; set; }

        public string WO { get; set; }
        public string PO { get; set; }

        public bool IsResurfacing { get; set; }

        public string contractNumber { get; set; }
    }
}
