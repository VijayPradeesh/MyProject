namespace CustomerPortal.Services.Core.Responses.LookUp
{
    public class ModuleUserRole
    {
        public int Id { get; set; }
        public string UserRole { get; set; }

    }

    public class UserType
    {
        public long Id { get; set; }
        public string userType { get; set; }
    }

    public class UserRegion
    {
        public long Id { get; set; }
        public string RegionType { get; set; }
    }
}
