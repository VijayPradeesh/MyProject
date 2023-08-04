namespace CustomerPortal.Services.Core.Responses.Configurations
{
    public class RolesResponse
    {
        public long Id { get; set; }
        public string Role { get; set; }
        public bool Assigned { get; set; }

        public bool IsScreensAssigned { get; set; }
    }
}
