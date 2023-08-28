namespace CustomerPortal.Services.Core.Responses.LookUp
{
    public class RoleType
    {
        public int TypeId { get; set; }
        public string UserType { get; set; }

        public List<Roles> roles { get; set; }

    }
    public class Roles
    {
        public int RoleId { get; set; }
        public string RoleName { get; set; }
    }
}
