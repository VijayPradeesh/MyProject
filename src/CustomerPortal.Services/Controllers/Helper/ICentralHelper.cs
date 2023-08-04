namespace CustomerPortal.Services.Controllers.Helper
{
    public interface ICentralHelper
    {
        void ErrorLog(Exception ex, string ControllerName);
    }
}
