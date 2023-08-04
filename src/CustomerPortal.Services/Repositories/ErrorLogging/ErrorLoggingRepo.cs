using CustomerPortal.Services.Core;
using CustomerPortal.Services.Core.ApplicationDbContext;
using CustomerPortal.Services.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace CustomerPortal.Services.Repositories.ErrorLogging
{
    public class ErrorLoggingRepo: IErrorLoggingRepo
    {
        public ErrorLoggingRepo(CustomerPortalDbContext dbContext)
        {
            DbContext = dbContext;
        }

        public CustomerPortalDbContext DbContext { get; }

        public async Task AddErrorLogging(string StatusCode, string? ControllerName, string? InnerMessage, string  stacktrace, string? Message)
        {
            var obj = Configuration.GetInstance();
            var optionsBuilder = new DbContextOptionsBuilder<CustomerPortalDbContext>();
            optionsBuilder.UseSqlServer(obj.GetConnectionString());
            CustomerPortalDbContext dbContext = new CustomerPortalDbContext(optionsBuilder.Options);
            var errorLogging = new Error_Logging
            {
                StatusCode = StatusCode,
                ControllerName = ControllerName,
                ExceptionMessage = Message,
                StackTrace = stacktrace,
                InnerMessage = InnerMessage,
                ExceptionDate = DateTime.Now
            };
            // dbContext.ChangeTracker.Clear();
            dbContext.Add(errorLogging);
            dbContext.SaveChanges();
        }
    }
}
