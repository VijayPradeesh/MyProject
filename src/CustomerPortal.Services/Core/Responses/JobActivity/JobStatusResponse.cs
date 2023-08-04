namespace CustomerPortal.Services.Core.Responses.JobActivity
{
    public class JobStatusResponse
    {
        public long Id { get; set; }
        public string Status { get; set; }
        public DateTime? StatusChangedDate { get; set; }
        public string? Comments { get; set; }
        public string? ClApproverName { get; set; }
        public string? CPUserName { get; set; }
        public bool IsCpUser { get; set; }
    }
}
