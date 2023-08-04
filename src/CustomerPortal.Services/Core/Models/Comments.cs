using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace CustomerPortal.Services.Core.Models
{
    public class Comments
    {
        public long Id { get; set; }

        public Job Job { get; set; }
        public long JobMasterId { get; set; }
        public long CLCommentId { get; set; }
        public long CommentId { get; set; }
        public string? Comment { get; set; }
        public DateTime? Modified_On { get; set; } 
    }

    public class CommentsConfiguration: IEntityTypeConfiguration<Comments>
    {
        public void Configure(EntityTypeBuilder<Comments> builder)
        {
            builder.ToTable("Comment_T");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id)
                .HasColumnName("ID");
            builder.Property(x => x.JobMasterId)
                .HasColumnName("JobMasterID");
            builder.Property(x => x.CommentId)
                .HasColumnName("CommentTypeID");
            builder.Property(x => x.Comment)
                .HasColumnName("Comment");
            builder.Property(x => x.CLCommentId)
                .HasColumnName("CLCommentID");
            builder.Property(x => x.Modified_On)
                .HasColumnName("CLModifiedOn");
            builder.HasOne(x => x.Job)
              .WithMany()
              .HasForeignKey(x => x.JobMasterId)
              .IsRequired();
        }
    }
}
