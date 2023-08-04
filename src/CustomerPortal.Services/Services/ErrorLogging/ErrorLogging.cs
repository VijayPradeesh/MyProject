using CustomerPortal.Services.Repositories.ErrorLogging;
using System.Diagnostics;

namespace CustomerPortal.Services.Services.ErrorLogging
{
    public class ErrorLogging : IErrorLogging
    {
        public ErrorLogging(IErrorLoggingRepo errorLoginRepo)
        {
            ErrorLoginRepo = errorLoginRepo;
        }

        public IErrorLoggingRepo ErrorLoginRepo { get; }

        public async Task AddErrorLogging(string StatusCode, string? ControllerName, string? InnerMessage, Exception exception, string? Message)
        {
            Message = Message.Length > 1000 ? Message.Substring(0, 1000) : Message;
            InnerMessage = InnerMessage.Length > 1000 ? InnerMessage.Substring(0, 1000) : InnerMessage;
            StackTrace st = new StackTrace(exception, true);
            StackFrame frame = st.GetFrame(0);
            string sss = "";
            if (frame != null)
            {
                string fileName = frame.GetFileName();

                //Get the method name
                string methodName = frame.GetMethod().Name;

                //Get the line number from the stack frame
                int line = frame.GetFileLineNumber();

                //Get the column number
                int col = frame.GetFileColumnNumber();
                Message = Message.Length > 1000 ? Message.Substring(0, 1000) : Message;
                sss = fileName != null ? fileName.ToString() : "" + "-" + methodName != null ? methodName.ToString() : "" + "-" + "line: " + line + "-" + "column: " + col;
            }
            
            await ErrorLoginRepo.AddErrorLogging(StatusCode, ControllerName, InnerMessage, sss, Message);
        }
    }
}
