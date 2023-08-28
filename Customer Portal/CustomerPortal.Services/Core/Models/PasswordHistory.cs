using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CustomerPortal.Services.Core.Models
{
    public class PasswordHistory
    {
        public int Id { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] passwordSalt { get; set; }

        public User User { get; set; }
        public int UserId { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public int? CreatedBy { get; set; }
        public int? ModifiedBy { get; set; }
        public bool IsActive { get; set; }
    }
    public class PasswordHistoryConfiguration: IEntityTypeConfiguration<PasswordHistory>
    {
        public void Configure(EntityTypeBuilder<PasswordHistory> builder)
        {
            builder.ToTable("CP_PASSWORD_HISTORY_T");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                .HasColumnName("PASSWORD_HISTORY_ID");

            builder.Property(x => x.passwordSalt)
                .HasColumnName("PASSWORD_SALT");

            builder.Property(x => x.PasswordHash)
                .HasColumnName("PASSWORD_HASH");

            builder.Property(x => x.UserId)
                .HasColumnName("USER_ID");

            builder.Property(x => x.CreatedOn)
                .HasColumnName("CREATED_ON");

            builder.Property(x => x.IsActive)
                .HasColumnName("IS_ACTIVE");

            builder.Property(x => x.CreatedBy)
                .HasColumnName("CREATED_BY");
            builder.Property(x => x.ModifiedOn)
                .HasColumnName("MODIFIED_ON");
            builder.Property(x => x.ModifiedBy)
                .HasColumnName("MODIFIED_BY");
            builder.HasOne(x => x.User)
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .IsRequired();
        }
    }
}
