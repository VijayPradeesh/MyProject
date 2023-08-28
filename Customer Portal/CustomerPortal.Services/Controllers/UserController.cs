using CustomerPortal.Services.Core.ApplicationDbContext;
using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.AccountUser;
using CustomerPortal.Services.Services.UserService;
using CustomerPortal.Services.Validations.AccountUser;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CustomerPortal.Services.Controllers
{
    [Route("customerPortal/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        public UserController(CustomerPortalDbContext dbContext, IUserService userService, IEditUserDataValidations _editUserDataValidations)
        {
            DbContext = dbContext;
            UserService = userService;
            EditUserDataValidations = _editUserDataValidations;
        }

        public CustomerPortalDbContext DbContext { get; }
        public IUserService UserService { get; }
        public IEditUserDataValidations EditUserDataValidations { get; }

        [HttpPost("EditUser")]
        [Authorize(Roles = "Mears-Admin, Spire-Admin")]
        public async Task<ActionResult> EditUserData(EditUserDto _editUserdto)
        {
            _editUserdto.CurrentUserId = Convert.ToInt32(HttpContext.User.FindFirst("UserId").Value);
            var response = new EditUserResponse();
            response = EditUserDataValidations.ValidateUserData(_editUserdto, response);
            if(response.status == false)
            {
                return BadRequest(response);
            }
            response = await UserService.EditUserData(_editUserdto, response);
            if(response.status == false)
            {
                return NotFound(response);
            }
            return Ok(response);
        }

    }
}
