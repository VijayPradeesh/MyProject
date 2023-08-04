using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CustomerPortal.Services.Core.Models
{
    public class PasswordHistory
    {
        public long Id { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] passwordSalt { get; set; }

        public User User { get; set; }
        public long UserId { get; set; }
        public DateTime CreatedOn { get; set; }

        public long AddedBy { get; set; }
        public long? ChangedBy { get; set; }
        public DateTime? ChangedDate { get; set; }
        public bool IsPasswordActive { get; set; }
    }
    public class PasswordHistoryConfiguration: IEntityTypeConfiguration<PasswordHistory>
    {
        public void Configure(EntityTypeBuilder<PasswordHistory> builder)
        {
            builder.ToTable("UserPasswordHistory_T");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id)
                .HasColumnName("ID");
            builder.Property(x => x.passwordSalt)
                .HasColumnName("PasswordSalt");
            builder.Property(x => x.PasswordHash)
                .HasColumnName("PasswordHash");
            builder.Property(x => x.UserId)
                .HasColumnName("UserID");
            builder.Property(x => x.CreatedOn)
                .HasColumnName("AddedDate");
            builder.Property(x => x.IsPasswordActive)
                .HasColumnName("Active");
            builder.Property(x => x.AddedBy)
                .HasColumnName("AddedBy");
            builder.Property(x => x.ChangedBy)
                .HasColumnName("ChangedBy");
            builder.Property(x => x.ChangedDate)
                .HasColumnName("ChangedDate");
            builder.HasOne(x => x.User)
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .IsRequired();
        }
    }
}
