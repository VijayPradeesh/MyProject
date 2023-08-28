using CustomerPortal.Services.Core.ApplicationDbContext;
using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.LookUp;
using Microsoft.EntityFrameworkCore;

namespace CustomerPortal.Services.Repositories.LookUpRepo
{
    public class LookUpRepo : ILookUpRepo
    {
        public LookUpRepo(CustomerPortalDbContext dbContext)
        {
            DbContext = dbContext;
        }
        private CustomerPortalDbContext DbContext { get; }


        public async Task<List<RoleType>> GetAllRoles()
        {
            try
            {
                var roles = await DbContext.UserType.Join(DbContext.UserRole, type => type.Id, role => role.UserTypeId, (type, role) => new RolesDto
                {
                    RoleId = role.Id,
                    UserTypeId = type.Id,
                    UserRole = role.UserRole,
                    UserType = type.UserType
                }).ToListAsync();
                 var dat = roles.GroupBy(x =>new { x.UserTypeId, x.UserType }).Select(s=>new RoleType
                 {
                    TypeId = s.Key.UserTypeId,
                    UserType = s.Key.UserType,
                    roles = s.Select(d=> new Roles
                    {
                       RoleId = d.RoleId,
                       RoleName = d.UserRole
                    }).ToList()
                 }).ToList();
                return dat;

            }catch(Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }

        public async Task<List<UsersDto>> GetAllUsers(int Id)
        {
             var Role = await DbContext.Users.Where(x => x.UserId == Id).Join(DbContext.UserRole, user=>user.UserRoleId, role=>role.Id, (user, role) => new 
             {
                 role = role.UserRole
             }).FirstOrDefaultAsync();
            if(Role.role == "Mears-Admin")
            {
                var user = await DbContext.Users.Join(DbContext.UserRole, user=>user.UserRoleId, role=>role.Id, (user, role)=>  new UsersDto
                {
                    Id = user.UserId,
                    UserName = user.UserName,
                    IsActive = user.IsActive,
                    IsCurrentUser = user.UserId == Id ? true : false,
                    RoleId = role.Id,
                    Role = role.UserRole
                }).ToListAsync();
                return user;
            }

            var response = await (from user in DbContext.Users.Where(x => x.UserId == Id)
                               join role in DbContext.UserRole on user.UserRoleId equals role.Id
                               join UserRole in DbContext.UserRole on role.UserTypeId equals UserRole.UserTypeId
                               join User in DbContext.Users on UserRole.Id equals User.UserRoleId
                               select new UsersDto
                               {
                                   Id = User.UserId,
                                   UserName = User.UserName,
                                   IsActive = User.IsActive,
                                   IsCurrentUser = User.UserId == Id ? true : false,
                                   RoleId = UserRole.Id,
                                   Role = UserRole.UserRole
                               }).ToListAsync();

            return response;
        }

        public async Task<List<ModuleUserRole>> GetModuleUserRoles(int Id)
        {
            var response = new List<ModuleUserRole>();
            
                response = await (from user in DbContext.Users.Where(x => x.UserId == Id)
                                      join role in DbContext.UserRole on user.UserRoleId equals role.Id
                                      join UserRole in DbContext.UserRole on role.UserTypeId equals UserRole.UserTypeId
                                      select new ModuleUserRole
                                      {
                                          Id = UserRole.Id,
                                          UserRole = UserRole.UserRole
                                      }).ToListAsync();
            
           
            return response;
        }
    }
}
