using CustomerPortal.Services.Core.ApplicationDbContext;
using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Models;
using Microsoft.EntityFrameworkCore;

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

        public async Task<User> RegisterUser(RegisterDto _userDto, byte[] passwordHash, byte[] passwordSalt)
        {
            var data = await DbContext.Users.Where(x => x.Email.ToLower() == _userDto.Email.ToLower()).FirstOrDefaultAsync();
            if (data != null)
            {
                var user = new User();
                user.passwordSalt = passwordSalt;
                user.PasswordHash = passwordHash;

                return user;
            }
            try
            {
                var _user = new User();
                _user.UserName = _userDto.FirstName + "." + _userDto.LastName;
                _user.FirstName = _userDto.FirstName;
                _user.LastName = _userDto.LastName;
                _user.PasswordHash = passwordHash;
                _user.passwordSalt = passwordSalt;
                _user.Email = _userDto.Email;
                _user.IsLockOut = false;
                _user.LockedOutOn = null;
                _user.AccountCreatedOn = DateTime.Now;
                _user.AccessFailedCount = 0;
                _user.PasswordUpdatedOn = DateTime.Now;
                _user.LastLogin = DateTime.Now;
                _user.IsActive = true;
                _user.LoginFailedOn = null;
                _user.isNewlyGeneratedAccount = true;
                _user.UserRoleId = _userDto.RoleId;
                _user.CreatedBy = 3;
                _user.ModifiedOn = null;
                _user.ModifiedBy = null;
                DbContext.Add(_user);
                DbContext.SaveChanges();
                var passwordHistory = new PasswordHistory();
                passwordHistory.PasswordHash = passwordHash;
                passwordHistory.passwordSalt = passwordSalt;
                passwordHistory.IsActive = true;
                passwordHistory.UserId = _user.UserId;
                passwordHistory.CreatedOn = DateTime.Now;
                DbContext.Add(passwordHistory);
                DbContext.SaveChanges();
                return _user;
            }
            catch(Exception ex) {
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
            if(user!= null && user.IsActive == false)
            {
                return user;
            }

            if(user!= null)
            {
                user.passwordSalt = PasswordSalt;
                user.PasswordHash = PasswordHash;
                user.ModifiedBy = _resetPasswordDto.UserId;
                user.ModifiedOn = DateTime.Now;
                user.IsLockOut = false;
                user.IsActive = true;
                user.AccessFailedCount = 0;
                user.LoginFailedOn = null;
                user.LockedOutOn = null;
                user.isNewlyGeneratedAccount = true;
                DbContext.Update(user);
                var psw = await GetPasswordHistory(_resetPasswordDto.RequestedUserId);
                try
                {
                    
                    if (psw.Count != 0)
                    {
                        foreach (var item in psw)
                        {
                            item.IsActive = false;
                            item.ModifiedOn = DateTime.Now;
                            item.ModifiedBy = _resetPasswordDto.UserId;
                            DbContext.Update(item);
                        }
                    }
                }
                catch(Exception ex)
                {
                    throw new Exception(ex.ToString());
                }
                
                if(psw.Count == 24)
                {
                    var dat = psw.OrderBy(x=>x.CreatedOn).FirstOrDefault();
                    dat.passwordSalt = PasswordSalt;
                    dat.PasswordHash = PasswordHash;
                    dat.CreatedOn = DateTime.Now;
                    dat.CreatedBy = _resetPasswordDto.UserId;
                    dat.UserId = _resetPasswordDto.RequestedUserId;
                    dat.ModifiedOn = DateTime.Now;
                    dat.ModifiedBy = _resetPasswordDto.UserId;
                    dat.IsActive = true;
                    DbContext.Update(dat);  
                }else
                {
                    var passwordHistory = new PasswordHistory();
                    passwordHistory.PasswordHash = PasswordHash;
                    passwordHistory.passwordSalt = PasswordSalt;
                    passwordHistory.IsActive = true;
                    passwordHistory.UserId = _resetPasswordDto.RequestedUserId;
                    passwordHistory.CreatedOn = DateTime.Now;
                    DbContext.Add(passwordHistory);
                }
                await DbContext.SaveChangesAsync();
            }
            return user;
        }

        public async Task UpdateUserAndPasswordHistory(User user,byte[] PasswordSalt, byte[] PasswordHash, int UserId, int? AdminId)
        {
            user.passwordSalt = PasswordSalt;
            user.PasswordHash = PasswordHash;
            user.ModifiedBy = AdminId ?? UserId;
            user.ModifiedOn = DateTime.Now;
            user.IsLockOut = false;
            user.IsActive = true;
            user.AccessFailedCount = 0;
            user.LoginFailedOn = null;
            user.LockedOutOn = null;
            user.isNewlyGeneratedAccount = false;
            DbContext.Update(user);
            var psw = await GetPasswordHistory(UserId);
            try
            {

                if (psw.Count != 0)
                {
                    foreach (var item in psw)
                    {
                        item.IsActive = false;
                        item.ModifiedOn = DateTime.Now;
                        item.ModifiedBy = AdminId ?? UserId;
                        DbContext.Update(item);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }

            if (psw.Count == 24)
            {
                var dat = psw.OrderBy(x => x.CreatedOn).FirstOrDefault();
                dat.passwordSalt = PasswordSalt;
                dat.PasswordHash = PasswordHash;
                dat.CreatedOn = DateTime.Now;
                dat.CreatedBy = AdminId?? UserId;
                dat.UserId = UserId;
                dat.ModifiedOn = DateTime.Now;
                dat.ModifiedBy = AdminId ?? UserId;
                dat.IsActive = true;
                DbContext.Update(dat);
            }
            else if(psw.Count == 0)
            {
                var passwordHistory = new PasswordHistory();
                passwordHistory.PasswordHash = PasswordHash;
                passwordHistory.passwordSalt = PasswordSalt;
                passwordHistory.IsActive = true;
                passwordHistory.UserId = UserId;
                passwordHistory.CreatedOn = DateTime.Now;
                passwordHistory.CreatedBy = UserId;
                DbContext.Add(passwordHistory);
            }
            else
            {
                var passwordHistory = new PasswordHistory();
                passwordHistory.PasswordHash = PasswordHash;
                passwordHistory.passwordSalt = PasswordSalt;
                passwordHistory.IsActive = true;
                passwordHistory.UserId = UserId;
                passwordHistory.CreatedOn = DateTime.Now;
                DbContext.Add(passwordHistory);
            }
             DbContext.SaveChanges();
        }
        public async Task<User> GetUser(string Email)
        {
            var user = await DbContext.Users.Where(x => x.Email.ToLower() == Email.ToLower()).FirstOrDefaultAsync();
            return user;
        }

        public async Task<List<PasswordHistory>> GetPasswordHistory(int userId)
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
                    user.AccessFailedCount = 0;
                }
                
            }else
            {
                if(user.LoginFailedOn == null)
                {
                    user.LoginFailedOn = DateTime.Now;
                    user.AccessFailedCount = user.AccessFailedCount + 1;
                }
                else
                {
                    TimeSpan xx = (TimeSpan)(DateTime.Now - user.LoginFailedOn);
                    if (xx.TotalHours < 6 &&  user.AccessFailedCount <= 15)
                    {
                        user.IsLockOut = false;
                        user.AccessFailedCount = user.AccessFailedCount + 1;
                    }
                    else if (xx.TotalHours < 6 && user.AccessFailedCount >= 16)
                    {
                        // user.AccessFailedCount = user.AccessFailedCount + 1;
                        user.IsLockOut = true;

                        // user.AccessFailedCount = 0;
                        fl = "locked";
                    }
                }
                
                
            }
            
            DbContext.Update(user);
            DbContext.SaveChanges();
            return fl;
        }

        public async Task<string> GetRole(int UserId)
        {
            var user = await DbContext.Users.Where(x=>x.UserId == UserId).Join(DbContext.UserRole,user=>user.UserRoleId, userRole=>userRole.Id, (user,userRole)=> new Role
            {
                role = userRole.UserRole
            }).FirstOrDefaultAsync();
            return user.role;
        }
    }
}
