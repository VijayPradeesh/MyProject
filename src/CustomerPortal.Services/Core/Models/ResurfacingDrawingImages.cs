using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CustomerPortal.Services.Core.Models
{
    public class ResurfacingDrawingImages
    {
        public long ID { get; set; }
        public long ResurfacingMasterId { get; set; }
        // public string? Image{get;set;}
        public int ImageOrder { get; set; }
        public DateTime? CLModifiedOn { get; set; }

        public string? Comments { get; set; }

        public string? flag { get; set; }

        public byte[]? ImageBinary { get; set; }
    }
    public class ResurfacingDrawingImagesConfiguration : IEntityTypeConfiguration<ResurfacingDrawingImages>
    {
        public void Configure(EntityTypeBuilder<ResurfacingDrawingImages> builder)
        {
            builder.ToTable("ResurfacingDrawingImages_T");
            builder.HasKey(x => x.ID);
            builder.Property(x => x.ID)
                .HasColumnName("ID");
            builder.Property(x => x.ResurfacingMasterId)
                .HasColumnName("ResurfacingMasterId");
            //builder.Property(x => x.Image)
            //    .HasColumnName("Image");
            builder.Property(x => x.ImageOrder)
                .HasColumnName("ImageOrder");
            builder.Property(x => x.CLModifiedOn)
                .HasColumnName("CLModifiedOn");
            builder.Property(x => x.Comments)
                .HasColumnName("Comments");

            builder.Property(x => x.flag)
              .HasColumnName("Flag");
            builder.Property(x => x.ImageBinary)
                .HasColumnName("ImagesBinary");

        }
    }


}
