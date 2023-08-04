using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace CustomerPortal.Services.Core.Models
{
    public class ContractRegionMapping
    {
        public long Id { get; set; }
        public string Contract { get; set; }
        public LookUp lookup1 { get; set; }
        public long RegionId { get; set; }

        public User user1 { get; set; }
        public long AddedBy { get; set; }
        public DateTime AddedDate { get; set; }

        public User? user2 { get; set; }
        public long? changedBy { get; set; }
        public DateTime? ChangedDate { get; set; }

        public LookUp lookup2 { get; set; }
        public long CustomerId { get; set; }
        public bool IsActive { get; set; }
    }
    public class ContractRegionMappingConfiguration: IEntityTypeConfiguration<ContractRegionMapping>
    {
        public void Configure(EntityTypeBuilder<ContractRegionMapping> builder)
        {
            builder.ToTable("ContractRegionMapping_T");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id)
                .HasColumnName("ID");
            builder.Property(x => x.Contract)
                .HasColumnName("Contract");
            builder.Property(x => x.RegionId)
                .HasColumnName("RegionID");
            builder.Property(x => x.AddedBy)
                .HasColumnName("AddedBy");
            builder.Property(x => x.AddedDate)
                .HasColumnName("AddedDate");
            builder.Property(x => x.changedBy)
                .HasColumnName("ChangedBy");
            builder.Property(x => x.ChangedDate)
                .HasColumnName("ChangedDate");
            builder.Property(x => x.IsActive)
                .HasColumnName("Active");
            builder.Property(x => x.CustomerId)
                .HasColumnName("CompanyId");

            builder.HasOne(x => x.lookup1)
             .WithMany()
             .HasForeignKey(x => x.RegionId)
             .IsRequired();
            builder.HasOne(x => x.lookup2)
             .WithMany()
             .HasForeignKey(x => x.CustomerId);

            builder.HasOne(x => x.user1)
             .WithMany()
             .HasForeignKey(x => x.AddedBy)
             .IsRequired();
            builder.HasOne(x => x.user2)
             .WithMany()
             .HasForeignKey(x => x.changedBy);
        }
    }
}
