using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace CustomerPortal.Services.Core.Views
{
    [Keyless]
    public class ResurfacingReport : Base
    {
        public string SurfaceType { get; set; }
        public string MaterialType { get; set; }
        public decimal? Length { get; set; }
        public decimal? Width { get; set; }
        public decimal? Depth { get; set; }
        public decimal? Diameter { get; set; }
        public decimal? Total { get; set; }
        public string? Type { get; set; }
        public decimal? Quantity { get; set; }

        public bool UOM { get; set; }
    }

    public class ResurfacingReportConfiguration : IEntityTypeConfiguration<ResurfacingReport>
    {
        public void Configure(EntityTypeBuilder<ResurfacingReport> builder)
        {
            builder.ToView("DFR_Report_Resurfacing_Export_v");
            builder.Property(x => x.JobId)
                .HasColumnName("ResurfacingId");
            builder.Property(x => x.ForemanName)
                .HasColumnName("ForemanName");
            builder.Property(x => x.Status)
               .HasColumnName("Status");
            builder.Property(x => x.ContractNumber)
             .HasColumnName("Contract");
            builder.Property(x => x.JobDate)
                .HasColumnName("JobDate");
            builder.Property(x => x.JobNumber)
                .HasColumnName("JobNumber");
            builder.Property(x => x.WO)
                .HasColumnName("WO");
            builder.Property(x => x.Address)
                .HasColumnName("Address");
            builder.Property(x => x.UOM)
              .HasColumnName("UOM");
            builder.Property(x => x.SurfaceType)
                .HasColumnName("SurfaceType");
            builder.Property(x => x.MaterialType)
                .HasColumnName("MaterialType");
            builder.Property(x => x.Length)
                .HasColumnName("Length");
            builder.Property(x => x.Width)
                .HasColumnName("Width");
            builder.Property(x => x.Depth)
                .HasColumnName("Depth");
            builder.Property(x => x.Diameter)
               .HasColumnName("Diameter");
            builder.Property(x => x.Quantity)
                .HasColumnName("Quantity");
            builder.Property(x => x.Type)
               .HasColumnName("Type");
            builder.Property(x => x.Total)
               .HasColumnName("Total");
        }
    }
}
