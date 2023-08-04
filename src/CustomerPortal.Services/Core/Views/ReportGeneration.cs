using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace CustomerPortal.Services.Core.Views
{
    [Keyless]
    public class ReportGeneration : Base
    {
        public string? ForemanComments { get; set; }
        public string? EquipmentComments { get; set; }
        public string? LaborComments { get; set; }

        public string? UOM { get; set; }
        public string? PO { get; set; }
        public string? PayItem { get; set; }
        public string? Description { get; set; }
        public decimal? Quantity { get; set; }
        public string? WbsDescription { get; set; }
    }

    public class ReportGenerationConfiguration : IEntityTypeConfiguration<ReportGeneration>
    {
        public void Configure(EntityTypeBuilder<ReportGeneration> builder)
        {
            builder.ToView("DFR_Report_Revenue_Export_v");
            builder.Property(x => x.JobId)
                .HasColumnName("JobId");
            builder.Property(x => x.JobDate)
                .HasColumnName("JobDate");
            builder.Property(x => x.JobNumber)
                .HasColumnName("JobNumber");
            builder.Property(x => x.ForemanComments)
                .HasColumnName("ForemanComments");
            builder.Property(x => x.EquipmentComments)
                .HasColumnName("EquipmentComments");
            builder.Property(x => x.LaborComments)
                .HasColumnName("LaborComments");
            builder.Property(x => x.PayItem)
                .HasColumnName("PayItem");
            builder.Property(x => x.Description)
                .HasColumnName("Description");
            builder.Property(x => x.WO)
                .HasColumnName("WO");
            builder.Property(x => x.PO)
                .HasColumnName("PO");
            builder.Property(x => x.Quantity)
                .HasColumnName("Quantity");
            builder.Property(x => x.Address)
                .HasColumnName("Address");
            builder.Property(x => x.ForemanName)
                .HasColumnName("ForemanName");
            builder.Property(x => x.UOM)
                .HasColumnName("UOM");
            builder.Property(x => x.Status)
                .HasColumnName("Status");
            builder.Property(x => x.ContractNumber)
                .HasColumnName("Contract");
            builder.Property(x => x.WbsDescription)
                .HasColumnName("WbsDescription");
            
        }
    }
}
