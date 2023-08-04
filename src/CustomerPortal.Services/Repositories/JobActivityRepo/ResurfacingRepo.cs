using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Models;
using CustomerPortal.Services.Core.Responses.JobActivity;
using Microsoft.EntityFrameworkCore;

namespace CustomerPortal.Services.Repositories.JobActivityRepo
{
    public class ResurfacingRepo : IResurfacingRepo
    {
        public ResurfacingRepo(IGenericRepository context)
        {
            DbContext = context;
        }

        public IGenericRepository DbContext { get; }

        public async Task<ResurfacingListResponse> GetAllResurfacingJobs(GetAllJobsDto _getDto)
        {
            Common.FindThisWeekStartDayAndEndDay(out DateTime firstDate, out DateTime lastDate, out DateTime lockdownreferalDate, _getDto.CurrentWeek);

            Common.FindLockdownDate(lockdownreferalDate, out DateTime LockdownDate, _getDto.CurrentWeek);

            var user = await GetUserDetails(_getDto.UserId);

            var jobs = new List<ResurfacingDetails>();

            char[] sep = { '-', ' ' };

            if (user?.Type.ToLower().Trim() == "mears")
            {
                if(user.Role.ToLower().Trim() == "admin")
                {
                    jobs = await (from job in DbContext.Get<ResurfacingMaster>().Where(x => x.Job_Date >= firstDate && x.Job_Date <= lastDate && x.Is_Active == true)
                                  join status in DbContext.Get<ResurfacingStatusTracking>().Where(x => x.IsActive == true) on job.Id equals status.ResurfacingId
                                  join lookUp in DbContext.Get<LookUp>().Where(x => x.Value.ToLower() != "deleted" && x.IsActive == true) on status.StatusId equals lookUp.Id

                                  select new ResurfacingDetails
                                  {
                                      Id = job.Id,
                                      JobStatus = lookUp.Value,
                                      JobNumber = job.Job_Number,
                                      JobDate = job.Job_Date,
                                      RequesterName = status.RequesterName ?? "",
                                      IsRequester = job.Is_Requester,
                                      ForemanName = job.Foreman,
                                      contractNumber = job.Contract,
                                      SortOrder = lookUp.SortOrder,
                                      WO = ReturnWoOrPo(job.WorkOrder, false),
                                      PO = ReturnWoOrPo(job.WorkOrder, true),
                                      Address = job.StreetAddress + ", " + job.City + ", " + job.State

                                  }
                        ).ToListAsync();
                }else
                {
                    jobs = await (from job in DbContext.Get<ResurfacingMaster>().Where(x => x.Job_Date >= firstDate && x.Job_Date <= lastDate && x.Is_Active == true)
                                  join status in DbContext.Get<ResurfacingStatusTracking>().Where(x => x.IsActive == true) on job.Id equals status.ResurfacingId
                                  join lookUp in DbContext.Get<LookUp>().Where(x => x.Value.ToLower() != "deleted" && x.IsActive == true) on status.StatusId equals lookUp.Id
                                  join crm in DbContext.Get<ContractRegionMapping>().Where(x => x.IsActive == true) on job.Contract equals crm.Contract

                                  join ussr in DbContext.Get<User_Role_Region_Mapping>().Where(x => x.IsActive == true && x.UserId == _getDto.UserId) on crm.RegionId equals ussr.RegionId

                                  select new ResurfacingDetails
                                  {
                                      Id = job.Id,
                                      JobStatus = lookUp.Value,
                                      JobNumber = job.Job_Number,
                                      JobDate = job.Job_Date,
                                      RequesterName = status.RequesterName ?? "",
                                      IsRequester = job.Is_Requester,
                                      ForemanName = job.Foreman,
                                      contractNumber = job.Contract,
                                      SortOrder = lookUp.SortOrder,
                                      WO = ReturnWoOrPo(job.WorkOrder, false),
                                      PO = ReturnWoOrPo(job.WorkOrder, true),
                                      Address = job.StreetAddress + ", " + job.City + ", " + job.State

                                  }
                        ).ToListAsync();
                }
                

            }
            else
            {
                jobs = await (from job in DbContext.Get<ResurfacingMaster>().Where(x => x.Job_Date >= firstDate && x.Job_Date <= lastDate && x.Is_Active == true)
                              join status in DbContext.Get<ResurfacingStatusTracking>().Where(x => x.IsActive == true) on job.Id equals status.ResurfacingId
                              join lookUp in DbContext.Get<LookUp>().Where(x => x.Value.ToLower() != "deleted") on status.StatusId equals lookUp.Id

                              join crrm in DbContext.Get<ContractRegionMapping>().Where(x => x.CustomerId == user.TypeId && x.IsActive == true) on job.Contract equals crrm.Contract
                             join urrr in DbContext.Get<User_Role_Region_Mapping>().Where(x => x.IsActive == true) on crrm.RegionId equals urrr.RegionId
                             join trm in DbContext.Get<RoleTypeMapping>().Where(x => x.IsActive == true && x.TypeId == user.TypeId) on urrr.TypeRoleId equals trm.Id
                             join usr in DbContext.Get<User>() on urrr.UserId equals usr.UserId
                             where usr.UserId == _getDto.UserId 
                             select new ResurfacingDetails
                             {
                                 Id = job.Id,
                                 JobStatus = lookUp.Value,
                                 JobNumber = job.Job_Number,
                                 RequesterName = status.RequesterName ?? "",
                                 IsRequester = job.Is_Requester,
                                 JobDate = job.Job_Date,
                                 ForemanName = job.Foreman,
                                 contractNumber = job.Contract,
                                 SortOrder = lookUp.SortOrder,
                                 WO = ReturnWoOrPo(job.WorkOrder, false),
                                 PO = ReturnWoOrPo(job.WorkOrder, true),
                                 Address = job.StreetAddress + ", " + job.City + ", " + job.State

                             }
              ).ToListAsync();
            }

            var WorkOrder = jobs.Select(x => x.WO == null || x.WO == "" ? "(blank)" : x.WO).DistinctBy(x => x).ToList();
            var PurchaseOrder = jobs.Select(x => x.PO == null ? "(blank)" : x.PO == "" ? "(blank)" : x.PO).DistinctBy(x => x).ToList();
            jobs = jobs.GroupBy(x => new 
            { x.Id,
                x.JobNumber,
                x.JobDate,
                x.ForemanName,
                x.contractNumber,
                x.SortOrder,
                x.JobStatus,
                x.RequesterName,
                x.IsRequester,
                x.Address
            }).Select(y => new ResurfacingDetails
                {
                    Id = y.Key.Id,
                    JobStatus = y.Key.JobStatus,
                    JobNumber = y.Key.JobNumber,
                    JobDate = y.Key.JobDate,
                    ForemanName = y.Key.ForemanName,
                    contractNumber = y.Key.contractNumber,
                    SortOrder = y.Key.SortOrder,
                    WOList = y.Select(x => x.WO == null ? "" : x.WO.Trim()).DistinctBy(x => x).ToList(),
                    POList = y.Select(x => x.PO == null ? "" : x.PO.Trim()).DistinctBy(x => x).ToList(),
                    Address = y.Key.Address,
                    RequesterName = y.Key.RequesterName ?? "",
                    IsRequester = y.Key.IsRequester ?? false
            }).ToList();


            var TotalJobCount = jobs.Count();
            var PendingJobCount = jobs.Where(x => x.JobStatus.ToLower() == "pending").Count();
            var RejectedJobCount = jobs.Where(x => x.JobStatus.ToLower() == "rejected").Count();
            var ApprovedJobCount = jobs.Where(x => x.JobStatus.ToLower() == "approved").Count();

            var VoidedJobCount = jobs.Where(x => x.JobStatus.ToLower() == "voided").Count();

            _getDto.ForemanName = _getDto.ForemanName == null || _getDto.ForemanName == "" ? "all" : _getDto.ForemanName;
            _getDto.JobNumber = _getDto.JobNumber == null || _getDto.JobNumber == "" ? "all jobs" : _getDto.JobNumber;
            _getDto.Status = _getDto.Status == null || _getDto.Status == "" ? "all status" : _getDto.Status;
            _getDto.PO = _getDto.PO == null || _getDto.PO == "" ? "all po #" : _getDto.PO;
            _getDto.WO = _getDto.WO == null || _getDto.WO == "" ? "all wo #" : _getDto.WO;
            _getDto.contractNumber = _getDto.contractNumber == null || _getDto.contractNumber == "" ? "all contracts" : _getDto.contractNumber;
            if (_getDto.Status.ToLower() != "all status")
            {
                jobs = jobs.Where(x => x.JobStatus.ToLower() == _getDto.Status.ToLower()).ToList();
            }
            if (_getDto.contractNumber.ToLower() != "all contracts")
            {
                jobs = jobs.Where(x => x.contractNumber.ToLower().Trim() == _getDto.contractNumber.ToLower().Trim()).ToList();
            }
            if (_getDto.JobNumber.ToLower() != "all jobs")
            {
                jobs = jobs.Where(x => x.JobNumber == _getDto.JobNumber).ToList();
            }
            if (_getDto.ForemanName.ToLower() != "all")
            {
                jobs = jobs.Where(x => x.ForemanName.ToLower() == _getDto.ForemanName.ToLower()).ToList();
            }
            if (_getDto.WO.ToLower() != "all wo #")
            {
                if (_getDto.WO.ToLower() == "blank")
                {
                    jobs = jobs.Where(x => x.WOList.Contains("")).ToList();
                }
                else
                {
                    jobs = jobs.Where(x => x.WOList.Contains(_getDto.WO.Trim().ToLower())).ToList();
                }
            }

            if (_getDto.PO.ToLower() != "all po #")
            {
                if (_getDto.PO.ToLower() == "blank")
                {
                    jobs = jobs.Where(x => x.POList.Contains("")).ToList();
                }
                else
                {
                    jobs = jobs.Where(x => x.POList.Contains(_getDto.PO.Trim().ToLower())).ToList();
                }

            }

            var stat = new List<string>
            {
               "(blank)"
            };

            var foremen = jobs.Select(x => x.ForemanName).DistinctBy(x => x).ToList();
            var jobNumbers = new List<string>();
            jobNumbers.Add("All");
            jobNumbers = jobs.Select(x => x.JobNumber).DistinctBy(x => x).ToList();
            WorkOrder = WorkOrder.Where(x => jobs.Select(y => y.WOList).ToList().Any(z => z.Any(t => t == x))).ToList();
            PurchaseOrder = PurchaseOrder.Where(x => jobs.Select(y => y.POList).ToList().Any(z => z.Any(t => t == x))).ToList();
            var signature = await DbContext.Get<User>().Where(x => x.UserId == _getDto.UserId).Select(x => x.Signature).FirstOrDefaultAsync();
            var contractNumber = jobs.Select(x => x.contractNumber.ToUpper()).ToList();

            return new ResurfacingListResponse()
            {
                TotalCount = TotalJobCount,
                PendingCount = PendingJobCount,
                RejectedCount = RejectedJobCount,
                ApprovedCount = ApprovedJobCount,
                VoidedCount = VoidedJobCount,
                ForemanNames = foremen.OrderBy(x => x).ToList(),
                JobNumbers = jobNumbers.OrderBy(x => x).ToList(),
                WO = WorkOrder.OrderBy(x => x).ToList(),
                PO = PurchaseOrder.OrderBy(x => x).ToList(),
                ResurfacingDetails = jobs.OrderByDescending(x => x.JobDate).ThenBy(x => x.SortOrder).ToList(),
                Signature = signature == null ? null : "data:image/png;base64," + Convert.ToBase64String(signature),
                ContractNumber = contractNumber.DistinctBy(x=>x).OrderBy(x=>x).ToList()
            };
        }

        private static string ReturnWoOrPo(string str, bool flag)
        {
            if(str.Contains('-'))
            {
                var st = str.Split("-");
                return flag ? st[0] : st[1];
            }
            else
            {
                return "";
            }
            
        }
        public async Task<UserRoleDto?> GetUserDetails(long Id)
        {
            return await (from user in DbContext.Get<User>().Where(x => x.UserId == Id)
                          join role in DbContext.Get<User_Role_Region_Mapping>().Where(x => x.IsActive == true) on user.UserId equals role.UserId
                          join trm in DbContext.Get<RoleTypeMapping>()on role.TypeRoleId equals trm.Id
                          join lookup in DbContext.Get<LookUp>() on trm.RoleId equals lookup.Id
                          join lookUp1 in DbContext.Get<LookUp>() on trm.TypeId equals lookUp1.Id
                          select new UserRoleDto
                          {
                              Username = user.UserName,
                              Role = lookup.Value,
                              Type = lookUp1.Value,
                              RegionId = role.RegionId,
                              TypeId = trm.TypeId
                          }).FirstOrDefaultAsync();
        }

        public async Task<Resurfacing> GetResurfacingDetails(long Id)
        {
            var lookuplist = await DbContext.Get<LookUp>().Where(x => x.Type.Trim().ToLower() == "surfacesrestored").ToListAsync();
            var response = new Resurfacing();
            var data = new List<ResurfacingDetailsResponse> ();
             data = await (from rm in DbContext.Get<ResurfacingMaster>().Where(x => x.Id == Id)
                           join rr in DbContext.Get<ResurfacingRestored>()
                             on rm.Id equals rr.ResurfacingMasterId
                            select new  ResurfacingDetailsResponse
                            {
                                Id = rr.ID,
                                SurfaceType = rr.SurfaceType,
                                MaterialType = rr.MaterialType,
                                OriginalSize = new Dimensions
                                {
                                    Length = rr.OriginalLength,
                                    Width = rr.OriginalWidth,
                                    Depth = rr.OriginalDepth,
                                    Diameter = rr.OriginalDiameter,
                                    Type = rr.OriginalType,
                                    Total = rr.OriginalTotal,
                                    Quantity =rr.OriginalCount
                                },
                                FinalRestoredSize = new Dimensions 
                                {
                                    Length = rr.RestoredLength,
                                    Width = rr.RestoredWidth,
                                    Depth = rr.RestoredDepth,
                                    Diameter = rr.RestoredDiameter,
                                    Type = rr.RestoredType,
                                    Total = rr.RestoredTotal,
                                    Quantity = rr.RestoredCount
                                },
                                Header = ReturnHeaders(rr.MaterialType, lookuplist, false, rm.IsSquareFeet).Result
                                
                            }).ToListAsync();
            var ResurfacingAdditionalMaterials = await (from rm in DbContext.Get<ResurfacingMaster>().Where(x => x.Id == Id)
                                                        join am in DbContext.Get<ResurfacingAdditionalMaterial>() on
                                                          rm.Id equals am.ResurfacingMasterId
                                                         
                                                        select new ResurfacingAdditionalMaterials
                                                        {
                                                            Id = am.ID,
                                                            Material = am.AdditionalMaterial,
                                                            Quantity = am.Quantity,
                                                            Header = am.AdditionalMaterial != null ? (ResurfacingMaterialTypeConfig.QuantDC.Any(x=> x == am.AdditionalMaterial.ToLower().Trim()) ? "Quantity Delivered(Cu. yd)" : "Quantity Delivered") : ""
                                                        }).ToListAsync();
            //var ResurfacingImage = await (from rm in DbContext.Get<ResurfacingMaster>().Where(x=>x.Id == Id)
            //                              join ri in DbContext.Get<ResurfacingDrawingImages>() on
            //                                  rm.Id equals ri.ResurfacingMasterId 
            //                              select new ResurfacingImages
            //                              {
            //                                  Id = ri.ID,
            //                                  Image = ri.Image,
            //                                  Order = ri.ImageOrder
            //                              }).ToListAsync();
            
            var comment = await DbContext.Get<ResurfacingMaster>().Where(x => x.Id == Id).Select(x=> new RestorationComments
            {
                Header = "Comments",
                Value = x.Comments
            }).ToListAsync();
            //if(comment != null && comment.Count != 0)
            //{
            //    comments = comment;
            //}
            response = new Resurfacing
            {
                ResurfacingDetails= data,
                AdditionalMaterials = ResurfacingAdditionalMaterials,
                //Images = ResurfacingImage,
                Comments = comment
            };
            return response;
        }

        

        private static async Task<List<ReHeader>> ReturnHeaders(string MaterialType, List<LookUp> dt,bool flag, bool IsSquareFeet)
        {
            var data = new List<ReHeader>();
            // return data;
            if(!flag)
            {
                if (ResurfacingMaterialTypeConfig.arr3d.Any(x => x == MaterialType.Trim().ToLower()))
                {
                    data = dt.Where(x => x.Value == "length" || x.Value == "depth" || x.Value == "width" || x.Text == "Total(Cu. yd)").Select(x => new ReHeader
                    {
                        label = x.Text,
                        value = x.Value
                    }).ToList();
                    
                }
                if (ResurfacingMaterialTypeConfig.arr1d.Any(x => x == MaterialType.ToLower().Trim()))
                {
                    data = dt.Where(x => x.Value == "quantity").Select(x => new ReHeader
                    {
                        label = x.Text,
                        value = x.Value
                    }).ToList();
                    // return data;
                }
                if (ResurfacingMaterialTypeConfig.arr3c.Any(x => x == MaterialType.ToLower().Trim()))
                {
                    data = dt.Where(x => x.Value == "diameter" || x.Value == "depth" || x.Text == "Total(Cu. yd)").Select(x => new ReHeader
                    {
                        label = x.Text,
                        value = x.Value
                    }).ToList();
                    // return data;
                }

                if (ResurfacingMaterialTypeConfig.arr2d.Any(x => x == MaterialType.ToLower().Trim()))
                {
                    data = dt.Where(x => x.Value == "length" || x.Value == "width" || (x.Text == "Total(Sq. ft)")).Select(x => new ReHeader
                    {
                        label = x.Text,
                        value = x.Value
                    }).ToList();
                    //return data;
                }

                if (ResurfacingMaterialTypeConfig.arr2dt.Any(x => x == MaterialType.ToLower().Trim()))
                {
                    data = dt.Where(x => x.Value == "length" || x.Value == "width" || x.Text == "Total(Sq. ft)" || x.Value == "type").Select(x => new ReHeader
                    {
                        label = x.Text,
                        value = x.Value
                    }).ToList();
                    //return data;
                }
                var item = data.Where(x => x.value.ToLower() == "depth").FirstOrDefault();
                if (IsSquareFeet && item != null)
                {
                    data.Remove(item);
                    data.ForEach(x =>
                    {
                        if (x.value == "total")
                        {
                            x.label = "Total(Sq. ft)";
                        }
                    });
                }

                return data;

            }
            else
            {
                if (ResurfacingMaterialTypeConfig.QuantDC.Any(x => x == MaterialType.ToLower().Trim()))
                {
                    data = dt.Where(x => x.Value == "quantityDelivered").Select(x => new ReHeader
                    {
                        label = x.Text ?? "",
                        value = x.Value ?? ""
                    }).ToList();
                    return data;
                }else
                {
                    data = dt.Where(x => x.Value == "quantityDeliveredC").Select(x => new ReHeader
                    {
                        label = x.Text ?? "",
                        value = x.Value ?? ""
                    }).ToList();
                    return data;
                }

                
            }
            

            

            return data;

        }

        public async Task<List<JobStatusResponse>> GetJobStatus(long Id)
        {
            var data = await (from job in DbContext.Get<ResurfacingMaster>().Where(x => x.Id == Id)
                              join stat in DbContext.Get<ResurfacingStatusTracking>() on job.Id equals stat.ResurfacingId
                              join lookup in DbContext.Get<LookUp>().Where(x => x.IsActive == true) on stat.StatusId equals lookup.Id
                              join user in DbContext.Get<User>() on stat.CPUserId equals user.UserId into ussr
                              from usr in ussr.DefaultIfEmpty()
                              select new JobStatusResponse
                              {
                                  Id = stat.Id,
                                  Status = lookup.Value,
                                  StatusChangedDate = stat.AddedDate,
                                  Comments = stat.ReasonRejectionId != null
                                                    ? (DbContext.Get<LookUp>().Where(x => x.Id == stat.ReasonRejectionId && x.Value.ToLower().Trim() != "others" && x.Description.ToLower() != "cl").Select(x => x.Value).FirstOrDefault() == null
                                                              ? ("" + stat.Comment == null || stat.Comment == "" ? "" : stat.Comment)
                                                              : DbContext.Get<LookUp>().Where(x => x.Id == stat.ReasonRejectionId).Select(x => x.Value).FirstOrDefault() + (stat.Comment == null || stat.Comment == "" ? "" : " - " + stat.Comment))
                                                    : (stat.Comment == null || stat.Comment == "" ? "" : stat.Comment),
                                  ClApproverName = lookup.Value.ToLower() == "voided" ? stat.Username ?? "" : usr.UserName == null ? job.Approver : "",
                                  CPUserName = usr.UserName ?? "",
                                  IsCpUser = usr.UserName == null ? false : true,
                              }).OrderBy(x => x.StatusChangedDate).ToListAsync();
            return data.DistinctBy(x => new
            {
                x.StatusChangedDate,
                x.Status,
                x.ClApproverName
            }).ToList();
        }

        public async Task<PostJobStatusResponse> EditJobStatus(StatusChangeDto _statusChangeDto, PostJobStatusResponse response)
        {
            response.Status = true;
            response.Message = "";
            var statusList = await DbContext.Get<ResurfacingStatusTracking>().Where(x => x.ResurfacingId == _statusChangeDto.JobId).ToListAsync();
            var current = statusList.Where(x => x.IsActive == true).Join(DbContext.Get<LookUp>(), stat => stat.StatusId, lookup => lookup.Id, (stat, lookup) => new
            {
                status = lookup.Value
            }).FirstOrDefault();

            if (current != null && (current.status.ToLower() == "approved" || current.status.ToLower() == "voided" || current.status.ToLower() == "rejected"))
            {

                response.Status = false;
                response.Message = "This job's status has been already changed";
                return response;
            }
            var job = await DbContext.Get<ResurfacingMaster>().Where(x => x.Id == _statusChangeDto.JobId).FirstOrDefaultAsync();
            if (job == null)
            {
                response.Status = false;
                response.Message = "Job Not Found";
                return response;
            }

            statusList.ForEach(x => { x.IsActive = false; DbContext.Update(x); });
            var Userrole = await GetUserDetails(_statusChangeDto.UserId);
            await AddTracking(_statusChangeDto, Userrole);
            await DbContext.CommitAsync();
            response.Message = "Job Status changed successfully";
            response.Base64 = _statusChangeDto.Signature == null || _statusChangeDto.Signature == "" ? null : "data:image/png;base64," + Convert.ToBase64String(Convert.FromBase64String(_statusChangeDto.Signature));
            return response;
        }

        public async Task AddTracking(StatusChangeDto _statusChangeDto, UserRoleDto Userrole)
        {
            var status = await DbContext.Get<LookUp>().Where(x => x.Type.ToLower() == "dfrstatus").ToListAsync();
            var Id = status.Where(x => x.Value.ToLower() == _statusChangeDto.Status.ToLower()).Select(x => x.Id).FirstOrDefault();
            var resurfacingStatusTracking = new ResurfacingStatusTracking();
            resurfacingStatusTracking.ResurfacingId = _statusChangeDto.JobId;
            resurfacingStatusTracking.StatusId = Id;
            resurfacingStatusTracking.Comment = _statusChangeDto.Comments ?? "";
            // jobStatusTracking.AddedBy = _statusChangeDto.UserId;
            resurfacingStatusTracking.AddedDate = DateTime.Now;
            resurfacingStatusTracking.IsActive = true;
            resurfacingStatusTracking.CPUserId = _statusChangeDto.UserId;
            resurfacingStatusTracking.ReasonRejectionId = _statusChangeDto.ReasonRejectionId == Int64.Parse("0") ? null : _statusChangeDto.ReasonRejectionId;
            resurfacingStatusTracking.IPAddress = _statusChangeDto.IPAddress ?? "";
            resurfacingStatusTracking.Signature = _statusChangeDto.Signature == null || _statusChangeDto.Signature == "" ? null : System.Convert.FromBase64String(_statusChangeDto.Signature);
            resurfacingStatusTracking.RequesterName = _statusChangeDto.Requester ?? "";
            await DbContext.Add(resurfacingStatusTracking);
        }


        public async Task<ViewApprovalResponse> GetViewApproval(long Id)
        {
            var response = new ViewApprovalResponse();
            var data = await (from status in DbContext.Get<ResurfacingStatusTracking>().Where(x => x.IsActive == true && x.ResurfacingId == Id)
                              join lkp in DbContext.Get<LookUp>().Where(x => x.IsActive == true) on status.StatusId equals lkp.Id
                              select new
                              {
                                  Signature = status.Signature,
                                  Comment = status.Comment,
                                  RequesterName = status.RequesterName,
                                  Status = lkp.Value
                              }).FirstOrDefaultAsync();
            if (data == null)
            {
                response.status = false;
                response.message = "Invalid Job";
                return response;
            }
            if (data.Status.ToLower() != "approved")
            {
                response.status = false;
                response.message = "Job is not approved";
                return response;
            }
            response.status = true;
            response.Signature = data.Signature == null ? null : "data:image/png;base64," + Convert.ToBase64String(data.Signature);
            response.Comments = data.Comment;
            response.Requester = data.RequesterName;
            return response;
        }

        public async Task<List<ResurfacingImages>> GetResurfacingImages(long Id)
        {
            var ResurfacingImage = await(from rm in DbContext.Get<ResurfacingMaster>().Where(x => x.Id == Id)
                                         join ri in DbContext.Get<ResurfacingDrawingImages>() on
                                             rm.Id equals ri.ResurfacingMasterId
                                         select new ResurfacingImages
                                         {
                                             Id = ri.ID,
                                             src =ri.ImageBinary != null ? ( ri.flag == "I" ? "data:image/jpeg;base64," + Convert.ToBase64String(ri.ImageBinary) : "data:image/png;base64," + Convert.ToBase64String(ri.ImageBinary)) : "",
                                             Order = ri.ImageOrder,
                                             Caption = ri.Comments,
                                             flag = ri.flag
                                         }).ToListAsync();
            return ResurfacingImage;
        }
    }
}
