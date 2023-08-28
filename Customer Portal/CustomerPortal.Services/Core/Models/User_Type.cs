using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CustomerPortal.Services.Core.Models
{
    public class User_Type
    {
        public int Id { get; set; }
        public string UserType { get; set; }
        public bool IsActive { get; set; }
    }

    public class UserTypeConfiguration: IEntityTypeConfiguration<User_Type>
    {
        public void Configure(EntityTypeBuilder<User_Type> builder)
        {
            builder.ToTable("CP_USER_TYPE_T");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id)
                .HasColumnName("USER_TYPE_ID");
            builder.Property(x => x.UserType)
                .HasColumnName("USER_TYPE");
            builder.Property(x => x.IsActive)
                .HasColumnName("IS_ACTIVE");
        }
    }
}
