namespace CustomerPortal.Services.Core.Models
{
    public class Master
    {
        public long Id { get; set; }
        public string Company_Code { get; set; }
        public string Job_Number { get; set; }
        public DateTime Job_Date { get; set; }
        public string Contract { get; set; }
        public string Foreman { get; set; }
        public int? ForemanId { get; set; }
        public string Approver { get; set; }
        public string ForemanRole { get; set; }
        public string ApproverRole { get; set; }
        public int? ApproverId { get; set; }
        public DateTime Added_Date { get; set; }
        public DateTime? Changed_Date { get; set; }
        public DateTime? ClModifiedOn { get; set; }
        public bool? Is_Active { get; set; }
    }
}
