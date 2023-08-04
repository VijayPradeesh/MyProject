using CustomerPortal.Services.Core.ApplicationDbContext;
using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Models;
using CustomerPortal.Services.Core.Responses.AccountUser;
using CustomerPortal.Services.Core.Responses.UserResponse;
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
                var user = await DbContext.Users.Where(x => x.UserId == _editUserDto.UserId).FirstOrDefaultAsync();
                var RoleType = await DbContext.RoleTypeMapping.Where(x => x.TypeId == _editUserDto.TypeId && x.RoleId == _editUserDto.RoleId && x.IsActive == true).FirstOrDefaultAsync();
                if (user == null)
                {
                    response.status = false;
                    response.message = ErrorMessages.InvalidUser;
                    return response;
                }
                if(RoleType == null)
                {
                    response.status = false;
                    response.message = ErrorMessages.InvalidRoleOrOrganization;
                    return response;
                }
                await UpdateUserData(_editUserDto, user);
                await UpdateURRDataAsync(_editUserDto);
                DbContext.SaveChanges();
                response.status = true;
                response.message = ErrorMessages.UserDetailsSaved;
                return response;   
        }

        public async Task UpdateUserData(EditUserDto _editUserDto, User user)
        {
            user.Email = _editUserDto.Email.ToLower();
            user.IsActive = _editUserDto.IsActive;
            user.FirstName = _editUserDto.FirstName;
            user.LastName = _editUserDto.LastName;
            user.ForgetPassword = false;
            user.UserName = _editUserDto.FirstName + "." + _editUserDto.LastName;
            // user.UserRoleId = _editUserDto.RoleId;
            user.ModifiedBy = _editUserDto.AdminId;
            user.ModifiedOn = DateTime.Now;
            DbContext.Update(user);
        }
        public async Task UpdateURRDataAsync(EditUserDto _editUserDto)
        {
            var existingData = await DbContext.UserRoleRegion.Where(x => x.UserId == _editUserDto.UserId && x.IsActive == true).ToListAsync();
            var RoleType = await DbContext.RoleTypeMapping.Where(x => x.TypeId == _editUserDto.TypeId && x.RoleId == _editUserDto.RoleId && x.IsActive == true).FirstOrDefaultAsync();
            if (existingData.Count == 0)
            {
                foreach (var region in _editUserDto.Region)
                {
                    var UserRoleRegion = new User_Role_Region_Mapping();
                    UserRoleRegion.UserId = _editUserDto.UserId;
                    UserRoleRegion.TypeRoleId = RoleType.Id;
                    UserRoleRegion.RegionId = region.Id;
                    UserRoleRegion.AddedBy = _editUserDto.AdminId;
                    UserRoleRegion.AddedDate = DateTime.Now;
                    UserRoleRegion.ChangedBy = _editUserDto.AdminId;
                    UserRoleRegion.ChangedOn = DateTime.Now;
                    UserRoleRegion.IsActive = true;
                    DbContext.Add(UserRoleRegion);
                }
            }
            else
            {
                var roleType = await DbContext.RoleTypeMapping.Where(x => x.RoleId == _editUserDto.RoleId && x.TypeId == _editUserDto.TypeId && x.IsActive == true).FirstOrDefaultAsync();
                foreach(var exdata in existingData)
                {
                    var regionId = _editUserDto.Region.Where(x => x.Id == exdata.RegionId).FirstOrDefault();
                    if(!(regionId != null && exdata.UserId == _editUserDto.UserId && exdata.TypeRoleId == roleType.Id))
                    {
                        exdata.IsActive = false;

                        DbContext.Update(exdata);
                    }
                }
                foreach (var region in _editUserDto.Region)
                {
                    var dat = existingData.Where(x => x.UserId == _editUserDto.UserId && x.TypeRoleId == roleType.Id  && x.RegionId == region.Id && x.IsActive == true).FirstOrDefault();
                    if(dat == null)
                    {
                        var UserRoleRegion = new User_Role_Region_Mapping();
                        UserRoleRegion.UserId = _editUserDto.UserId;
                        UserRoleRegion.TypeRoleId = roleType.Id;
                        UserRoleRegion.RegionId = region.Id;
                        UserRoleRegion.AddedBy = _editUserDto.AdminId;
                        UserRoleRegion.AddedDate = DateTime.Now;
                        UserRoleRegion.ChangedBy = _editUserDto.AdminId;
                        UserRoleRegion.ChangedOn = DateTime.Now;
                        UserRoleRegion.IsActive = true;
                        DbContext.Add(UserRoleRegion);
                    }
                }
            }
            DbContext.SaveChanges();
        }
        public async Task<ForgetPasswordResponse> ForgetPassword(string Email, ForgetPasswordResponse response)
        {
            var user = await DbContext.Users.Where(x => x.Email.ToLower() == Email.ToLower() && x.IsActive == true).FirstOrDefaultAsync();
            if(user == null)
            {
                response.Status = false;
                response.Message = ErrorMessages.UserNotFound;
            }else
            {
                user.ForgetPassword = true;
                user.ModifiedOn = DateTime.Now;
                DbContext.Update(user);
                DbContext.SaveChanges();
                response.Status=true;
                response.Message = ErrorMessages.RequestSent;
            }
            return response;
        }

        public async Task<EditProfileResponse> EditProfile(EditProfile editProfile)
        {
            var response = new EditProfileResponse();
            var user = await DbContext.Users.Where(x => x.UserId == editProfile.Id).FirstOrDefaultAsync();
            if(user == null)
            {
                response.status = false;
                response.message = ErrorMessages.UserNotFound;
                return response;
            }
            if(editProfile.flag)
            {
                // var ar = editProfile.LastName.Split(" ");
                // var st = string.Join("", editProfile.LastName.Split(" ")).ToString();
                user.FirstName = editProfile.FirstName;
                user.LastName = editProfile.LastName;
                user.UserName = editProfile.FirstName + "." + string.Join("", editProfile.LastName.Split(" ")).ToString();
            }else
            {
                user.Signature = editProfile.Signature == null || editProfile.Signature == "" ? null : System.Convert.FromBase64String(editProfile.Signature);
            }
            user.ModifiedOn = DateTime.Now;
            user.ModifiedBy = user.UserId;
            DbContext.Update(user);
            DbContext.SaveChanges();
            response.message = ErrorMessages.DataSavedSuccessfully;
            response.status = true;
            return response;
        }
    }
}
