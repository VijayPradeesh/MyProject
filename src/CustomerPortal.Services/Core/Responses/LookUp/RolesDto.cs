namespace CustomerPortal.Services.Core.Responses.LookUp
{
    public class RoleType
    {
        public long TypeId { get; set; }
        public string UserType { get; set; }

        public List<Roles> roles { get; set; }

    }
    public class Roles
    {
        public long RoleId { get; set; }
        public string RoleName { get; set; }

        public bool IsScreenAssigned { get; set; }
    }
}
