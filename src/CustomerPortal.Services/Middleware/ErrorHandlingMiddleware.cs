using CustomerPortal.Services.Services;
using CustomerPortal.Services.Services.ErrorLogging;
using Microsoft.AspNetCore.Mvc;
//using Newtonsoft.Json;
using System.Net;

namespace CustomerPortal.Services.Middleware
{
    public class ErrorHandlingMiddleware
    {
        public readonly RequestDelegate _next;

      

        public ErrorHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
           
        }

        public async Task Invoke(HttpContext context, IErrorLogging ErrorLogging)
        {
            try
            {
                await _next(context);
                //return "Success";
            }
            catch(Exception ex)
            {
                //await HandleExceptionAsync(context, ex, ErrorLogging);
                //return "Internal Server error";
            }
        }

        //public static async Task<Task> HandleExceptionAsync(HttpContext context , Exception ex, IErrorLogging errorLogging)
        //{
        //    //var code = HttpStatusCode.InternalServerError;
        //    //var result =JsonConvert.SerializeObject(new {error=ex.Message});

        //    //context.Response.ContentType = "application/json";
        //    //context.Response.StatusCode = (int)code;
        //    ////var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
        //    //var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
        //    ////await .AddErrorLogging("500", "", innerException, ex, ex.Message.ToString());
        //    //await errorLogging.AddErrorLogging("500", "", innerException, ex, ex.Message.ToString());
        //    ////return StatusCode(500, ErrorMessages.ServerError);
        //    //return  context.Response.WriteAsync(result);
            
        //}
    }
}
