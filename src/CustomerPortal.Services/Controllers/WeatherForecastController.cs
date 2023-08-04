using CustomerPortal.Services.Services.ErrorLogging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CustomerPortal.Services.Controllers
{
    [ApiController]
    
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

        private readonly ILogger<WeatherForecastController> _logger;
        private readonly IErrorLogging ErrorLogging;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, IErrorLogging errorLogging)
        {
            _logger = logger;
            ErrorLogging = errorLogging;
        }

        [HttpGet(Name = "GetWeatherForecast")]
        [AllowAnonymous]
        // Supervisor
        public async Task<ActionResult> Get()
        {
            try
            {
                // return Ok("works");
                NotImplementedException();
                return Ok();
            }catch(Exception ex)
            {
                // ex.Message, ex.InnerException, ex.StackTrace,
                var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                await ErrorLogging.AddErrorLogging("500", controllerName, innerException,ex, ex.Message.ToString());
                return StatusCode(500,  ex.Message);
            }
            // var id = Convert.ToInt32(HttpContext.User.FindFirst("UserId").Value);
            //return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            //{
            //    Date = DateTime.Now.AddDays(index),
            //    TemperatureC = Random.Shared.Next(-20, 55),
            //    Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            //})
            //.ToArray();
        }

        private void NotImplementedException()
        {
            throw new NotImplementedException();
        }
    }
}