namespace CustomerPortal.Services.Services.ErrorLogging
{
    public interface IErrorLogging
    {
        Task AddErrorLogging(string StatusCode, string ControllerName, string InnerMessage, Exception  exception, string Message);
    }
}
