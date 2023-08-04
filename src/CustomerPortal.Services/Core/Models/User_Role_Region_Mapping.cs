
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace CustomerPortal.Services.Core.Models
{
    public class User_Role_Region_Mapping
    {
        public long Id { get; set; }
        public User User { get; set; }

        public long UserId { get; set; }

        public RoleTypeMapping roleType { get; set; }
        public long TypeRoleId { get; set; }
        public LookUp lookUpRegion { get; set; }
        public long RegionId { get; set; }

        public User Added { get; set; }
        public long AddedBy { get; set; }
        public DateTime AddedDate { get; set; }

        public User? Changed { get; set; }
        public long? ChangedBy { get; set; }
        public DateTime? ChangedOn { get; set; }
        public bool IsActive { get; set; }
    }
    public class User_Role_Region_MappingConfiguration: IEntityTypeConfiguration<User_Role_Region_Mapping>
    {
        public void Configure(EntityTypeBuilder<User_Role_Region_Mapping> builder)
        {
            builder.ToTable("UserRoleRegionMapping_T");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id)
                .HasColumnName("ID");
            builder.Property(x => x.UserId)
                .HasColumnName("UserID");
            builder.Property(x => x.RegionId)
                .HasColumnName("RegionID");
            builder.Property(x => x.TypeRoleId)
                .HasColumnName("TypeRoleID");
            builder.Property(x => x.IsActive)
                .HasColumnName("Active");
            builder.Property(x => x.AddedBy)
                .HasColumnName("AddedBy");
            builder.Property(x => x.AddedDate)
                .HasColumnName("AddedDate");
            builder.Property(x => x.ChangedBy)
                .HasColumnName("ChangedBy");
            builder.Property(x => x.ChangedOn)
                .HasColumnName("ChangedDate");

            builder.HasOne(x => x.User)
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .IsRequired();
            builder.HasOne(x => x.Added)
                .WithMany()
                .HasForeignKey(x => x.AddedBy)
                .IsRequired();
            builder.HasOne(x => x.Changed)
                .WithMany()
                .HasForeignKey(x => x.ChangedBy);

            builder.HasOne(x => x.lookUpRegion)
                .WithMany()
                .HasForeignKey(x => x.RegionId)
                .IsRequired();
            builder.HasOne(x => x.roleType)
                .WithMany()
                .HasForeignKey(x => x.TypeRoleId)
                .IsRequired();
        }
    }
}
