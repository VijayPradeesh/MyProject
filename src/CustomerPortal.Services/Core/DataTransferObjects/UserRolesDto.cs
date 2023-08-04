namespace CustomerPortal.Services.Core.DataTransferObjects
{
    public class UserRolesDto
    {
        
        public string Type { get; set; }
        public long TypeId { get; set; }
        public string Role { get; set; }

        public long RoleId { get; set; }
        public string Region { get; set; }
    }
}
