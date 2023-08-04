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

    public class AllUsersDto
    {
        public long Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public DateTime? LastLogin { get; set; }
        public bool IsActive { get; set; }
        public bool IsCurrentUser { get; set; }
        public bool ForgetPassword { get; set; }
        public long RoleId { get; set; }
        public long TypeId { get; set; }
        public List<Type> type { get; set; }
        public List<Role> role { get; set; }
        public List<Region> region { get; set; }

        public string Signature { get; set; }
    }

    public class Role
    {
        public long Id { get; set; }
        public string role { get; set; }
    }
    public class Type
    {
        public long Id { get; set; }
        public string type { get; set; }
    }
    public class Region
    {
        public long Id { get; set; }
        public string regionType { get; set; }
    }
}
