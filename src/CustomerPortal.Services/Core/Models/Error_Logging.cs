using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace CustomerPortal.Services.Core.Models
{
    public class Error_Logging
    {
        public long Id { get; set; }
        public string StatusCode { get; set; }
        public string? ControllerName { get; set; }
        public string? ExceptionMessage { get; set; }
        public string? InnerMessage { get; set; }
        public string? StackTrace { get; set; }
        public DateTime ExceptionDate { get; set; }
    }
    public class ErrorLoggingConfiguration: IEntityTypeConfiguration<Error_Logging>
    {
        public void Configure(EntityTypeBuilder<Error_Logging> builder)
        {
            builder.ToTable("ErrorLogging_T");
            builder.HasKey(x=>x.Id);
            builder.Property(x => x.Id)
                .HasColumnName("ID");
            builder.Property(x => x.StatusCode)
                .HasColumnName("ErrorStatusCode");
            builder.Property(x => x.ControllerName)
                .HasColumnName("ControllerName");
            builder.Property(x => x.ExceptionMessage)
                .HasColumnName("ExceptionMessage");
            builder.Property(x => x.InnerMessage)
                .HasColumnName("ExceptionInnerMessage");
            builder.Property(x => x.StackTrace)
                .HasColumnName("ExceptionStackTrace");
            builder.Property(x => x.ExceptionDate)
                .HasColumnName("ExceptionDate");
        }
    }
}
