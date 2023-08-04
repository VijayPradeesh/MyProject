namespace CustomerPortal.Services.Core.Responses.JobActivity
{
    public class PostJobStatusResponse
    {
        public bool Status { get; set; }
        public string Message { get; set; }

        public string? Base64 { get; set; }
    }
}
