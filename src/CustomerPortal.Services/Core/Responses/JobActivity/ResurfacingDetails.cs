namespace CustomerPortal.Services.Core.Responses.JobActivity
{
    public class Resurfacing
    {
        public List<ResurfacingDetailsResponse>? ResurfacingDetails { get; set; }
        public List<ResurfacingAdditionalMaterials>? AdditionalMaterials { get; set; }
        public List<ResurfacingImages>? Images { get; set; }

        public List<RestorationComments>? Comments { get; set; }

    }

    public class RestorationComments
    {
        public string? Header { get; set; }
        public string? Value { get; set; }
    }

    public class ResurfacingImages
    {
        public long Id { get; set; }
        public string? src { get; set; }
        public int Order { get; set; }

        public string Caption { get; set; }

        public string flag { get; set; }

    }

    public class ResurfacingAdditionalMaterials
    {
        public long Id { get; set; }
        public string? Material { get; set; }

        public decimal? Quantity { get; set; }

        public string? Header { get; set; }

    }
    public class ResurfacingDetailsResponse
    {
        public long Id { get; set; }
        public string SurfaceType { get; set; }

        public string MaterialType { get; set; }
        public Dimensions OriginalSize { get; set; }
        public Dimensions FinalRestoredSize { get; set; }

        public List<ReHeader> Header { get; set; }  

    }

    public class Dimensions
    {
        public decimal? Length { get; set; }
        public decimal? Width { get; set; }
        public decimal? Depth { get; set; }
        public decimal? Diameter { get; set; }
        public string? Type { get; set; }
        public decimal? Total { get; set; }
        public decimal? Quantity { get; set; }
    }

    public class ReHeader
    {
        public string value { get; set; }
        public string label { get; set; }
    }

}
