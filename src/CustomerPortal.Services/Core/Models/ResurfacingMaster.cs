using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CustomerPortal.Services.Core.Models
{
    public class ResurfacingMaster : Master
    {
        public long ResurfacingId { get; set; }

        public string StreetAddress { get; set; }
        public string WorkOrder { get; set; }

        public string City { get; set; }
        public string State { get; set; }
        public DateTime? BacklogWorkDate { get; set; }
        public bool? TrafficControl { get; set; }

        public bool? CustomerComplaint { get; set; }

        public string? Comments { get; set; }

        public bool IsSquareFeet { get; set; }

        public bool? Is_Requester { get; set; }

    }

    public class ResurfacingConfiguration : IEntityTypeConfiguration<ResurfacingMaster>
    {
        public void Configure(EntityTypeBuilder<ResurfacingMaster> builder)
        {
            builder.ToTable("ResurfacingMaster_T");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id)
                .HasColumnName("ID");
            builder.Property(x => x.ResurfacingId)
                .HasColumnName("ResurfacingId");
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

            builder.Property(x => x.StreetAddress)
                .HasColumnName("StreetAddress");

            builder.Property(x => x.StreetAddress)
                .HasColumnName("StreetAddress");
            builder.Property(x => x.WorkOrder)
                .HasColumnName("WorkOrder");
            builder.Property(x => x.City)
                .HasColumnName("City");
            builder.Property(x => x.State)
                .HasColumnName("State");
            builder.Property(x => x.BacklogWorkDate)
                .HasColumnName("BacklogWorkDate");
            builder.Property(x => x.TrafficControl)
               .HasColumnName("TrafficControl");
            builder.Property(x => x.CustomerComplaint)
               .HasColumnName("CustomerComplaint");
            builder.Property(x => x.Comments)
               .HasColumnName("Comments");
            builder.Property(x => x.ClModifiedOn)
                .HasColumnName("CLModifiedOn");
            builder.Property(x => x.IsSquareFeet)
                .HasColumnName("IsSquareFeet");
            builder.Property(x => x.Is_Requester)
               .HasColumnName("IsRequester");
        }
    }
}
