using CustomerPortal.Services.Services.ErrorLogging;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace CustomerPortal.Services.Controllers.Helper
{
    public class CentralHelper: ICentralHelper
    {
        public CentralHelper(IErrorLogging errorLogging)
        {
            ErrorLogging = errorLogging;
        }

        public IErrorLogging ErrorLogging { get; }

        public async void ErrorLog(Exception ex, string ControllerName)
        {
            var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
            StackTrace st = new StackTrace(ex, true);
            StackFrame frame = st.GetFrame(0);
            string fileName = frame.GetFileName();

            //Get the method name
            string methodName = frame.GetMethod().Name;

            //Get the line number from the stack frame
            int line = frame.GetFileLineNumber();

            //Get the column number
            int col = frame.GetFileColumnNumber();
            string sss = fileName.ToString() + "-" + methodName.ToString() + "-" + line + "-" + col;
            await ErrorLogging.AddErrorLogging("500", ControllerName, innerException,ex, ex.Message.ToString());
        }
    }
}
