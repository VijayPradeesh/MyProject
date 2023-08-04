using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace CustomerPortal.Services.Core.Models
{
    public class JobEquipment
    {
        public long Id { get; set; }

        public Job Job { get; set; }
        public long JobMasterId { get; set; }
        public long jobEquipmentId { get; set; }
        public string EquipmentCode { get; set; }
        public string EquipmentDescription { get; set; }
        public decimal? Hours { get; set; }
        public DateTime? Modified_On { get; set; }

    }
    public class JobEquipmentConfiguration: IEntityTypeConfiguration<JobEquipment>
    {
        public void Configure(EntityTypeBuilder<JobEquipment> builder)
        {
            builder.ToTable("JobEquipment_T");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id)
                .HasColumnName("ID");
            builder.Property(x => x.JobMasterId)
                .HasColumnName("JobMasterID");
            builder.Property(x => x.jobEquipmentId)
                .HasColumnName("JobEquipmentID");
            builder.Property(x => x.EquipmentCode)
                .HasColumnName("EquipmentCode");
            builder.Property(x => x.EquipmentDescription)
                .HasColumnName("EquipmentDescription");
            builder.Property(x => x.Hours)
                .HasColumnName("Hours");
            builder.Property(x => x.Modified_On)
                .HasColumnName("CLModifiedOn");
            builder.HasOne(x => x.Job)
              .WithMany()
              .HasForeignKey(x => x.JobMasterId)
              .IsRequired();

        }
    }
}
