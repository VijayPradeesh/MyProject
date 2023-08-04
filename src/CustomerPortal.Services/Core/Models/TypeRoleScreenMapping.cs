using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace CustomerPortal.Services.Core.Models
{
    public class TypeRoleScreenMapping
    {
        public long Id { get; set; }

        public LookUp lookup { get; set; }
        public long TypeRoleId { get; set; }

        public LookUp lookup1 { get; set; }
        public long Screenid { get; set; }
        public long AddedBy { get; set; }
        public DateTime AddedDate { get; set; }
        public long? ChangedBy { get; set; }
        public DateTime? ChangedDate { get; set; }
        public bool IsActive { get; set; }
    }

    public class TypeRoleScreenMappingConfiguration: IEntityTypeConfiguration<TypeRoleScreenMapping>
    {
        public void Configure(EntityTypeBuilder<TypeRoleScreenMapping> builder)
        {
            builder.ToTable("TypeRoleScreenMapping_T");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.TypeRoleId)
                .HasColumnName("CompanyRoleID");
            builder.Property(x => x.Screenid)
                .HasColumnName("ScreenID");
            builder.Property(x => x.AddedBy)
                .HasColumnName("AddedBy");
            builder.Property(x => x.AddedDate)
                .HasColumnName("AddedDate");
            builder.Property(x => x.ChangedBy)
                .HasColumnName("ChangedBy");
            builder.Property(x => x.ChangedDate)
                .HasColumnName("ChangedDate");
            builder.Property(x => x.IsActive)
                .HasColumnName("Active");

            builder.HasOne(x => x.lookup)
                .WithMany()
                .HasForeignKey(x => x.TypeRoleId)
                .IsRequired();
            builder.HasOne(x => x.lookup1)
                .WithMany()
                .HasForeignKey(x => x.Screenid)
                .IsRequired();


        }
    }
}
