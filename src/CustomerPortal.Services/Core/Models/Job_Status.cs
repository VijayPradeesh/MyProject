using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CustomerPortal.Services.Core.Models
{
    public class Job_Status
    {
        public int Id { get; set; }
        public string Status { get; set; }
        public bool IsActive { get; set; }
    }

    public class JobStatusConfiguration : IEntityTypeConfiguration<Job_Status>
    {
        public void Configure(EntityTypeBuilder<Job_Status> builder)
        {
            builder.ToTable("CP_JOB_STATUS_T");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                .HasColumnName("STATUS_ID");

            builder.Property(x => x.Status)
                .HasColumnName("STATUS");

            builder.Property(x => x.IsActive)
                .HasColumnName("IS_ACTIVE");

            
        }
    }
}
