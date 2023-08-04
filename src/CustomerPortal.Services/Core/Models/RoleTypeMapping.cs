using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CustomerPortal.Services.Core.Models
{
    public class RoleTypeMapping
    {
        public long Id { get; set; }
        public LookUp lookUpType { get; set; }
        public long TypeId { get; set; }
        public LookUp LookUpRole { get; set; }
        public long RoleId { get; set; }

        public User user { get; set; }
        public long AddedBy { get; set; }
        public DateTime AddedDate { get; set; }

        public User? user1 { get; set; }
        public long? ChangedBy { get; set; }
        public DateTime? ChangedDate { get; set; }
        public bool IsActive { get; set; }
    }
    public class RoleTypeMappingConfiguration : IEntityTypeConfiguration<RoleTypeMapping>
    {
        public void Configure(EntityTypeBuilder<RoleTypeMapping> builder)
        {
            builder.ToTable("TypeRoleMapping_T");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id)
                .HasColumnName("ID");
            builder.Property(x => x.IsActive)
                .HasColumnName("Active");
            builder.Property(x => x.TypeId)
                .HasColumnName("CompanyId");
            builder.Property(x => x.RoleId)
                .HasColumnName("RoleID");
            builder.Property(x => x.AddedBy)
                .HasColumnName("AddedBy");
            builder.Property(x => x.AddedDate)
                .HasColumnName("AddedDate");
            builder.Property(x => x.ChangedBy)
                .HasColumnName("ChangedBy");
            builder.Property(x => x.ChangedDate)
                .HasColumnName("ChangedDate");
            builder.HasOne(x => x.lookUpType)
                .WithMany()
                .HasForeignKey(x => x.TypeId)
                .IsRequired();
            builder.HasOne(x => x.LookUpRole)
                .WithMany()
                .HasForeignKey(x => x.RoleId)
                .IsRequired();
            builder.HasOne(x => x.user)
                .WithMany()
                .HasForeignKey(x => x.AddedBy)
                .IsRequired();
            builder.HasOne(x => x.user1)
                .WithMany()
                .HasForeignKey(x => x.ChangedBy);

        }
    }
}
