namespace CustomerPortal.Services.Core.Models
{
    public class StatusTrackingBase
    {
        public long Id { get; set; }
        public LookUp lookup { get; set; }
        public long StatusId { get; set; }
        public string? Comment { get; set; }
        public DateTime AddedDate { get; set; }
        public long? ChangedBy { get; set; }
        public DateTime? ChangeDate { get; set; }
        public bool IsActive { get; set; }
        public long? ClUserId { get; set; }

        public string? IPAddress { get; set; }

        public string? Username { get; set; }
        public string? Role { get; set; }

        public User? user { get; set; }
        public long? CPUserId { get; set; }
        public LookUp? ReasonRejection { get; set; }
        public long? ReasonRejectionId { get; set; }

        public byte[]? Signature { get; set; }

        public string? RequesterName { get; set; }
    }
}
