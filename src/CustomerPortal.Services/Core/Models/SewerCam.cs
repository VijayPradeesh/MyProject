using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CustomerPortal.Services.Core.Models
{
    public class SewerCam
    {
        public long Id { get; set; }

        public Job Job { get; set; }
        public long JobId { get; set; }

        public LookUp? lookup { get; set; }
        public long? ActivityTypeId { get; set; }
        public string? Inspector { get; set; }
        public string? County { get; set; }
        public string? Phase { get; set; }

        public string? TruckId { get; set; }
        public string? Comments { get; set; }

        public DateTime ModifiedOn { get; set; }
    }

    public class SewerCamConfiguration : IEntityTypeConfiguration<SewerCam>
    {
        public void Configure(EntityTypeBuilder<SewerCam> builder)
        {
            builder.ToTable("SewerCam_T");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id)
                .HasColumnName("SewerCamId");
            
            builder.Property(x => x.JobId)
                .HasColumnName("JobMasterId");
            builder.Property(x => x.ActivityTypeId)
                .HasColumnName("ActivityTypeId");
            builder.Property(x => x.Inspector)
                .HasColumnName("Inspector");
            builder.Property(x => x.County)
                .HasColumnName("County");
            builder.Property(x => x.Phase)
                .HasColumnName("Phase");
            builder.Property(x => x.Comments)
                .HasColumnName("Comments");
            builder.Property(x => x.TruckId)
                .HasColumnName("TruckId");



            builder.HasOne(x => x.lookup)
                .WithMany()
                .HasForeignKey(x => x.ActivityTypeId)
                .IsRequired();
            builder.HasOne(x => x.Job)
                .WithMany()
                .HasForeignKey(x => x.JobId)
                .IsRequired();


        }
        
    }
}
