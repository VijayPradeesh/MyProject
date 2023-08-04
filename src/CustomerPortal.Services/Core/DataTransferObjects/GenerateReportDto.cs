using System.ComponentModel.DataAnnotations;

namespace CustomerPortal.Services.Core.DataTransferObjects
{
    public class GenerateReportDto
    {
        public long UserId { get; set; }
        [Required]
        public DateTime FromDate { get; set; }
        [Required]
        public DateTime ToDate { get; set; }
        public List<string> WorkOrder { get; set; }
        public List<string> Foreman { get; set; } 
        public string? ContractNumber { get; set; } = "all contract";
        public string? DfrStatus { get; set; } = "all status";
        public bool download { get;set; }

        public long? CompanyId { get; set; }

        public bool IsResurfacing { get; set; }
    }
}
