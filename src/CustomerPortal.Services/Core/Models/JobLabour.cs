
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace CustomerPortal.Services.Core.Models
{
    public class JobLabour
    {
        public long Id { get; set; }

        public Job Job { get; set; }
        public long JobMasterId { get; set; }
        public long JobLabourId { get; set; }
        public string EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public decimal? St { get; set; }
        public decimal? Ot { get; set; }
        public decimal? Dt { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
    public class JoblabourConfiguration : IEntityTypeConfiguration<JobLabour>
    {
        public void Configure(EntityTypeBuilder<JobLabour> builder)
        {
            builder.ToTable("JobLabor_T");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id)
                .HasColumnName("ID");
            builder.Property(x => x.JobMasterId)
                .HasColumnName("JobMasterID");
            builder.Property(x => x.JobLabourId)
                .HasColumnName("JobLaborID");
            builder.Property(x => x.EmployeeId)
                .HasColumnName("EmployeeID");
            builder.Property(x => x.EmployeeName)
                .HasColumnName("EmployeeName");
            builder.Property(x => x.St)
                .HasColumnName("STHours");
            builder.Property(x => x.Ot)
                .HasColumnName("OTHours");
            builder.Property(x => x.Dt)
                .HasColumnName("DTHours");
            builder.Property(x => x.ModifiedOn)
                .HasColumnName("CLModifiedOn");

            builder.HasOne(x => x.Job)
             .WithMany()
             .HasForeignKey(x => x.JobMasterId)
             .IsRequired();


        }
    }
}
