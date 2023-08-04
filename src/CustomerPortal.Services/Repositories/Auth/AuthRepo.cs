using CustomerPortal.Services.Core.ApplicationDbContext;
using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Models;
using CustomerPortal.Services.Core.Responses.Auth;
using CustomerPortal.Services.Core.Responses.Configurations;
using Microsoft.EntityFrameworkCore;
using static CustomerPortal.Services.Controllers.AuthController;

namespace CustomerPortal.Services.Repositories.Auth
{
    public class AuthRepo: IAuthRepo
    {
        public AuthRepo(CustomerPortalDbContext dbContext)
        {
            DbContext = dbContext;
        }

        public class Role
        {
            public string role { get; set; }
        }

        private CustomerPortalDbContext DbContext { get; }

        public async Task<RegisterResponse> RegisterUser(RegisterDto _userDto, byte[] passwordHash, byte[] passwordSalt, RegisterResponse response)
        {
            response.Status = true;
            var data = await DbContext.Users.Where(x => x.Email.ToLower() == _userDto.Email.ToLower()).FirstOrDefaultAsync();
            // var user = new RegisterResponse();
            if (data != null)
            {
                response.Status = false;
                response.UserNameTaken = true;
                response.Message = "Username Already taken";
                return response;
            }
            var _user = new User();
            try
            {
                var TypeRole = await DbContext.RoleTypeMapping.Where(x => x.RoleId == _userDto.RoleId && x.TypeId == _userDto.OrganisationId && x.IsActive == true).FirstOrDefaultAsync();
                if(TypeRole == null)
                {
                    response.Status = false;
                    response.TypeRoleNotFound = true;
                    response.Message = "Invalid Organisation or Role";
                    return response;
                }
                if (_userDto.Region.Count == 0)
                {
                    response.Status = false;
                    // response.TypeRoleNotFound = true;
                    response.Message = "No Regions Found";
                    return response;
                }
                // editProfile.FirstName + "." + string.Join("", editProfile.LastName.Split(" ")).ToString();
                _user.UserName = _userDto.FirstName + "." +  string.Join("", _userDto.LastName.Split(" ")).ToString(); ;
                _user.FirstName = _userDto.FirstName;
                _user.LastName = _userDto.LastName;
                _user.Email = _userDto.Email;
                _user.IsLockOut = false;
                _user.LockedOutOn = null;
                _user.AccountCreatedOn = DateTime.Now;
                _user.AccessFailedCount = 0;
                _user.PasswordUpdatedOn = DateTime.Now;
                // _user.LastLogin = DateTime.Now;
                _user.IsActive = true;
                _user.LoginFailedOn = null;
                _user.isNewlyGeneratedAccount = true;
                _user.CreatedBy = _userDto.AdminId;
                _user.ModifiedOn = null;
                _user.ModifiedBy = null;
                _user.ForgetPassword = false;
                DbContext.Add(_user);
                DbContext.SaveChanges();
                var passwordHistory = new PasswordHistory();
                passwordHistory.PasswordHash = passwordHash;
                passwordHistory.passwordSalt = passwordSalt;
                passwordHistory.IsPasswordActive = true;
                passwordHistory.UserId = _user.UserId;
                passwordHistory.CreatedOn = DateTime.Now;
                passwordHistory.AddedBy = _userDto.AdminId;
                DbContext.Add(passwordHistory);
              
                foreach(var item in _userDto.Region)
                {
                    var userRoleRegionMapping = new User_Role_Region_Mapping();
                    userRoleRegionMapping.UserId = _user.UserId;
                    userRoleRegionMapping.TypeRoleId = TypeRole.Id;
                    userRoleRegionMapping.RegionId = item.Id;
                    userRoleRegionMapping.AddedDate = DateTime.Now;
                    userRoleRegionMapping.AddedBy = _userDto.AdminId;
                    userRoleRegionMapping.IsActive = true;
                    userRoleRegionMapping.ChangedOn = null;
                    DbContext.Add(userRoleRegionMapping);
                }
                DbContext.SaveChanges();
                response.UserId = _user.UserId;
                return response;
            }
            catch(Exception ex) {
                DbContext.Remove(_user);
                DbContext.SaveChanges();
                throw new Exception(ex.ToString());
            }
        }

        public async Task<User> ResetPassword(ResetPasswordDto _resetPasswordDto, byte[] PasswordSalt, byte[] PasswordHash )
        {
            var user = await DbContext.Users.Where(x => x.UserId == _resetPasswordDto.RequestedUserId).FirstOrDefaultAsync();
            if(user != null &&user.IsLockOut == true)
            {
                return user;
            }
            //if (user != null && user.ForgetPassword == false)
            //{
            //    return user;
            //}
            if (user!= null && user.IsActive == false)
            {
                return user;
            }

            if(user!= null)
            {
                
                user.ModifiedBy = _resetPasswordDto.UserId;
                user.ModifiedOn = DateTime.Now;
                user.IsLockOut = false;
                user.IsActive = true;
                user.AccessFailedCount = 0;
                user.LoginFailedOn = null;
                user.LockedOutOn = null;
                user.isNewlyGeneratedAccount = true;
                user.PasswordUpdatedOn = DateTime.Now;
                user.ForgetPassword = false;
                DbContext.Update(user);
                var psw = await GetPasswordHistory(_resetPasswordDto.RequestedUserId);
                
                    
                if (psw.Count != 0)
                {
                  foreach (var item in psw)
                  {
                    item.IsPasswordActive = false;
                    DbContext.Update(item);
                  }
                }
                
                
                if(psw.Count == 24)
                {
                    var dat = psw.OrderBy(x=>x.CreatedOn).FirstOrDefault();
                    dat.passwordSalt = PasswordSalt;
                    dat.PasswordHash = PasswordHash;
                    dat.CreatedOn = DateTime.Now;
                   
                    dat.UserId = _resetPasswordDto.RequestedUserId;
                   
                    dat.IsPasswordActive = true;
                    DbContext.Update(dat);  
                }else
                {
                    var passwordHistory = new PasswordHistory();
                    passwordHistory.PasswordHash = PasswordHash;
                    passwordHistory.passwordSalt = PasswordSalt;
                    passwordHistory.IsPasswordActive = true;
                    passwordHistory.UserId = _resetPasswordDto.RequestedUserId;
                    passwordHistory.CreatedOn = DateTime.Now;
                    passwordHistory.AddedBy = _resetPasswordDto.UserId;
                    DbContext.Add(passwordHistory);
                }
                await DbContext.SaveChangesAsync();
            }
            // user.ForgetPassword = true;
            return user;
        }

        public async Task UpdateUserAndPasswordHistory(User user,byte[] PasswordSalt, byte[] PasswordHash, long UserId, long? AdminId)
        {
            
            user.ModifiedBy = AdminId ?? UserId;
            user.ModifiedOn = DateTime.Now;
            user.IsLockOut = false;
            user.IsActive = true;
            user.AccessFailedCount = 0;
            user.LoginFailedOn = null;
            user.LockedOutOn = null;
            user.isNewlyGeneratedAccount = false;
            user.ForgetPassword = false;
            user.PasswordUpdatedOn = DateTime.Now;
            DbContext.Update(user);
            var psw = await GetPasswordHistory(UserId);

                if (psw.Count != 0)
                {
                    foreach (var item in psw)
                    {
                        item.IsPasswordActive = false;
                        DbContext.Update(item);
                    }
                }
           

            if (psw.Count == 24)
            {
                var dat = psw.OrderBy(x => x.CreatedOn).FirstOrDefault();
                dat.passwordSalt = PasswordSalt;
                dat.PasswordHash = PasswordHash;
                dat.CreatedOn = DateTime.Now;
                dat.UserId = UserId;
                dat.AddedBy = UserId;
                dat.IsPasswordActive = true;
                // user.PasswordUpdatedOn = DateTime.Now;
                DbContext.Update(dat);
            }
            else if(psw.Count == 0)
            {
                var passwordHistory = new PasswordHistory();
                passwordHistory.PasswordHash = PasswordHash;
                passwordHistory.passwordSalt = PasswordSalt;
                passwordHistory.IsPasswordActive = true;
                passwordHistory.UserId = UserId;
                passwordHistory.AddedBy = UserId;
                passwordHistory.CreatedOn = DateTime.Now;
                DbContext.Add(passwordHistory);
            }
            else
            {
                var passwordHistory = new PasswordHistory();
                passwordHistory.PasswordHash = PasswordHash;
                passwordHistory.passwordSalt = PasswordSalt;
                passwordHistory.IsPasswordActive = true;
                passwordHistory.UserId = UserId;
                passwordHistory.AddedBy = UserId;
                passwordHistory.CreatedOn = DateTime.Now;
                DbContext.Add(passwordHistory);
            }
            DbContext.SaveChanges();
        }
        public async Task<UserDataDto?> GetUser(string Email)
        {
            var user = await DbContext.Users.Where(x => x.Email.ToLower() == Email.ToLower()).Join(DbContext.PasswordHistory, user=>user.UserId, password=>password.UserId, (user,password)=>new UserDataDto
            {
               UserId = user.UserId,
               isNewlyGeneratedAccount = user.isNewlyGeneratedAccount,
               UserName = user.UserName,
               FirstName = user.FirstName,
               LastName = user.LastName,
               Email = user.Email,
               IsLockOut = user.IsLockOut,
               passwordHash = password.PasswordHash,
               passwordSalt = password.passwordSalt,
               IsPasswordActive = password.IsPasswordActive,
               PasswordUpdatedOn = user.PasswordUpdatedOn,
               AccessFailedCount = user.AccessFailedCount,
               AccountCreatedOn = user.AccountCreatedOn,
               LastLogin = user.LastLogin,
               LoginFailedOn = user.LoginFailedOn,
               LockedOutOn = user.LockedOutOn,
               ModifiedBy = user.ModifiedBy,
               ModifiedOn = user.ModifiedOn,
               CreatedBy = user.CreatedBy,
               IsActive = user.IsActive,
               ForgetPassword = user.ForgetPassword,
               Signature = user.Signature
               
            }).Where(x=>x.IsPasswordActive == true).FirstOrDefaultAsync();
            return user;
        }

        public async Task<List<PasswordHistory>> GetPasswordHistory(long userId)
        {
            return await DbContext.PasswordHistory.Where(x => x.UserId == userId).ToListAsync();
        }

        public async Task<string> UpdateLoginData(LoginDto _loginDto, string flag)
        {
            var fl = "";
            var user = await GetUser(_loginDto.Email);
            if(flag == "success")
            {
                TimeSpan yy = (TimeSpan)(DateTime.Now - user.PasswordUpdatedOn);
                if(yy.TotalDays >= 90)
                {
                    fl = "expired";
                }else
                {
                    user.LastLogin = DateTime.Now;
                    user.LoginFailedOn = null;
                    user.IsLockOut = false;
                    user.ForgetPassword = false;
                    user.AccessFailedCount = 0;
                }
                
            }else
            {
                user.ForgetPassword = false;
                if (user.LoginFailedOn == null)
                {
                    user.LoginFailedOn = DateTime.Now;
                    user.AccessFailedCount = user.AccessFailedCount + 1;
                    user.ForgetPassword = false;
                }
                else
                {
                    TimeSpan xx = (TimeSpan)(DateTime.Now - user.LoginFailedOn);
                    if (xx.TotalHours < 6 &&  user.AccessFailedCount < 15)
                    {
                        user.IsLockOut = false;
                        user.AccessFailedCount = user.AccessFailedCount + 1;
                    }
                    else if (xx.TotalHours < 6 && user.AccessFailedCount == 15)
                    {
                        user.IsLockOut = true;
                        user.AccessFailedCount = user.AccessFailedCount + 1;
                        user.LockedOutOn = DateTime.Now;
                        fl = "locked";
                    }
                    else if (xx.TotalHours < 6 && user.AccessFailedCount >= 16)
                    {
                        // user.AccessFailedCount = user.AccessFailedCount + 1;
                        user.IsLockOut = true;
                        user.LockedOutOn = DateTime.Now;
                        // user.AccessFailedCount = 0;
                        fl = "locked";
                    }
                }
                
                
            }
            
            DbContext.Update(user);
            DbContext.SaveChanges();
            return fl;
        }

        public async Task<List<UserRolesDto>> GetRole(long UserId)
        {
            // return "";
            // return  new List<UserRolesDto>();
            //var role = await (from user in DbContext.Users.Where(x => x.UserId == UserId)
            //                  join userRoleRegion in DbContext.UserRoleRegion on user.UserId equals userRoleRegion.UserId
            //                  join lookUp in DbContext.RoleTypeMapping on userRoleRegion.TypeRoleId equals lookUp.Id
            //                  join lookup1 in DbContext.LookUp on userRoleRegion.RegionId equals lookup1.Id
            //                  join lookup2 in DbContext.LookUp on userRoleRegion.TypeId equals lookup2.Id
            //                  where userRoleRegion.IsActive == true
            //                  select new UserRolesDto
            //                  {
            //                      Type = lookup2.Value,
            //                      Role = lookUp.Value,
            //                      Region = lookup1.Value,
            //                  }).ToListAsync();
            var role = await (from userRoleRegion in DbContext.UserRoleRegion.Where(x => x.UserId == UserId && x.IsActive == true)
                              join typeRole in DbContext.RoleTypeMapping on userRoleRegion.TypeRoleId equals typeRole.Id
                              join lookup in DbContext.LookUp on typeRole.RoleId equals lookup.Id
                              join lookup1 in DbContext.LookUp on userRoleRegion.RegionId equals lookup1.Id
                              join lookup2 in DbContext.LookUp on typeRole.TypeId equals lookup2.Id
                              select new UserRolesDto
                              {
                                  Type = lookup2.Value,
                                  TypeId = lookup2.Id,
                                  Role = lookup.Value,
                                  RoleId = lookup.Id,
                                  Region = lookup1.Value
                              }).ToListAsync();
            return role;
        }

        public async Task<List<Screens>> GetAllScreens(long OrganizationId, long RoleId)
        {
            var data  =  await (from lkp in DbContext.LookUp.Where(x => x.IsActive == true && x.Type.ToLower().Trim() == "screens")
                          from df in DbContext.RoleTypeMapping.Where(x => x.IsActive == true && x.TypeId == OrganizationId && x.RoleId == RoleId).DefaultIfEmpty()
                          from gh in DbContext.TypeRoleScreenMapping.Where(x => x.IsActive == true && x.TypeRoleId == df.Id && x.Screenid == lkp.Id).DefaultIfEmpty()
                          select new Screens
                          {
                              Id = lkp.Id,
                              Screen = lkp.Value,
                              IsAssigned = gh == null ? false : true
                          }
                          ).ToListAsync();
            return data.Where(x => x.IsAssigned == true).ToList();
        }
    }
}
