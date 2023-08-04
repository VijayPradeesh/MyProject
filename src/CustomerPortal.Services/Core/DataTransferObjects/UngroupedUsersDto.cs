namespace CustomerPortal.Services.Core.DataTransferObjects
{
    public class UngroupedUsersDto
    {
        public long Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public DateTime? LastLogin { get; set; }
        public bool IsActive { get; set; }
        public bool IsCurrentUser { get; set; }
        public bool? ForgetPassword { get; set; }
        public long TypeId { get; set; }
        public string Type { get; set; }
        public long RoleId { get; set; }
        public string Role { get; set; }
        public long RegionId { get; set; }
        public string Region { get; set; }

        public string Signature { get; set; }
       
    }
}
