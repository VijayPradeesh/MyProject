using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CustomerPortal.Services.Core.Models
{
    public class User
    {
        public long UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; } = String.Empty;
        public DateTime PasswordUpdatedOn { get; set; }
        public bool IsLockOut { get; set; }
        public DateTime? LockedOutOn { get; set; }
        public DateTime? LastLogin { get; set; }
        public DateTime? LoginFailedOn { get; set; }
        public int AccessFailedCount { get; set; }
        public DateTime? AccountCreatedOn { get; set; }
        public long? CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public long? ModifiedBy { get; set; }
        public bool IsActive { get; set; }
        public bool? isNewlyGeneratedAccount { get; set; }
        public bool? ForgetPassword { get; set; }

        public byte[]? Signature { get; set; }

    }
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("User_T");
            builder.HasKey(x => x.UserId);
            builder.Property(x => x.UserId)
               .HasColumnName("ID");
            builder.Property(x => x.UserName)
               .HasColumnName("Username");
            builder.Property(x => x.FirstName)
                .HasColumnName("FirstName");
            builder.Property(x => x.LastName)
                .HasColumnName("LastName");
            builder.Property(x => x.Email)
                .HasColumnName("Email");
            builder.Property(x => x.PasswordUpdatedOn)
                .HasColumnName("PasswordUpdatedOn");
            builder.Property(x => x.IsLockOut)
                .HasColumnName("IsLockedOut");
            builder.Property(x => x.LockedOutOn)
                .HasColumnName("LockedOutOn");
            builder.Property(x => x.LastLogin)
                .HasColumnName("LastLoginDate");
            builder.Property(x => x.LoginFailedOn)
                .HasColumnName("LoginFailedDate");
            builder.Property(x => x.AccessFailedCount)
                .HasColumnName("AccessFailedCount");
            builder.Property(x => x.AccountCreatedOn)
                .HasColumnName("AddedDate");
            builder.Property(x => x.CreatedBy)
                .HasColumnName("AddedBy");
            builder.Property(x => x.ModifiedBy)
                .HasColumnName("ChangedBy");
            builder.Property(x => x.ModifiedOn)
                .HasColumnName("ChangedDate");
            builder.Property(x => x.IsActive)
                .HasColumnName("Active");
            builder.Property(x => x.isNewlyGeneratedAccount)
                .HasColumnName("IsNewAccount");
            builder.Property(x => x.ForgetPassword)
                .HasColumnName("ForgotPassword");
            builder.Property(x => x.Signature)
                .HasColumnName("Signature");

        }
    }
}
