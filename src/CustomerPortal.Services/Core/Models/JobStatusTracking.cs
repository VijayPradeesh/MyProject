using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace CustomerPortal.Services.Core.Models
{
    public class JobStatusTracking : StatusTrackingBase
    {
        public Job Job { get; set; }
        public long JobId { get; set; }
        public string? RequesterName { get; set; }
    }

    public class ResurfacingStatusTracking : StatusTrackingBase
    {
        public ResurfacingMaster Resurfacing { get; set; }
        public long ResurfacingId { get; set; }
    }

    public class JobStatusTrackingConfiguration : IEntityTypeConfiguration<JobStatusTracking>
    {
        public void Configure(EntityTypeBuilder<JobStatusTracking> builder)
        {
            builder.ToTable("DFRStatusTracking_T");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id)
                .HasColumnName("ID");
            builder.Property(x => x.JobId)
                .HasColumnName("JobMasterID");
            builder.Property(x => x.StatusId)
                .HasColumnName("StatusID");
            builder.Property(x => x.Comment)
                .HasColumnName("Comment");
            builder.Property(x => x.AddedDate)
                .HasColumnName("AddedDate");
            builder.Property(x => x.ChangedBy)
                .HasColumnName("ChangedBy");
            builder.Property(x => x.ChangeDate)
                .HasColumnName("ChangedDate");
            builder.Property(x => x.IsActive)
                .HasColumnName("Active");
            builder.Property(x => x.ClUserId)
                .HasColumnName("CLUserID");

            builder.Property(x => x.CPUserId)
                .HasColumnName("CPUserID");
            builder.Property(x => x.IPAddress)
                .HasColumnName("CPIPAddress");

            builder.Property(x => x.Username)
               .HasColumnName("CLUsername");

            builder.Property(x => x.Role)
              .HasColumnName("CLUserrole");

            builder.Property(x => x.ReasonRejectionId)
                .HasColumnName("ReasonTypeID");
            builder.Property(x => x.Signature)
                .HasColumnName("Signature");
            builder.Property(x => x.RequesterName)
                .HasColumnName("Requester");

            builder.HasOne(x => x.Job)
              .WithMany()
              .HasForeignKey(x => x.JobId)
              .IsRequired();
            builder.HasOne(x => x.lookup)
              .WithMany()
              .HasForeignKey(x => x.StatusId)
              .IsRequired();
            builder.HasOne(x => x.user)
              .WithMany()
              .HasForeignKey(x => x.CPUserId);
            builder.HasOne(x => x.ReasonRejection)
              .WithMany()
              .HasForeignKey(x => x.ReasonRejectionId);
        }
    }

    public class ResurfacingStatusTrackingConfiguration : IEntityTypeConfiguration<ResurfacingStatusTracking>
    {
        public void Configure(EntityTypeBuilder<ResurfacingStatusTracking> builder)
        {
            builder.ToTable("ResurfacingStatusTracking_T");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id)
                .HasColumnName("ID");
            builder.Property(x => x.ResurfacingId)
                .HasColumnName("ResurfacingMasterId");
            builder.Property(x => x.StatusId)
                .HasColumnName("StatusID");
            builder.Property(x => x.Comment)
                .HasColumnName("Comment");
            builder.Property(x => x.AddedDate)
                .HasColumnName("AddedDate");
            builder.Property(x => x.ChangedBy)
                .HasColumnName("ChangedBy");
            builder.Property(x => x.ChangeDate)
                .HasColumnName("ChangedDate");
            builder.Property(x => x.IsActive)
                .HasColumnName("Active");
            builder.Property(x => x.ClUserId)
                .HasColumnName("CLUserID");

            builder.Property(x => x.CPUserId)
                .HasColumnName("CPUserID");
            builder.Property(x => x.IPAddress)
                .HasColumnName("CPIPAddress");

            builder.Property(x => x.Username)
               .HasColumnName("CLUsername");

            builder.Property(x => x.Role)
              .HasColumnName("CLUserrole");

            builder.Property(x => x.ReasonRejectionId)
                .HasColumnName("ReasonTypeID");
            builder.Property(x => x.Signature)
                .HasColumnName("Signature");

            builder.Property(x => x.RequesterName)
               .HasColumnName("Requester");


            builder.HasOne(x => x.Resurfacing)
              .WithMany()
              .HasForeignKey(x => x.ResurfacingId)
              .IsRequired();
            builder.HasOne(x => x.lookup)
              .WithMany()
              .HasForeignKey(x => x.StatusId)
              .IsRequired();
            builder.HasOne(x => x.user)
              .WithMany()
              .HasForeignKey(x => x.CPUserId);
            builder.HasOne(x => x.ReasonRejection)
              .WithMany()
              .HasForeignKey(x => x.ReasonRejectionId);
        }
    }
}
