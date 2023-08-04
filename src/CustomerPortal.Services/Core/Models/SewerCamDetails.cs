using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CustomerPortal.Services.Core.Models
{
    public class SewerCamDetails
    {
        public long Id { get; set; }
        public SewerCam? SewerCam { get; set; }
        public long? SewerCamId { get; set; }

        public LookUp? SewerCamType { get; set; }
        public long? SewerCamTypeId { get; set; }
        public string? Location { get; set; }
        public string? Feet { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }

    public class SewerCamDetailsConfiguration: IEntityTypeConfiguration<SewerCamDetails>
    {
        public void Configure(EntityTypeBuilder<SewerCamDetails> builder)
        {
            builder.ToTable("SewerCamDetails_T");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id)
                .HasColumnName("SewerCamDetailsId");
            builder.Property(x => x.SewerCamId)
                .HasColumnName("SewerCamId");
            builder.Property(x => x.SewerCamTypeId)
                .HasColumnName("SewerCamTypeId");
            builder.Property(x=>x.Location)
                .HasColumnName("Location");
            builder.Property(x => x.Feet)
                .HasColumnName("Feet");
            builder.Property(x => x.ModifiedOn)
                .HasColumnName("CLModifiedOn");


            builder.HasOne(x => x.SewerCam)
                .WithMany()
                .HasForeignKey(x => x.SewerCamId)
                .IsRequired();
            builder.HasOne(x => x.SewerCamType)
                .WithMany()
                .HasForeignKey(x => x.SewerCamTypeId);
                

        }
    }
}
