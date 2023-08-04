namespace CustomerPortal.Services.Core.Responses.JobActivity
{

    public class BaseActivityResponse
    {
        public int TotalCount { get; set; }
        public int PendingCount { get; set; }
        public int RejectedCount { get; set; }
        public int ApprovedCount { get; set; }
        public int VoidedCount { get; set; }
        public List<string> JobNumbers { get; set; }
        public List<string> ForemanNames { get; set; }
        
        public List<string> WO { get; set; }

        public List<string> PO { get; set; }

        public string? Signature { get; set; }

        public List<string> ContractNumber { get; set; }
        


    }
    public class JobListResponse : BaseActivityResponse
    {
        public List<JobDetails> JobDetails { get; set; }
       
        public DateTime LockdownDate { get; set; }
        
    }

    public class ResurfacingListResponse : BaseActivityResponse
    {
        public List<ResurfacingDetails> ResurfacingDetails { get; set; }
    }

    public class BaseDetails
    {
        public long Id { get; set; }
        public string JobStatus { get; set; }

        public string JobNumber { get; set; }
        public string ForemanName { get; set; }
        public DateTime JobDate { get; set; }
        public string contractNumber { get; set; }
        public int? SortOrder { get; set; }

        public string WO { get; set; }

        public List<string> WOList { get; set; }
        public string PO { get; set; }

        public List<string> POList { get; set; }
        public string? RequesterName { get; set; }


        public bool? IsRequester { get; set; }

    }
    public class JobDetails : BaseDetails
    {
        
    }

    public class ResurfacingDetails : BaseDetails
    {
        public string Address { get; set; }
    }


    public class DropDown
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
