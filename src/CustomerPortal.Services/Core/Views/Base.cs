namespace CustomerPortal.Services.Core.Views
{
    public class Base
    {
        public long JobId { get; set; }
        public DateTime JobDate { get; set; }
        public string? JobNumber { get; set; }
        public string? WO { get; set; }
        
        public string? Address { get; set; }
       
        public string ContractNumber { get; set; }
        public string? Status { get; set; }

        public string? ForemanName { get; set; }
    }
}
