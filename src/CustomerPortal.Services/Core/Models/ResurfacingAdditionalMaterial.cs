using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CustomerPortal.Services.Core.Models
{
    public class ResurfacingAdditionalMaterial
    {
        public long ID { get; set; }
        public long ResurfacingMasterId { get; set; }
        public string? AdditionalMaterial { get; set; }
        public decimal? Quantity { get; set; }
        public DateTime? CLModifiedOn { get; set; }
    }

    public class ResurfacingAdditionalMaterialConfiguration : IEntityTypeConfiguration<ResurfacingAdditionalMaterial>
    {
        public void Configure(EntityTypeBuilder<ResurfacingAdditionalMaterial> builder)
        {
            builder.ToTable("ResurfacingAdditionalMaterial_T");
            builder.HasKey(x => x.ID);
            builder.Property(x => x.ID)
                .HasColumnName("ID");
            builder.Property(x => x.ResurfacingMasterId)
                .HasColumnName("ResurfacingMasterId");
            builder.Property(x => x.AdditionalMaterial)
                .HasColumnName("AdditionalMaterial");
            builder.Property(x => x.CLModifiedOn)
                .HasColumnName("CLModifiedOn");

        }
    }
}
