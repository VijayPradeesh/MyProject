namespace CustomerPortal.Services.Repositories.ErrorLogging
{
    public interface IErrorLoggingRepo
    {
        Task AddErrorLogging(string StatusCode, string ControllerName,  string InnerMessage, string stacktrace, string Message);
    }
}
