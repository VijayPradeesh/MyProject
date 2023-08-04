namespace CustomerPortal.Services.Core.DataTransferObjects
{
    public class GetUsersDto
    {
        public string? searchKey { get; set; }
        public long? RoleId { get; set; }
        public long? RegionId { get; set; }
        public long? TypeId { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
