using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CustomerPortal.Services.Core.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string FirstName { get; set; }
        public string LastName { get; set; }    
        public string Email { get; set; } = String.Empty;
        public User_Role UserRole { get; set; }
        public int UserRoleId { get; set; }

        public byte[] PasswordHash { get; set; } 

        public byte[] passwordSalt { get; set; }
        public DateTime PasswordUpdatedOn { get; set; }
        public bool IsLockOut { get; set; }
        public DateTime? LockedOutOn { get; set; }
        public DateTime LastLogin { get; set; }
        public DateTime? LoginFailedOn { get; set; }
        public int AccessFailedCount { get; set; }
        public DateTime? AccountCreatedOn { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public bool IsActive { get; set; }
        public bool? isNewlyGeneratedAccount { get; set; }

    }
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("CP_USER_T");

            builder.HasKey(x => x.UserId);

            builder.Property(x => x.UserId)
               .HasColumnName("USER_ID");
            builder.Property(x => x.UserRoleId)
                .HasColumnName("USER_ROLE_ID");
            

            builder.Property(x => x.UserName)
               .HasColumnName("USERNAME");
            builder.Property(x => x.FirstName)
                .HasColumnName("FIRST_NAME");
            builder.Property(x => x.LastName)
                .HasColumnName("LAST_NAME");

            builder.Property(p => p.PasswordHash)
                .HasColumnName("PASSWORD_HASH");

            builder.Property(x => x.passwordSalt)
                .HasColumnName("PASSWORD_SALT");
            builder.Property(x => x.Email)
                .HasColumnName("EMAIL");
            builder.Property(x => x.PasswordUpdatedOn)
                .HasColumnName("PASSWORD_UPDATED_ON");
            builder.Property(x => x.IsLockOut)
                .HasColumnName("IS_LOCKED_OUT");
            builder.Property(x => x.LockedOutOn)
                .HasColumnName("LOCKED_OUT_ON");
            builder.Property(x => x.LastLogin)
                .HasColumnName("LAST_LOGIN");
            builder.Property(x => x.LoginFailedOn)
                .HasColumnName("LOGIN_FAILED_ON");
            builder.Property(x => x.AccessFailedCount)
                .HasColumnName("ACCESS_FAILED_COUNT");
            builder.Property(x => x.AccountCreatedOn)
                .HasColumnName("CREATED_ON");
            builder.Property(x => x.CreatedBy)
                .HasColumnName("CREATED_BY");
            builder.Property(x => x.ModifiedBy)
                .HasColumnName("MODIFIED_BY");
            builder.Property(x => x.ModifiedOn)
                .HasColumnName("MODIFIED_ON");
            builder.Property(x => x.IsActive)
                .HasColumnName("IS_ACTIVE");
            builder.Property(x => x.isNewlyGeneratedAccount)
                .HasColumnName("IS_NEW_ACCOUNT");

            builder.HasOne(x => x.UserRole)
               .WithMany()
               .HasForeignKey(x => x.UserRoleId)
               .IsRequired();

        }
    }
}
