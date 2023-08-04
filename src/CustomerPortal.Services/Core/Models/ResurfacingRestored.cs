using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CustomerPortal.Services.Core.Models
{
    public class ResurfacingRestored
    {
		public long ID { get; set; }
		public long ResurfacingMasterId { get; set; }
		public string SurfaceType { get; set; }
		public string MaterialType { get; set; }
		public decimal? OriginalLength { get; set; }
		public decimal? OriginalWidth { get; set; }
		public decimal? OriginalDepth { get; set; }
		public decimal? OriginalDiameter { get; set; }
		public decimal? OriginalCount { get; set; }
		public string? OriginalType { get; set; }
		public decimal? OriginalTotal { get; set; }
		public decimal? RestoredLength { get; set; }
		public decimal? RestoredWidth { get; set; }
		public decimal? RestoredDepth { get; set; }
		public decimal? RestoredDiameter { get; set; }
		public decimal? RestoredTotal { get; set; }
		public string? RestoredType { get; set; }
		public bool? IsCompleted { get; set; }
		public DateTime? CLModifiedOn { get; set; }
		public decimal? RestoredCount { get; set; }
	}

	public class ResurfacingRestoredConfiguration: IEntityTypeConfiguration<ResurfacingRestored>
    {
		public void Configure(EntityTypeBuilder<ResurfacingRestored> builder)
        {
			builder.ToTable("ResurfacingRestored_T");
			builder.HasKey(x=>x.ID);
			builder.Property(x => x.SurfaceType)
				.HasColumnName("SurfaceType");
			builder.Property(x => x.MaterialType)
				.HasColumnName("MaterialType");

			builder.Property(x => x.OriginalLength)
				.HasColumnName("OriginalLength");

			builder.Property(x => x.OriginalWidth)
				.HasColumnName("OriginalWidth");

			builder.Property(x => x.OriginalDepth)
				.HasColumnName("OriginalDepth");

			builder.Property(x => x.OriginalDiameter)
				.HasColumnName("OriginalDiameter");

			builder.Property(x => x.OriginalCount)
				.HasColumnName("OriginalCount");

			builder.Property(x => x.OriginalType)
				.HasColumnName("OriginalType");

			builder.Property(x => x.OriginalTotal)
				.HasColumnName("OriginalTotal");

			builder.Property(x => x.RestoredLength)
				.HasColumnName("RestoredLength");

			builder.Property(x => x.RestoredWidth)
				.HasColumnName("RestoredWidth");

			builder.Property(x => x.RestoredDepth)
				.HasColumnName("RestoredDepth");

			builder.Property(x => x.RestoredCount)
				.HasColumnName("RestoredCount");

			builder.Property(x => x.RestoredDiameter)
				.HasColumnName("RestoredDiameter");

			builder.Property(x => x.RestoredType)
				.HasColumnName("RestoredType");

			builder.Property(x => x.RestoredTotal)
				.HasColumnName("RestoredTotal");

			builder.Property(x => x.IsCompleted)
				.HasColumnName("IsCompleted");

			builder.Property(x => x.CLModifiedOn)
				.HasColumnName("CLModifiedOn");





		}
    }
}
