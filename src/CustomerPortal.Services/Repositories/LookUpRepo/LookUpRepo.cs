using CustomerPortal.Services.Core.ApplicationDbContext;
using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.LookUp;
using Microsoft.EntityFrameworkCore;

namespace CustomerPortal.Services.Repositories.LookUpRepo
{
    public class LookUpRepo : ILookUpRepo
    {
        public class region
        {
            public long Id { get; set; }
            public string Region { get; set; }
        }
        public class Type
        {
            public long TypeId { get; set; }
            public string type { get; set; }
            public string Role { get; set; }
        }
        public LookUpRepo(CustomerPortalDbContext dbContext)
        {
            DbContext = dbContext;
        }
        private CustomerPortalDbContext DbContext { get; }


        public async Task<List<RoleType>> GetAllRoles(long Id)
        {
            var Type = await (from urr in DbContext.UserRoleRegion.Where(x => x.UserId == Id && x.IsActive == true)
                              join trm in DbContext.RoleTypeMapping.Where(x=>x.IsActive == true) on urr.TypeRoleId equals trm.Id
                              join lookup in DbContext.LookUp.Where(x=>x.IsActive == true) on trm.TypeId equals lookup.Id
                              join lookup1 in DbContext.LookUp.Where(x=>x.IsActive == true) on trm.RoleId equals lookup1.Id
                              select new
                              {
                                  Type = lookup.Value,
                                  TypeId = trm.TypeId,
                                  Role = lookup1.Value
                              }).FirstOrDefaultAsync();
            var roles = await (from lookUp in DbContext.LookUp.Where(x=>x.IsActive == true)
                                   join trm in DbContext.RoleTypeMapping.Where(x=>x.IsActive == true) on lookUp.Id equals trm.RoleId
                                   join lk1 in DbContext.LookUp.Where(x=>x.IsActive == true) on trm.TypeId equals lk1.Id
                                   select new RolesDto
                                   {
                                       RoleId = lookUp.Id,
                                       UserTypeId = lk1.Id,
                                       UserRole = lookUp.Value,
                                       UserType = lk1.Value
                                   }).ToListAsync();
                var dat = roles.GroupBy(x => new { x.UserTypeId, x.UserType }).Select(s => new RoleType
                {
                    TypeId = s.Key.UserTypeId,
                    UserType = s.Key.UserType,
                    roles = s.Select( d => new Roles
                    {
                        RoleId = d.RoleId,
                        RoleName = d.UserRole,
                        IsScreenAssigned =  IsAssigned(s.Key.UserTypeId, d.RoleId)
                    }).Where(x=>x.IsScreenAssigned == true).ToList()
                }).ToList();
            if (Type != null && Type.Type.ToLower() != "mears")
            {
                dat = dat.Where(x => x.TypeId == Type.TypeId).ToList();
            }
            return dat;
        }

        public  bool IsAssigned(long TypeId, long RoleId)
        {
            var data = (from trm in DbContext.RoleTypeMapping.Where(x => x.RoleId == RoleId && x.TypeId == TypeId) join scr in DbContext.TypeRoleScreenMapping.Where(x => x.IsActive == true) on trm.Id equals scr.TypeRoleId select new { Id = scr.Id }).ToList();
            if(data.Count == 0)
            {
                return false;
            }
            return true;
        }

        public async Task<List<AllUsersDto>> GetAllUsers(long Id, GetUsersDto _getUsersDto)
        {
            var Users =await GetUngroupedUsers(Id);
            var users = Users.GroupBy(x => new { x.Id, x.FirstName, x.LastName, x.Email, x.IsCurrentUser, x.IsActive, x.LastLogin, x.ForgetPassword,  }).Select(y => new AllUsersDto
                {
                    Id = y.Key.Id,
                    FirstName = y.Key.FirstName,
                    LastName = y.Key.LastName,
                    Email = y.Key.Email.ToLower(),
                    LastLogin = y.Key.LastLogin,
                    IsCurrentUser = y.Key.IsCurrentUser,
                    IsActive = y.Key.IsActive,

                    ForgetPassword = y.Key.ForgetPassword ?? false,
                    role = y.Select(z => new Role
                    {
                        Id = z.RoleId,
                        role = z.Role
                    }).DistinctBy(e=>e.Id).ToList(),
                    RoleId = y.Select(z=>z.RoleId).FirstOrDefault(),
                    TypeId = y.Select(c=>c.TypeId).FirstOrDefault(),
                    type = y.Select(s => new Core.Responses.LookUp.Type
                    {
                        Id = s.TypeId,
                        type = s.Type
                    }).DistinctBy(f => f.Id).ToList(),
                    region = y.Select(d => new Region
                    {
                        Id =d.RegionId,
                        regionType = d.Region
                    }).DistinctBy(g => g.Id).ToList()
                }).ToList();
            var usr = FilterUsers(users, _getUsersDto);
            usr = usr.OrderByDescending(x => x.IsCurrentUser).ThenBy(x => x.FirstName).ThenBy(x => x.LastName).ToList();
            return usr.Where(x=>x.IsActive == _getUsersDto.IsActive).ToList(); //new List<AllUsersDto>();
        }

        public List<AllUsersDto> FilterUsers(List<AllUsersDto> users, GetUsersDto getUsersDto)
        {

            var Users = new List<AllUsersDto>();
            if (getUsersDto.searchKey != null && getUsersDto.searchKey != "")
            {
                users = users.Where(x => x.Email.ToLower().Contains(getUsersDto.searchKey.ToLower()) || x.FirstName.ToLower().Contains(getUsersDto.searchKey.ToLower()) || x.LastName.ToLower().Contains(getUsersDto.searchKey.ToLower())).ToList();
                Users.AddRange(users);
            }
            else
            {
                Users.AddRange(users);
            }
            if(getUsersDto.RoleId != null && getUsersDto.RoleId != 0)
            {
                var flag = false;
                foreach(var user in users)
                {
                    flag = false;
                    foreach (var role in user.role)
                    {
                        
                        if(role.Id == getUsersDto.RoleId)
                        {
                            flag = true;
                        }
                    }
                    if(!flag)
                    {
                        Users.Remove(user);
                    }
                }
            }
            if(getUsersDto.RegionId != null && getUsersDto.RegionId != 0)
            {
                var flag = false;
                foreach (var user in users)
                {
                    flag = false;
                    foreach (var region in user.region)
                    {

                        if (region.Id == getUsersDto.RegionId)
                        {
                            flag = true;
                        }
                    }
                    if (!flag)
                    {
                        Users.Remove(user);
                    }
                }
            }
            if(getUsersDto.TypeId != null && getUsersDto.TypeId != 0)
            {
                var flag = false;
                foreach (var user in users)
                {
                    flag = false;
                    foreach (var type in user.type)
                    {

                        if (type.Id == getUsersDto.TypeId)
                        {
                            flag = true;
                        }
                    }
                    if (!flag)
                    {
                        Users.Remove(user);
                    }
                }
            }
            Users = Users.Where(x => x.IsActive == getUsersDto.IsActive).ToList();
            return Users.DistinctBy(x=>x.Id).ToList();
        }
        public async Task<List<UngroupedUsersDto>> GetUngroupedUsers(long Id)
        {
            var Type = await (from urr in DbContext.UserRoleRegion.Where(x => x.UserId == Id && x.IsActive == true)
                              join trm in DbContext.RoleTypeMapping.Where(x=>x.IsActive == true) on urr.TypeRoleId equals trm.Id
                              join lookup in DbContext.LookUp.Where(x=>x.IsActive == true) on trm.TypeId equals lookup.Id
                              join lookup1 in DbContext.LookUp.Where(x=>x.IsActive == true) on trm.RoleId equals lookup1.Id
                              select new
                              {
                                  Type = lookup.Value,
                                  TypeId = trm.TypeId,
                                  Role = lookup1.Value
                              }).FirstOrDefaultAsync();
            var data = new List<UngroupedUsersDto>();
            data = await (from user in DbContext.Users
                          join urr in DbContext.UserRoleRegion.Where(x => x.IsActive == true) on user.UserId equals urr.UserId
                          join trm in DbContext.RoleTypeMapping.Where(x=>x.IsActive == true) on urr.TypeRoleId equals trm.Id
                          join lookUp in DbContext.LookUp.Where(x=>x.IsActive == true) on urr.RegionId equals lookUp.Id
                          join lookUp1 in DbContext.LookUp.Where(x=>x.IsActive == true) on trm.RoleId equals lookUp1.Id
                          join lookup2 in DbContext.LookUp.Where(x=>x.IsActive == true) on trm.TypeId equals lookup2.Id
                          select new UngroupedUsersDto
                          {
                              Id = user.UserId,
                              FirstName = user.FirstName,
                              LastName = user.LastName,
                              Email = user.Email,
                              LastLogin = user.LastLogin,
                              IsActive = user.IsActive,
                              IsCurrentUser = user.UserId == Id,
                              RoleId = lookUp1.Id,
                              Role = lookUp1.Value.ToString(),
                              TypeId = lookup2.Id,
                              Type = lookup2.Value,
                              RegionId = lookUp.Id,
                              Region = lookUp.Value,
                              ForgetPassword = user.ForgetPassword,
                              Signature = user.Signature == null ? null : "data:image/png;base64," + Convert.ToBase64String(user.Signature)
                          }).ToListAsync();
            if (Type != null && Type.Type.ToLower().Trim() != "mears")
            {
                // data = data.Where(x => x.Type.ToLower().Trim() != "mears").ToList();
                var region = await GetAssociatedRegions(Id);
                data = data.Where(x => x.TypeId == Type.TypeId && region.Any(y => y.Id == x.RegionId) && x.Type.ToLower().Trim() != "mears").ToList();
            }else if(Type.Type.ToLower().Trim() == "mears" && Type.Role.ToLower().Trim() != "admin")
            {
                var region = await GetAssociatedRegions(Id);
                data = data.Where(x => region.Any(y => y.Id == x.RegionId)).ToList();
            }
            
            
            //if(Type != null && Type.Type.ToLower() != "mears" && Type.Role.ToLower() == "admin")
            //{
            //    var region = await GetAssociatedRegions(Id);
            //    data = data.Where(x => x.TypeId == Type.TypeId &&region.Any(y=>y.Id == x.RegionId)).ToList();
            //}
            return data;
        }

        public async Task<List<ModuleUserRole>> GetModuleUserRoles(int Id)
        {
            var response = new List<ModuleUserRole>();
            
                //response = await (from user in DbContext.Users.Where(x => x.UserId == Id)
                //                      join role in DbContext.UserRole on user.UserRoleId equals role.Id
                //                      join UserRole in DbContext.UserRole on role.UserTypeId equals UserRole.UserTypeId
                //                      select new ModuleUserRole
                //                      {
                //                          Id = UserRole.Id,
                //                          UserRole = UserRole.UserRole
                //                      }).ToListAsync();
            
           
            return response;
        }

        public async Task<List<UserType>> GetUserTypeList()
        {
            var response = await DbContext.LookUp.Where(x => x.Type.ToLower() == "company" && x.IsActive == true).Select(y => new UserType
            {
                Id = y.Id,
                userType = y.Value }
            ).ToListAsync();
            return response;
        }

        public async Task<List<UserRegion>> GetRegions(long Id)
        {
            var Type = await GetType(Id);
            if (Type != null && Type.type.ToLower() != "mears")
            {
                var region = await (from urr in DbContext.UserRoleRegion.Where(x => x.UserId == Id && x.IsActive == true) 
                                    join lookup in DbContext.LookUp.Where(x=>x.IsActive == true) on urr.RegionId equals lookup.Id
                                    select new
                                    {
                                        RegionId = urr.RegionId,
                                        Region = lookup.Value
                                    }).ToListAsync();
                var data  =  await DbContext.LookUp.Where(x => x.Type.ToLower() == "contractregion" && x.IsActive == true).Select(y => new UserRegion
                {
                    Id = y.Id,
                    RegionType = y.Value
                }
                ).ToListAsync();
                return data.Where(a => region.Any(b => b.RegionId.Equals(a.Id))).ToList();
            }
            return await DbContext.LookUp.Where(x => x.Type.ToLower() == "contractregion" && x.IsActive == true).Select(y => new UserRegion
            {
                Id = y.Id,
                RegionType = y.Value
            }
            ).ToListAsync();


        }

        public async Task<DropDownDto> GetDropDownValues(long Id)
        {
            var getUsersDto = new GetUsersDto();
            var userName = await GetUngroupedUsers(Id);
            var email = userName.Select(x => x.Email).DistinctBy(x => x).ToList();
            var region = await GetRegions(Id);
            var roles = await GetAllRoles(Id);
            return new DropDownDto
            {
                Region = region,
                RoleType = roles
            };
        }

        public async Task<Type?> GetType(long Id)
        {
            return await (from urr in DbContext.UserRoleRegion.Where(x => x.UserId == Id && x.IsActive == true)
                              join trm in DbContext.RoleTypeMapping.Where(x=>x.IsActive == true) on urr.TypeRoleId equals trm.Id
                              join lookup in DbContext.LookUp.Where(x=>x.IsActive == true) on trm.TypeId equals lookup.Id
                              join lookup1 in DbContext.LookUp.Where(x=>x.IsActive == true) on trm.RoleId equals lookup1.Id
                              select new Type
                              {
                                  type = lookup.Value,
                                  TypeId = trm.TypeId,
                                  Role = lookup1.Value
                              }).FirstOrDefaultAsync();
        }

        public async Task<List<region>> GetAssociatedRegions(long Id)
        {
            return await (from urr in DbContext.UserRoleRegion.Where(x => x.UserId == Id && x.IsActive == true)
                                join lookup in DbContext.LookUp.Where(x=>x.IsActive == true) on urr.RegionId equals lookup.Id
                                select new region
                                {
                                    Id = urr.RegionId,
                                    Region = lookup.Value
                                }).ToListAsync();
        }

        public async Task<AllUsersDto?> GetUser(long Id)
        {
            var Users = await GetUngroupedUsers(Id);
            return Users.GroupBy(x => new { x.Id, x.FirstName, x.LastName, x.Email, x.IsCurrentUser, x.IsActive, x.LastLogin, x.ForgetPassword,x.Signature }).Select(y => new AllUsersDto
            {
                Id = y.Key.Id,
                FirstName = y.Key.FirstName,
                LastName = y.Key.LastName,
                Email = y.Key.Email.ToLower(),
                LastLogin = y.Key.LastLogin,
                IsCurrentUser = y.Key.IsCurrentUser,
                IsActive = y.Key.IsActive,

                ForgetPassword = y.Key.ForgetPassword ?? false,
                Signature = y.Key.Signature ?? "",
                role = y.Select(z => new Role
                {
                    Id = z.RoleId,
                    role = z.Role
                }).DistinctBy(e => e.Id).ToList(),
                RoleId = y.Select(z => z.RoleId).FirstOrDefault(),
                TypeId = y.Select(c => c.TypeId).FirstOrDefault(),
                type = y.Select(s => new Core.Responses.LookUp.Type
                {
                    Id = s.TypeId,
                    type = s.Type
                }).DistinctBy(f => f.Id).ToList(),
                region = y.Select(d => new Region
                {
                    Id = d.RegionId,
                    regionType = d.Region
                }).DistinctBy(g => g.Id).ToList()
            }).FirstOrDefault(x =>x.Id == Id);
        }
    }
}
