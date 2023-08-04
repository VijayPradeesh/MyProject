using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace CustomerPortal.Services.Core.Models
{
    public class JobPayItem
    {
        public long Id { get; set; }
        public Job Job { get; set; }
        public long JobmasterId { get; set; }
        public long PayItemId { get; set; }
        public long WIPayItemId { get; set; }
        public string PayItem { get; set; }
        public string? Description { get; set; }
        public decimal? Quantity { get; set; }
        public string UOM { get; set; }
        public string WO { get; set; }
        public string? PO { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public bool IsTandM { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
    public class JobPayItemConfiguration: IEntityTypeConfiguration<JobPayItem>
    {
        public void Configure (EntityTypeBuilder<JobPayItem> builder)
        {
            builder.ToTable("JobRevenue_T");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                .HasColumnName("ID");

            builder.Property(x => x.JobmasterId)
                .HasColumnName("JobMasterID");

            builder.Property(x => x.WIPayItemId)
                .HasColumnName("WIPayItemID");

            builder.Property(x => x.PayItemId)
                .HasColumnName("JobPayItemID");

            builder.Property(x => x.PayItem)
                .HasColumnName("PayItem");

            builder.Property(x => x.Description)
                .HasColumnName("Description");

            builder.Property(x => x.Quantity)
                .HasColumnName("Qty");

            builder.Property(x => x.UOM)
                .HasColumnName("UOM");

            builder.Property(x => x.PO)
                .HasColumnName("PO");
            builder.Property(x => x.WO)
                .HasColumnName("WO");

            builder.Property(x => x.Address)
                .HasColumnName("Address");

            builder.Property(x => x.City)
                .HasColumnName("City");

            builder.Property(x => x.State)
                .HasColumnName("State");

            builder.Property(x => x.IsTandM)
                .HasColumnName("IsTandM");

            builder.Property(x => x.ModifiedOn)
                .HasColumnName("CLModifiedOn");

            builder.HasOne(x => x.Job)
             .WithMany()
             .HasForeignKey(x => x.JobmasterId)
             .IsRequired();
        }
    }
}
