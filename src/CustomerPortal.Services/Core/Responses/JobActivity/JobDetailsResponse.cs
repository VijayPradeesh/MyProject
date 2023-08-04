namespace CustomerPortal.Services.Core.Responses.JobActivity
{
    public class JobDetailsResponse
    {
        public Production Production { get; set; }
        public Labor Labor { get; set; }
        public TandM TandM { get; set; }
        public Equipment Equipment { get; set; }
        public Comments Comments { get; set; }

        public SewerCamera? SewerCam { get; set; }
        public bool IsSewerCam { get; set; }
    }
    public class Production
    {
        public List<Header> Headers { get; set; }
        public List<Body> Body { get; set; }
    }
    public class Labor
    {
        public List<Header> Headers { get; set; }
        public List<Body> Body { get; set; }
    }
    public class TandM
    {
        public List<Header> Headers { get; set; }
        public List<Body> Body { get; set; }
    }
    public class Equipment
    {
        public List<Header> Headers { get; set; }
        public List<Body> Body { get; set; }
    }
    public class Comments
    {
        public string Production { get; set; }
        public string Labor { get; set; }
        public string Equipment { get; set; }
    }
    public class Header
    {
        public string value { get; set; }
        public string label { get; set; }
    }
    public class Body 
    {
        public long Id { get; set; }
        public string Payitem { get; set; }
        public string Description { get; set; }
        public decimal Quantity { get; set; }
        public string wo { get; set; }
        public string Location { get; set; }
        public string Employee { get; set; }
        public decimal St { get; set; }
        public decimal Ot { get; set; }
        public decimal Dt { get; set; }
        public string Equipment { get; set; }
        public decimal? Hours { get; set; }
        public bool IsTandM { get; set; }
    }

    public class SewerCamera
    {
        public SewerCameraActivity? SewerCameraActivity { get; set; }
        public SewerCamDetailList? SewerCamDetailsMain { get; set; }
        public SewerCamDetailList? SewerCamDetailsLateral { get; set; }

    }

    public class SewerCamDetailList
    {
        public List<SewerCamDetail>? SewerCamDetail { get; set; }
        public List<Header>? Header { get; set; }
        public int Total { get; set; }
    }

    public class SewerCamDetail
    {
        public string? SewerCamDetailsType { get; set; }
        public string? Location { get; set; }
        public string? Feet { get; set; }
    }

    public class SewerCameraActivity
    {
        public long Id { get; set; }
        public string? ActivityType { get; set; }
        public string? Inspector { get; set; }
        public string? County { get; set; }

        public string? Phase { get; set; }
        public string? Comments { get; set; }

        public string? TruckId { get; set; }

        public List<Header>? Header { get; set; }
    }

}
