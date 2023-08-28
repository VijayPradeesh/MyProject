using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CustomerPortal.Services.Core.Models
{
    public class User_Role
    {
        public int Id { get; set; }
        public string UserRole { get; set; }
        public User_Type UserType { get; set; }
        public int UserTypeId { get; set; }
        public bool IsActive { get; set; }
    }
    public class UserRoleConfiguration : IEntityTypeConfiguration<User_Role>
    {
        public void Configure(EntityTypeBuilder<User_Role> builder)
        {
            builder.ToTable("CP_USER_ROLE_T");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                .HasColumnName("USER_ROLE_ID");

            builder.Property(x => x.UserRole)
                .HasColumnName("USER_ROLE");

            builder.Property(x => x.UserTypeId)
                .HasColumnName("USER_TYPE_ID");

            builder.Property(x => x.IsActive)
                .HasColumnName("IS_ACTIVE");

            builder.HasOne(x => x.UserType)
               .WithMany()
               .HasForeignKey(x => x.UserTypeId)
               .IsRequired();
        }
    }
}
