namespace CustomerPortal.Services.Core.Responses.JobActivity
{
    public class ViewApprovalResponse: BaseResponse
    {
        public string? Signature { get; set; }
        public string? Comments { get; set; }
        public string? Requester { get; set; }
    }
}
