namespace CustomerPortal.Services.Core.DataTransferObjects
{
    public class UserRoleDto
    {
        public string Username { get; set; }
        public string Role { get; set; }

        public string Type { get; set; }
        public long RegionId { get; set; }
        public long TypeId { get; set; }
    }
}
