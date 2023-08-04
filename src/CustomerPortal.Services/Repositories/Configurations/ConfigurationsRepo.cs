using CustomerPortal.Services.Core.ApplicationDbContext;
using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Models;
using CustomerPortal.Services.Core.Responses.Configurations;
using Microsoft.EntityFrameworkCore;

namespace CustomerPortal.Services.Repositories.Configurations
{
    public class ConfigurationsRepo:IConfigurationsRepo
    {
        public ConfigurationsRepo(CustomerPortalDbContext dbcontext)
        {
            Dbcontext = dbcontext;
        }

        public CustomerPortalDbContext Dbcontext { get; }

        public async Task<List<Organisations>> GetOrganisations(bool flag)
        {
            if (flag) 
            {
                return await Dbcontext.LookUp.Where(x => x.Type.ToLower().Trim() == "company" && x.Value.ToLower().Trim() != "no company").Select(x => new Organisations
                {
                    Id = x.Id,
                    Organization = x.Value
                }).ToListAsync();
            }

            return await Dbcontext.LookUp.Where(x => x.Type.ToLower().Trim() == "company" && x.Value.ToLower().Trim() != "no company" && x.Value.ToLower().Trim() != "mears").Select(x => new Organisations
            {
                Id = x.Id,
                Organization = x.Value
            }).ToListAsync();

        }

        public async Task<List<Contracts>> GetContracts(long Id)
        {
            var data =  await (from crm in Dbcontext.ContractRegionMapping.Where(x => x.IsActive == true)
                                   join lkp in Dbcontext.LookUp.Where(x => x.IsActive == true) on crm.CustomerId equals lkp.Id
                                   select new Contracts
                                   {
                                       CustomerId = crm.CustomerId,
                                       Contract = crm.Contract,
                                       Customer = lkp.Value,
                                       IsChecked = crm.CustomerId == Id
                                   }).Where(x=>x.CustomerId == Id || x.Customer.ToLower().Trim() == "no company").ToListAsync();
            return data.DistinctBy(x => x.Contract).OrderByDescending(x=>x.IsChecked).ThenBy(x=>x.Contract).ToList();
        }

        public async Task<RegionResponse> GetAllRegions(string Contract)
        {
            var dat = await (from lkp in Dbcontext.LookUp.Where(x => x.Type.ToLower().Trim() == "contractregion" && x.IsActive == true)
                             from crm in Dbcontext.ContractRegionMapping.Where(x => x.Contract.ToLower().Trim() == Contract.ToLower().Trim() && x.RegionId == lkp.Id && x.IsActive == true).DefaultIfEmpty()
                             select new Regions
                             {
                                Region= lkp.Value.ToLower() == "no region" ? lkp.Value : lkp.Value + (lkp.Description == null || lkp.Description == "" ? "" : " - " + lkp.Description).ToString(),
                                Id = lkp.Id,
                                Assigned = crm != null
                             }).ToListAsync();
            return new RegionResponse
            {
                Regions = dat.DistinctBy(x=>x).OrderByDescending(x=>x.Region.ToLower() == "no region").ThenBy(x=>x.Region).ThenByDescending(x=>x.Assigned).ToList()
            };
        }

        public async Task NestedGrouping()
        {
            var data = await (from map in Dbcontext.ContractRegionMapping.Where(x => x.IsActive == true)
                              group map by new { map.CustomerId } into grouped
                              select new
                              {
                                  CustomerId = grouped.Key.CustomerId,
                                  Contract = grouped.Select(x => new
                                  {
                                      ContractNumber = x.Contract,
                                      RegionId = x.RegionId
                                  }).ToList(),
                              }).ToListAsync();
        }

        public async Task<List<RolesResponse>> GetRoles(long OrganisationId)
        {
            var data =  await (from rr in Dbcontext.LookUp.Where(x => x.Type == "UserRole" && x.IsActive == true)
                                     from df in Dbcontext.RoleTypeMapping.
                                     Where(x => x.IsActive == true && x.TypeId == OrganisationId && x.RoleId == rr.Id).DefaultIfEmpty()
                                     from scr in Dbcontext.TypeRoleScreenMapping.Where(x => x.IsActive == true && df.Id == x.TypeRoleId).DefaultIfEmpty() 
                                     select new RolesResponse
                                     {
                                         Id = rr.Id,
                                         Role = rr.Value,
                                         Assigned = df == null ? false : true,
                                         IsScreensAssigned = scr == null ? false : true
                                     }).ToListAsync();
            return data.DistinctBy(x=>x.Id).ToList();
        }

        public async Task<bool> IsAssigned(long TypeId, long RoleId)
        {
            var data = await (from trm in Dbcontext.RoleTypeMapping.Where(x => x.RoleId == RoleId && x.TypeId == TypeId) join scr in Dbcontext.TypeRoleScreenMapping.Where(x => x.IsActive == true) on trm.Id equals scr.TypeRoleId select new { Id = scr.Id }).ToListAsync();
            if (data.Count() == 0)
            {
                return false;
            }
            return true;
        }

        public async Task<AddNewResponse> AddNewInLookUp(AddNewInLookUp addNewInLookUp)
        {
            var response = new AddNewResponse();
            addNewInLookUp.SetTypeAndDescription();
            addNewInLookUp.flag = System.Threading.Thread.CurrentThread.CurrentCulture.TextInfo.ToTitleCase(addNewInLookUp.flag);
            var dt = await Dbcontext.LookUp.Where(x => x.Value.ToLower().Trim() == addNewInLookUp.Value.ToLower().Trim() && x.Type.ToLower().Trim() == addNewInLookUp.Type.ToLower().Trim()).FirstOrDefaultAsync();
            if(dt!= null)
            {
                response.status = false;
                response.message = addNewInLookUp.Type + " already  exists";
                return response;
            }
            var sortOrder = await Dbcontext.LookUp.Where(x => x.Type.ToLower().Trim() == addNewInLookUp.Type.ToLower().Trim()).Select(x => x.SortOrder).MaxAsync();
            var lookup = new LookUp();
            lookup.Text = addNewInLookUp.Value;
            lookup.Type = addNewInLookUp.Type;
            lookup.Value = addNewInLookUp.Value;
            lookup.Description = addNewInLookUp.Description;
            lookup.SortOrder = ++sortOrder;
            lookup.AddedBy = addNewInLookUp.UserId;
            lookup.AddedDate = DateTime.Now;
            lookup.IsActive = true;
            Dbcontext.Add(lookup);
            Dbcontext.SaveChanges();
            response.status = true;
            response.message = addNewInLookUp.Type + " added successfully";
            return response;

            
        }

        public async Task<List<ScreensResponse>> GetAllScreens(ScreensDto _screensDto)
        {
            return await(from lkp in Dbcontext.LookUp.Where(x => x.IsActive == true && x.Type.ToLower().Trim() == "screens")
                                from df in Dbcontext.RoleTypeMapping.Where(x => x.IsActive == true && x.TypeId == _screensDto.OrganizationId && x.RoleId == _screensDto.RoleId).DefaultIfEmpty()
                                from gh in Dbcontext.TypeRoleScreenMapping.Where(x => x.IsActive == true && x.TypeRoleId == df.Id && x.Screenid == lkp.Id).DefaultIfEmpty()
                                select new ScreensResponse
                                {
                                    ScreenId = lkp.Id,
                                    Screen = lkp.Value,
                                    Assigned = gh == null ? false : true
                                }
                                 ).ToListAsync();
        }

        public async Task<PostContractResponse> PostContract(PostContractDto postContractDto)
        {
            var response = new PostContractResponse();
            var Organization = await Dbcontext.LookUp.Where(x => x.Id == postContractDto.CustomerId && x.IsActive == true && x.Type.ToLower() == "company").FirstOrDefaultAsync();
            var contract = await Dbcontext.ContractRegionMapping.Where(x => x.Contract.ToLower().Trim() == postContractDto.ContractNumber.ToLower().Trim() && x.IsActive == true).FirstOrDefaultAsync();
            if(Organization == null)
            {
                response.status = false;
                response.message = ErrorMessages.CustomerDoesNotExists; //"Organization does not exists";
                return response;
            }
            if(contract == null)
            {
                response.status = false;
                response.message = ErrorMessages.ContractDoesNotExist;  //"Contract does not exists";
                return response;
            }
            var data = await Dbcontext.ContractRegionMapping.Where(x => x.CustomerId == postContractDto.CustomerId && x.Contract.ToLower().Trim() == postContractDto.ContractNumber.ToLower().Trim() && x.IsActive == true).ToListAsync();
            if(postContractDto.IsChecked == false)
            {
                
               
                if(data.Count == 0)
                {
                    response.status = false;
                    response.message = ErrorMessages.NoCustomerContractMapping; //"No data found for the respective Organization and Contract";
                    return response;
                }
               
                data.ForEach(x =>
                { 
                    x.IsActive = false;
                    x.ChangedDate = DateTime.Now;
                    x.changedBy = postContractDto.UserId;
                    Dbcontext.Update(x);
                });
                await AddContract(postContractDto);

            }
            else if(postContractDto.IsChecked == true)
            {
                if(data.Count != 0)
                {
                    response.status = false;
                    response.message = ErrorMessages.ContractExistsforCustomer; //"This Contract already exists for this Organization";
                    return response;
                }
                var ds = await Dbcontext.ContractRegionMapping.Where(x => x.Contract.ToLower() == postContractDto.ContractNumber.ToLower().Trim() && x.IsActive == true).FirstOrDefaultAsync();
                var nocustomer = await Dbcontext.LookUp.Where(x => x.Value.ToLower() == "no company").FirstOrDefaultAsync();
                if (ds != null && nocustomer != null && ds.CustomerId == nocustomer.Id)
                {
                    ds.IsActive = false;
                    ds.changedBy = postContractDto.UserId;
                    ds.ChangedDate = DateTime.Now;
                    Dbcontext.Update(ds);
                }
                await AddContract(postContractDto);
            }
            Dbcontext.SaveChanges();
            response.message = ErrorMessages.DataSavedSuccessfully; //"Data saved successfully";
            response.status = true;
            return response;
        }

        public async Task AddContract(PostContractDto postContractDto)
        {
            var dt = new ContractRegionMapping();
            dt.CustomerId =postContractDto.IsChecked ? postContractDto.CustomerId : await Dbcontext.LookUp.Where(x => x.Value.ToLower() == "no company").Select(x => x.Id).FirstOrDefaultAsync();
            dt.Contract = postContractDto.ContractNumber;
            dt.RegionId = await Dbcontext.LookUp.Where(x => x.Value.ToLower() == "no region").Select(x => x.Id).FirstOrDefaultAsync();
            dt.IsActive = true;
            dt.AddedDate = DateTime.Now;
            dt.AddedBy = postContractDto.UserId;
            Dbcontext.Add(dt);
        }

        public async Task<PostRegionResponse> PostRegion(PostRegion postRegion)
        {
            var response = new PostRegionResponse();
            var Organization = await Dbcontext.LookUp.Where(x => x.Id == postRegion.CustomerId && x.IsActive == true && x.Type.ToLower() == "company").FirstOrDefaultAsync();

            var region = await Dbcontext.LookUp.Where(x=>x.Id == postRegion.RegionId && x.IsActive == true && x.Type.ToLower() == "contractregion").FirstOrDefaultAsync();

            var contract = await Dbcontext.ContractRegionMapping.Where(x => x.Contract.ToLower().Trim() == postRegion.Contract.ToLower().Trim() && x.IsActive == true).FirstOrDefaultAsync();

            if (Organization == null)
            {
                response.status = false;
                response.message = ErrorMessages.CustomerDoesNotExists; // "Organization does not exists";
                return response;
            }
            if(region == null)
            {
                response.status = false;
                response.message = ErrorMessages.RegionDoesNotExists; // "Region does not exists";
                return response;
            }
            if(contract == null)
            {
                response.status = false;
                response.message = ErrorMessages.ContractDoesNotExist; // "Contract does not exists";
                return response;
            }
            var data = await Dbcontext.ContractRegionMapping
                        .Where(x => x.CustomerId == postRegion.CustomerId 
                            && x.Contract.ToLower().Trim() == postRegion.Contract.ToLower().Trim() 
                            && x.RegionId == postRegion.RegionId && x.IsActive == true)
                        .FirstOrDefaultAsync();
            if(postRegion.IsChecked ==  true)
            {
                // Checking whether the region is already assigned
                if (data != null)
                {
                    response.status = false;
                    response.message = ErrorMessages.RegionAlreadyExist;//  "Region already exists";
                    return response;
                }

                // Checking whether the previous region assigned is No Region
                var assignedRegions = await Dbcontext.ContractRegionMapping.Where(x => x.Contract.ToLower().Trim() == postRegion.Contract.ToLower().Trim() && x.CustomerId == postRegion.CustomerId && x.IsActive == true).FirstOrDefaultAsync();
                var NoRegion = await Dbcontext.LookUp.Where(x => x.Value.ToLower() == "no region").FirstOrDefaultAsync();
                if(assignedRegions!= null && NoRegion != null && assignedRegions.RegionId == NoRegion.Id)
                {
                    assignedRegions.IsActive = false;
                    assignedRegions.changedBy = postRegion.UserId;
                    assignedRegions.ChangedDate = DateTime.Now;
                    Dbcontext.Update(assignedRegions);
                }

                // Checking whether the incoming Region is No region
                var lkp = await Dbcontext.LookUp.Where(x => x.Id == postRegion.RegionId).FirstOrDefaultAsync();
                if (lkp!= null && lkp.Value.ToLower() == "no region")
                {
                    var ds = await Dbcontext.ContractRegionMapping
                        .Where(x => x.CustomerId == postRegion.CustomerId && x.Contract.ToLower().Trim() == postRegion.Contract.ToLower().Trim() && x.IsActive == true).ToListAsync();
                    if(ds.Count > 0)
                    {
                        ds.ForEach(x =>
                        {
                            x.IsActive = false;
                            x.ChangedDate = DateTime.Now;
                            x.changedBy = postRegion.UserId;
                            Dbcontext.Update(x);
                        });
                    }
                }

                // Adding a new region mapping for the Customer and Contract 
                var dt = new ContractRegionMapping();
                dt.CustomerId = postRegion.CustomerId;
                dt.Contract = postRegion.Contract;
                dt.RegionId = postRegion.RegionId;
                dt.IsActive = true;
                dt.AddedDate = DateTime.Now;
                dt.AddedBy = postRegion.UserId;
                Dbcontext.Add(dt);
            }
            else
            {
                // Checking whether the region is already assigned
                if(data == null)
                {
                    response.status = false;
                    response.message = ErrorMessages.RegionMappingDoesNotExist;// "Region mapping does not exists";
                    return response;
                }                                                                                                                                                                    
                var st = await Dbcontext.ContractRegionMapping.Where(x => x.CustomerId == postRegion.CustomerId && x.Contract.ToLower().Trim() == postRegion.Contract.ToLower().Trim() && x.IsActive == true).ToListAsync();
                // if already only one region is assigned and we are removing it then mapping it to "no region"
                if(st.Count == 1)
                {
                    var dt = new ContractRegionMapping();
                    dt.CustomerId = postRegion.CustomerId;
                    dt.Contract = postRegion.Contract;
                    dt.RegionId = await Dbcontext.LookUp.Where(x => x.Value.ToLower() == "no region").Select(x => x.Id).FirstOrDefaultAsync();
                    dt.IsActive = true;
                    dt.AddedDate = DateTime.Now;
                    dt.AddedBy = postRegion.UserId;
                    Dbcontext.Add(dt);
                }
                data.IsActive = false;
                data.changedBy = postRegion.UserId;
                data.ChangedDate = DateTime.Now;
                Dbcontext.Update(data);
            }

            Dbcontext.SaveChanges();
            response.status = true;
            response.message = ErrorMessages.DataSavedSuccessfully;//  "Data saved successfully";
            return response;
        }

        public async Task<PostRoleResponse> PostRole(PostRoleDto postRoleDto)
        {
            var response = new PostRoleResponse();
            var organization = await GetOrganization(postRoleDto.CustomerId);
            var role = await GetRole(postRoleDto.RoleId);
            // Checking for a valid organization
            if(organization == null)
            {
                response.status = false;
                response.message = ErrorMessages.CustomerDoesNotExists;// "Organization does not exists";
                return response;
            }
            // Checking for a valid role
            if(role == null)
            {
                response.status = false;
                response.message = ErrorMessages.RoleDoesNotExist; // "Role does not exists";
                return response;
            }

            var existingData = await Dbcontext.RoleTypeMapping.Where(x => x.RoleId == postRoleDto.RoleId && x.TypeId == postRoleDto.CustomerId).FirstOrDefaultAsync();


            if(postRoleDto.IsChecked == true)
            {
                if(existingData != null)
                {
                    existingData.IsActive = true;
                    existingData.ChangedBy = postRoleDto.UserId;
                    existingData.ChangedDate = DateTime.Now;
                    //response.status = false;
                    Dbcontext.Update(existingData);
                    //response.message = ErrorMessages.RoleExistforCustomer;//  "This role already exists for this organization";
                    //return response;
                }else
                {
                    var mapping = new RoleTypeMapping();
                    mapping.TypeId = postRoleDto.CustomerId;
                    mapping.RoleId = postRoleDto.RoleId;
                    mapping.AddedDate = DateTime.Now;
                    mapping.AddedBy = postRoleDto.UserId;
                    mapping.IsActive = true;
                    Dbcontext.Add(mapping);
                }
                
            }
            else
            {
                if(existingData == null)
                {
                    var mapping = new RoleTypeMapping();
                    mapping.TypeId = postRoleDto.CustomerId;
                    mapping.RoleId = postRoleDto.RoleId;
                    mapping.AddedDate = DateTime.Now;
                    mapping.AddedBy = postRoleDto.UserId;
                    mapping.IsActive = false;
                    Dbcontext.Add(mapping);
                }
                else
                {
                    existingData.IsActive = false;
                    existingData.ChangedBy = postRoleDto.UserId;
                    existingData.ChangedDate = DateTime.Now;
                    var existingscreenMappings = await Dbcontext.TypeRoleScreenMapping.Where(x => x.TypeRoleId == existingData.Id && x.IsActive == true).ToListAsync();
                    existingscreenMappings.ForEach(x =>
                    {
                        x.IsActive = false;
                        x.ChangedDate = DateTime.Now;
                        x.ChangedBy = postRoleDto.UserId;
                        Dbcontext.Update(x);
                    });
                    Dbcontext.Update(existingData);
                }
                
            }
            Dbcontext.SaveChanges();
            response.status = true;
            response.message = ErrorMessages.DataSavedSuccessfully; // "Data saved successfully";
            return response;
        }

        public async Task<PostScreenResponse> PostScreens(PostScreensDto postScreensDto)
        {
            var response = new PostScreenResponse();
            var organization = await GetOrganization(postScreensDto.CustomerId);
            var role = await GetRole(postScreensDto.RoleId);
            var screen = await GetScreen(postScreensDto.ScreenId);

            // Checking for a valid organization
            if (organization == null)
            {
                response.status = false;
                response.message = ErrorMessages.CustomerDoesNotExists; // "Organization does not exists";
                return response;
            }
            // Checking for a valid role
            if (role == null)
            {
                response.status = false;
                response.message = ErrorMessages.RoleDoesNotExist; // "Role does not exists";
                return response;
            }

            var existingTypeRoleMapping = await GetRoleTypeMapping(postScreensDto.CustomerId, postScreensDto.RoleId);

            if(existingTypeRoleMapping == null)
            {
                response.status = false;
                response.message = ErrorMessages.RoleNotExistsforCustomer; // "Organization Role Mapping does not exist";
                return response;
            }

            var existingscreenMapping = await Dbcontext.TypeRoleScreenMapping.Where(x => x.IsActive == true && x.Screenid == postScreensDto.ScreenId && x.TypeRoleId == existingTypeRoleMapping.Id).FirstOrDefaultAsync();
            if(postScreensDto.IsChecked == true)
            {
                if(existingscreenMapping != null)
                {
                    response.status = false;
                    response.message = ErrorMessages.ScreenMappingExists; // "Screen Mapping already exists";
                    return response;
                }
                var mapping = new TypeRoleScreenMapping();
                mapping.TypeRoleId = existingTypeRoleMapping.Id;
                mapping.Screenid = postScreensDto.ScreenId;
                mapping.AddedDate = DateTime.Now;
                mapping.AddedBy = postScreensDto.UserId;
                mapping.IsActive = true;
                Dbcontext.Add(mapping);
            }
            else
            {
                if(existingscreenMapping == null)
                {
                    response.status = false;
                    response.message = ErrorMessages.ScreenMappingNotExists; // "Screen Mapping does not exist";
                    return response;
                }

                existingscreenMapping.IsActive = false;
                existingscreenMapping.ChangedBy = postScreensDto.UserId;
                existingscreenMapping.ChangedDate = DateTime.Now;
                Dbcontext.Update(existingscreenMapping);
            }

            Dbcontext.SaveChanges();
            response.status = true;
            response.message = ErrorMessages.DataSavedSuccessfully;// "Data saved successfully";
            return response;
        }

        public async Task<LookUp?> GetOrganization(long Id)
        {
            return await Dbcontext.LookUp.Where(x => x.Id == Id && x.IsActive == true && x.Type.ToLower() == "company").FirstOrDefaultAsync();
        }

        public async Task<LookUp?> GetRole(long Id)
        {
             return await Dbcontext.LookUp.Where(x => x.Id == Id && x.IsActive == true && x.Type.ToLower() == "userrole").FirstOrDefaultAsync();
        }

        public async Task<LookUp?> GetScreen(long Id)
        {
            return await Dbcontext.LookUp.Where(x => x.Id == Id && x.IsActive == true && x.Type.ToLower() == "screens").FirstOrDefaultAsync();
        }

        public async Task<RoleTypeMapping?> GetRoleTypeMapping(long OrganizationId, long RoleId)
        {
            return await Dbcontext.RoleTypeMapping.Where(x => x.RoleId == RoleId && x.TypeId == OrganizationId && x.IsActive == true).FirstOrDefaultAsync();
        }
    }
}
