using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CustomerPortal.Services.Core.Models
{
    public class Job : Master
    {
        
        public long Job_Id { get; set; }
       
        public bool? Is_Requester { get; set; }
    }

    public class JobConfiguration : IEntityTypeConfiguration<Job>
    {
        public void Configure(EntityTypeBuilder<Job> builder)
        {
            builder.ToTable("JobMaster_T");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id)
                .HasColumnName("ID");
            builder.Property(x => x.Job_Id)
                .HasColumnName("JobID");
            builder.Property(x => x.Company_Code)
                .HasColumnName("CompanyCode");
            builder.Property(x => x.Job_Number)
                .HasColumnName("JobNumber");
            builder.Property(x => x.Job_Date)
                .HasColumnName("JobStartDate");
            builder.Property(x => x.Contract)
                .HasColumnName("Contract");
            builder.Property(x => x.ForemanId)
                .HasColumnName("ForemanID");
            builder.Property(x => x.Foreman)
                .HasColumnName("ForemanName");
            builder.Property(x => x.ForemanRole)
                .HasColumnName("ForemanRole");
            builder.Property(x => x.ApproverId)
                .HasColumnName("ApproverID");
            builder.Property(x => x.Approver)
                .HasColumnName("ApproverName");
            builder.Property(x => x.ApproverRole)
                .HasColumnName("ApproverRole");
            builder.Property(x => x.Added_Date)
                .HasColumnName("AddedDate");
            builder.Property(x => x.Changed_Date)
                .HasColumnName("ChangedDate");
            builder.Property(x => x.Is_Active)
                .HasColumnName("Active");
            builder.Property(x => x.ForemanRole)
                .HasColumnName("ForemanRole");
            builder.Property(x => x.ApproverRole)
                .HasColumnName("ApproverRole");
            builder.Property(x=>x.Is_Requester)
                .HasColumnName("IsRequester");
            builder.Property(x => x.ClModifiedOn)
                .HasColumnName("CLModifiedOn");
        }
    }
}
