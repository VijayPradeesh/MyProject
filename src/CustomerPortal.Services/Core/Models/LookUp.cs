using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace CustomerPortal.Services.Core.Models
{
    public class LookUp
    {
        public long Id { get; set; }
        public string Type { get; set; }
        public string Value { get; set; }
        public string Text { get; set; }
        public string? Description { get; set; }
        public int? SortOrder { get; set; }
        public long? AddedBy { get; set; }
        public DateTime AddedDate { get; set; }
        public long? ChangedBy { get; set; }
        public DateTime? ChangedDate { get; set; }
        public bool IsActive { get; set; }
    }

    public class LookUpConfiguration: IEntityTypeConfiguration<LookUp>
    {
        public void Configure(EntityTypeBuilder<LookUp> builder)
        {
            builder.ToTable("Lookup_T");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id)
                .HasColumnName("ID");
            builder.Property(x => x.Type)
                .HasColumnName("Type");
            builder.Property(x => x.Value)
                .HasColumnName("Value");
            builder.Property(x => x.Text)
                .HasColumnName("Text");
            builder.Property(x => x.Description)
                .HasColumnName("Description");
            builder.Property(x => x.SortOrder)
                .HasColumnName("SortOrder");
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



        }
    }
}
