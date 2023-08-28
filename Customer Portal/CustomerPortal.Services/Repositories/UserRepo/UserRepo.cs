using CustomerPortal.Services.Core.ApplicationDbContext;
using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Models;
using CustomerPortal.Services.Core.Responses.AccountUser;
using Microsoft.EntityFrameworkCore;

namespace CustomerPortal.Services.Repositories.UserRepo
{
    public class UserRepo : IUserRepo
    {
        public UserRepo(CustomerPortalDbContext dbContext)
        {
            DbContext = dbContext;
        }

        public CustomerPortalDbContext DbContext { get; }

        public async Task<EditUserResponse> EditUserData(EditUserDto _editUserDto, EditUserResponse response)
        {
            try
            {
                var user = await DbContext.Users.Where(x => x.UserId == _editUserDto.UserId).FirstOrDefaultAsync();
                if(user == null)
                {
                    response.status = false;
                    response.message = "Invalid User";
                    return response;
                }
                user.Email = _editUserDto.Email;
                user.IsActive = _editUserDto.IsActive;
                // user.UserRoleId = _editUserDto.RoleId;
                user.ModifiedBy = _editUserDto.CurrentUserId;
                user.ModifiedOn = DateTime.Now;
                DbContext.Update(user);
                DbContext.SaveChanges();
                response.status = true;
                response.message = "Data changed successfully";
                return response;
            }catch(Exception ex)
            {
                response.status = false;
                response.message = ex.Message;
                return response;
            }
            
        }
    }
}
