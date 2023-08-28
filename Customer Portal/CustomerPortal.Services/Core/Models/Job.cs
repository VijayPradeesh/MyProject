using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CustomerPortal.Services.Core.Models
{
    public class Job
    {
        public long Id { get; set; }
        public long Job_Id { get; set; }
        public string Company_Code { get; set; }
        public string Job_Number { get; set; }
        public DateTime Job_Date { get; set; }
        public string Contract { get; set; }
        public string Foreman { get; set; }
        public string Approver { get; set; }
        public DateTime Added_Date { get; set; }
        public int? Changed_By { get; set; }
        public DateTime? Changed_Date { get; set; }
        public bool? Is_Active { get; set; }

        public Job_Status JobStatus { get; set; }
        public int? Status_Id { get; set; }

    }

    public class JobConfiguration : IEntityTypeConfiguration<Job>
    {
        public void Configure(EntityTypeBuilder<Job> builder)
        {
            builder.ToTable("CP_JOB_T");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id)
                .HasColumnName("JOB_ID");
            builder.Property(x => x.Company_Code)
                .HasColumnName("COMPANY_CODE");
            builder.Property(x => x.Job_Number)
                .HasColumnName("JOB_NUMBER");
            builder.Property(x => x.Job_Date)
                .HasColumnName("JOB_DATE");
            builder.Property(x => x.Contract)
                .HasColumnName("CONTRACT");
            builder.Property(x => x.Foreman)
                .HasColumnName("FOREMAN");
            builder.Property(x => x.Approver)
                .HasColumnName("APPROVER");
            builder.Property(x => x.Added_Date)
                .HasColumnName("ADDED_DATE");
            builder.Property(x => x.Changed_By)
                .HasColumnName("CHANGED_BY");
            builder.Property(x => x.Changed_Date)
                .HasColumnName("CHANGED_DATE");
            builder.Property(x => x.Is_Active)
                .HasColumnName("IS_ACTIVE");
            builder.Property(x => x.Status_Id)
                .HasColumnName("STATUS_ID");

            builder.HasOne(x => x.JobStatus)
               .WithMany()
               .HasForeignKey(x => x.Status_Id)
               .IsRequired();
        }
    }
}
