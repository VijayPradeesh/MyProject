namespace CustomerPortal.Services.Core.Responses.Configurations
{
    public class Regions
    {
        public long Id { get; set; }
        public string Region { get; set; }

        public bool Assigned { get; set; }
    }

    public class RegionResponse
    {
        public List<Regions> Regions { get; set; }
    }
}
