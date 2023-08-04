using CustomerPortal.Services.Controllers.Helper;
using CustomerPortal.Services.Core.ApplicationDbContext;
using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.LookUp;
using CustomerPortal.Services.Services.ErrorLogging;
using CustomerPortal.Services.Services.LookUp;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CustomerPortal.Services.Controllers
{
    [Route("customerPortal/[controller]")]
    [ApiController]
    public class LookUpController : ControllerBase
    {
        public LookUpController(ILookUp LookUp, CustomerPortalDbContext dbContext, IErrorLogging errorLogging, ICentralHelper Centralhelper)
        {
            lookUp = LookUp;
            DbContext = dbContext;
            ErrorLogging = errorLogging;
            this.Centralhelper = Centralhelper;
        }

        public ILookUp lookUp { get; }
        public CustomerPortalDbContext DbContext { get; }
        public IErrorLogging ErrorLogging { get; }
        public ICentralHelper Centralhelper { get; }

        [Authorize]
        [HttpGet("Roles")]
        public async Task<ActionResult<List<RoleType>>> GetRoles()
        {
            try
            {
#pragma warning disable CS8602 // Dereference of a possibly null reference.
                var id = Convert.ToInt64(HttpContext.User.FindFirst("UserId").Value ?? "0");
#pragma warning restore CS8602 // Dereference of a possibly null reference.
                if (id == 0)
                {
                    return BadRequest();
                }
                var dat = await lookUp.GetAllRoles(id);
                return Ok(dat);
            }
            catch(Exception ex)
            {
                var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                await ErrorLogging.AddErrorLogging("500", controllerName, innerException, ex, ex.Message.ToString());
                return StatusCode(500, ErrorMessages.ServerError);
            }
            // var roles = await DbContext.Users.ToListAsync();
            
        }

        [HttpPost("GetUsers")]
        [Authorize]
        public async Task<ActionResult> GetAllUsers(GetUsersDto _getUsersDto)
        {
            try
            {
#pragma warning disable CS8602 // Dereference of a possibly null reference.
                var id = Convert.ToInt64(HttpContext.User.FindFirst("UserId").Value ?? "0");
#pragma warning restore CS8602 // Dereference of a possibly null reference.
                if (id == 0)
                {
                    return BadRequest();
                }
                var response = await lookUp.GetAllUsers(id, _getUsersDto);
                return Ok(response);
            }catch(Exception ex)
            {
                var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                await ErrorLogging.AddErrorLogging("500", controllerName, innerException, ex, ex.Message.ToString());
                return StatusCode(500, ErrorMessages.ServerError);
            }

        }

        [HttpGet("GetUser")]
        [Authorize]
        public async Task<ActionResult> GetUser()
        {
            try
            {
                var userId = Convert.ToInt64(HttpContext.User.FindFirst("UserId")?.Value ?? "0");
                if (userId == 0)
                {
                    return BadRequest();
                }
                var response = await lookUp.GetUser(userId); 
                return Ok(response);
            }
            catch(Exception ex)
            {
                var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                await ErrorLogging.AddErrorLogging("500", controllerName, innerException, ex, ex.Message.ToString());
                return StatusCode(500, ErrorMessages.ServerError);
            }
           

        }

        [HttpGet("GetModuleRoles/{Id}")]
        [Authorize]
        public async Task<ActionResult> getModuleRoles(int Id)
        {
            try
            {
                var response = await lookUp.GetModuleUserRoles(Id);
                return Ok(response);
            }catch(Exception ex)
            {
                var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                await ErrorLogging.AddErrorLogging("500", controllerName, innerException, ex, ex.Message.ToString());
                return StatusCode(500, ErrorMessages.ServerError);
            }
           
        }

        [HttpGet("GetTypes")]
        [Authorize]
        public async Task<ActionResult> GetTypes()
        {
            try
            {
                var response = await lookUp.GetUserTypeList();
                return Ok(response);
            }catch(Exception ex)
            {
                var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                await ErrorLogging.AddErrorLogging("500", controllerName, innerException, ex, ex.Message.ToString());
                return StatusCode(500, ErrorMessages.ServerError);
            }
            
        }

        [HttpGet("GetRegions")]
        [Authorize]
        public async Task<ActionResult> GetRegions()
        {
            try
            {
                var id = Convert.ToInt64(HttpContext.User.FindFirst("UserId").Value ?? "0");
                var response = await lookUp.GetRegions(id);
                return Ok(response);
            }
            catch(Exception ex)
            {
                var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                await ErrorLogging.AddErrorLogging("500", controllerName, innerException, ex, ex.Message.ToString());
                return StatusCode(500, ErrorMessages.ServerError);
            }
            
        }

        [HttpGet("GetDropDownData")]
        [Authorize]
        public async Task<ActionResult> GetDropDownValues()
        {
            try
            {
                var id = Convert.ToInt64(HttpContext.User.FindFirst("UserId").Value ?? "0");
                var response = await lookUp.GetDropDownValues(id);
                return Ok(response);
            }
            catch(Exception ex)
            {
                var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                await ErrorLogging.AddErrorLogging("500", controllerName, innerException, ex, ex.Message.ToString());
                return StatusCode(500, ErrorMessages.ServerError);
            }
            
        }

    }
}
