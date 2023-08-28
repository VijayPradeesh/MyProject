namespace CustomerPortal.Services.Core.Responses.LookUp
{
    public class UsersDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public bool IsActive { get; set; }
        public bool IsCurrentUser { get; set; }

        public int RoleId { get; set; }
        public string Role { get; set; }
    }
}
