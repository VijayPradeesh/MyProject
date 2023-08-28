using CustomerPortal.Services.Core.ApplicationDbContext;
using CustomerPortal.Services.Core.Responses.LookUp;
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
        public LookUpController(ILookUp LookUp, CustomerPortalDbContext dbContext)
        {
            lookUp = LookUp;
            DbContext = dbContext;
        }

        public ILookUp lookUp { get; }
        public CustomerPortalDbContext DbContext { get; }

        [Authorize]
        [HttpGet("Roles")]
        public async Task<ActionResult<List<RoleType>>> GetRoles()
        {
            try
            {
                var dat = await lookUp.GetAllRoles();
                return Ok(dat);
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return StatusCode(500, "Internal Server Error");
            }
            // var roles = await DbContext.Users.ToListAsync();
            
        }

        [HttpGet("GetUsers")]
        [Authorize(Roles = "Mears-Admin, Spire-Admin")]
        public async Task<ActionResult> GetAllUsers()
        {
            var id = Convert.ToInt32(HttpContext.User.FindFirst("UserId").Value);
            var response = await lookUp.GetAllUsers(id);
            return Ok(response);
        }

        [HttpGet("GetModuleRoles/{Id}")]
        [Authorize(Roles= "Mears-Admin, Spire-Admin")]
        public async Task<ActionResult> getModuleRoles(int Id)
        {
            try
            {
                var response = await lookUp.GetModuleUserRoles(Id);
                return Ok(response);
            }catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return StatusCode(500, "Internal Server Error");
            }
           
        }

    }
}
