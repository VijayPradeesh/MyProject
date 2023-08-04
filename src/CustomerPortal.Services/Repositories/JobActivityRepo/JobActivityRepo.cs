using CustomerPortal.Services.Core.ApplicationDbContext;
using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Models;
using CustomerPortal.Services.Core.Responses.JobActivity;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Linq;

namespace CustomerPortal.Services.Repositories.JobActivityRepo
{
    public class JobActivityRepo : IJobActivityRepo
    {
        public JobActivityRepo(CustomerPortalDbContext dbContext)
        {
            DbContext = dbContext;
        }

        public  CustomerPortalDbContext DbContext { get; set; }

        public async Task<PostJobStatusResponse> EditJobStatus(StatusChangeDto _statusChangeDto, PostJobStatusResponse response)
        {
                response.Status = true;
                response.Message = "";
                var statusList = await DbContext.JobStatusTracking.Where(x => x.JobId == _statusChangeDto.JobId).ToListAsync();
                var current = statusList.Where(x => x.IsActive == true).Join(DbContext.LookUp, stat=> stat.StatusId, lookup=> lookup.Id, (stat, lookup)=>new
                {
                    status = lookup.Value
                }).FirstOrDefault();
            
                if(current!= null && (current.status.ToLower() == "approved" || current.status.ToLower() == "voided" || current.status.ToLower() == "rejected"))
                {
                
                    response.Status = false;
                    response.Message = "This job's status has been already changed";
                    return response;
                }
                var job = await DbContext.Job.Where(x => x.Id == _statusChangeDto.JobId).FirstOrDefaultAsync();
                if (job == null)
                {
                    response.Status = false;
                    response.Message = "Job Not Found";
                    return response;
                }

                statusList.ForEach(x => { x.IsActive = false; DbContext.Update(x); }) ;
                var Userrole = await GetUserDetails(_statusChangeDto.UserId);
                await AddTracking(_statusChangeDto, Userrole);
                DbContext.SaveChanges();
                response.Message = "Job Status changed successfully";
                response.Base64 = _statusChangeDto.Signature == null || _statusChangeDto.Signature == "" ? null : "data:image/png;base64," +   Convert.ToBase64String(Convert.FromBase64String(_statusChangeDto.Signature));
                return response;   
        }
        public async Task AddTracking(StatusChangeDto _statusChangeDto, UserRoleDto Userrole)
        {
            var status = await DbContext.LookUp.Where(x => x.Type.ToLower() == "dfrstatus").ToListAsync();
            var Id = status.Where(x => x.Value.ToLower() == _statusChangeDto.Status.ToLower()).Select(x => x.Id).FirstOrDefault();
            var jobStatusTracking = new JobStatusTracking();
            jobStatusTracking.JobId = _statusChangeDto.JobId;
            jobStatusTracking.StatusId = Id;
            jobStatusTracking.Comment = _statusChangeDto.Comments ?? "";
            // jobStatusTracking.AddedBy = _statusChangeDto.UserId;
            jobStatusTracking.AddedDate = DateTime.Now;
            jobStatusTracking.IsActive = true;
            jobStatusTracking.CPUserId = _statusChangeDto.UserId;
            jobStatusTracking.ReasonRejectionId = _statusChangeDto.ReasonRejectionId == Int64.Parse("0") ? null : _statusChangeDto.ReasonRejectionId;
            jobStatusTracking.IPAddress = _statusChangeDto.IPAddress ?? "";
            jobStatusTracking.Signature = _statusChangeDto.Signature == null || _statusChangeDto.Signature == "" ? null : System.Convert.FromBase64String(_statusChangeDto.Signature);
            jobStatusTracking.RequesterName = _statusChangeDto.Requester ?? "";
            DbContext.Add(jobStatusTracking);
        }
        public async Task<UserRoleDto?> GetUserDetails(long Id)
        {
            return await (from user in DbContext.Users.Where(x => x.UserId == Id)
                          join role in DbContext.UserRoleRegion.Where(x=>x.IsActive == true) on user.UserId equals role.UserId
                          join trm in DbContext.RoleTypeMapping on role.TypeRoleId equals trm.Id
                          join lookup in DbContext.LookUp on trm.RoleId equals lookup.Id
                          join lookUp1 in DbContext.LookUp on trm.TypeId equals lookUp1.Id 
                          select new UserRoleDto
                          {
                              Username = user.UserName,
                              Role = lookup.Value,
                              Type = lookUp1.Value,
                              RegionId = role.RegionId,
                              TypeId = trm.TypeId
                          }).FirstOrDefaultAsync();
        }
        public async Task<JobListResponse> GetAllJobs(GetAllJobsDto _getDto)
        {
            Common.FindThisWeekStartDayAndEndDay(out DateTime firstDate, out DateTime lastDate, out DateTime lockdownreferalDate, _getDto.CurrentWeek);
            Common.FindLockdownDate(lockdownreferalDate, out DateTime LockdownDate, _getDto.CurrentWeek);
            var user = await GetUserDetails(_getDto.UserId);
            var jobs = new List<JobDetails>();

            if(user.Type.ToLower().Trim() == "mears" )
            {
                if(user.Role.ToLower().Trim() != "admin")
                {
                    jobs = await (from job in DbContext.Job.Where(x => x.Job_Date >= firstDate && x.Job_Date <= lastDate && x.Is_Active == true)
                                  join payItem in DbContext.JobPayItem on job.Id equals payItem.JobmasterId
                                  join status in DbContext.JobStatusTracking.Where(x => x.IsActive == true) on job.Id equals status.JobId
                                  join lookUp in DbContext.LookUp.Where(x => x.Value.ToLower() != "deleted") on status.StatusId equals lookUp.Id

                                  join crm in DbContext.ContractRegionMapping.Where(x => x.IsActive == true) on job.Contract equals crm.Contract

                                  join ussr in DbContext.UserRoleRegion.Where(x => x.IsActive == true && x.UserId == _getDto.UserId) on crm.RegionId equals ussr.RegionId

                                  select new JobDetails
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
                                      WO = payItem.WO,
                                      PO = payItem.PO,
                                  }
                        ).ToListAsync();
                }else
                {
                    jobs = await (from job in DbContext.Job.Where(x => x.Job_Date >= firstDate && x.Job_Date <= lastDate && x.Is_Active == true)
                                  join payItem in DbContext.JobPayItem on job.Id equals payItem.JobmasterId
                                  join status in DbContext.JobStatusTracking.Where(x => x.IsActive == true) on job.Id equals status.JobId
                                  join lookUp in DbContext.LookUp.Where(x => x.Value.ToLower() != "deleted") on status.StatusId equals lookUp.Id

                                  //join crm in DbContext.ContractRegionMapping.Where(x => x.IsActive == true) on job.Contract equals crm.Contract

                                  //join ussr in DbContext.UserRoleRegion.Where(x => x.IsActive == true && x.UserId == _getDto.UserId) on crm.RegionId equals ussr.RegionId

                                  select new JobDetails
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
                                      WO = payItem.WO,
                                      PO = payItem.PO,
                                  }
                        ).ToListAsync();
                }

                

            }
            else
            {
                jobs = await (from job in DbContext.Job.Where(x => x.Job_Date >= firstDate && x.Job_Date <= lastDate && x.Is_Active == true).DefaultIfEmpty()
                              join payItem in DbContext.JobPayItem on job.Id equals payItem.JobmasterId

                              join status in DbContext.JobStatusTracking.Where(x => x.IsActive == true) on job.Id equals status.JobId
                              join lookUp in DbContext.LookUp.Where(x => x.Value.ToLower() != "deleted") on status.StatusId equals lookUp.Id

                              join crrm in DbContext.ContractRegionMapping.Where(x=>x.CustomerId == user.TypeId && x.IsActive == true) on job.Contract equals crrm.Contract 
                              join urrr in DbContext.UserRoleRegion.Where(x=> x.IsActive == true) on crrm.RegionId equals urrr.RegionId
                              join trm in DbContext.RoleTypeMapping.Where(x=>x.IsActive == true && x.TypeId == user.TypeId) on urrr.TypeRoleId equals trm.Id
                              join usr in DbContext.Users on urrr.UserId equals usr.UserId
                              where usr.UserId == _getDto.UserId //&& urrr.RegionId == user.RegionId x.UserId == _getDto.UserId &&
                              select new JobDetails
                              {
                                  Id = job.Id,
                                  JobStatus = lookUp.Value,
                                  RequesterName = status.RequesterName ?? "",
                                  IsRequester = job.Is_Requester,
                                  JobNumber = job.Job_Number,
                                  JobDate = job.Job_Date,
                                  ForemanName = job.Foreman,
                                  contractNumber = job.Contract,
                                  SortOrder = lookUp.SortOrder,
                                  WO = payItem.WO,
                                  PO = payItem.PO,
                              }
              ).ToListAsync();
            }
            var WorkOrder = jobs.Select(x => x.WO == null || x.WO == "" ? "(blank)" : x.WO).DistinctBy(x => x).ToList();
            var PurchaseOrder = jobs.Select(x => x.PO == null ? "(blank)" : x.PO == "" ? "(blank)" : x.PO).DistinctBy(x => x).ToList();
            jobs  = jobs.GroupBy(x => new { x.Id, x.JobNumber, x.JobDate, x.ForemanName, x.contractNumber, x.SortOrder, x.JobStatus , x.RequesterName, x.IsRequester})
                .Select(y => new JobDetails
            {
                Id = y.Key.Id,
                JobStatus = y.Key.JobStatus,
                JobNumber = y.Key.JobNumber,
                JobDate = y.Key.JobDate,
                ForemanName = y.Key.ForemanName,
                contractNumber = y.Key.contractNumber,
                SortOrder = y.Key.SortOrder,
                RequesterName = y.Key.RequesterName ?? "",
                IsRequester = y.Key.IsRequester ?? false,
                WOList = y.Select(x=>x.WO == null ? "" : x.WO.Trim()).DistinctBy(x=>x).ToList(),
                POList = y.Select(x=>x.PO == null ? "" : x.PO.Trim()).DistinctBy(x=>x).ToList()
            }).ToList();
           
            //jobs = jobs.DistinctBy(x => x.Id).ToList();

            var TotalJobCount = jobs.Count();
            var PendingJobCount = jobs.Where(x => x.JobStatus.ToLower() == "pending").Count();
            var RejectedJobCount = jobs.Where(x => x.JobStatus.ToLower() == "rejected").Count();
            var ApprovedJobCount = jobs.Where(x => x.JobStatus.ToLower() == "approved").Count();

            var VoidedJobCount = jobs.Where(x => x.JobStatus.ToLower() == "voided").Count();

            _getDto.ForemanName = _getDto.ForemanName == null || _getDto.ForemanName == ""? "all" : _getDto.ForemanName;
            _getDto.JobNumber = _getDto.JobNumber == null || _getDto.JobNumber == ""? "all jobs" : _getDto.JobNumber;
            _getDto.Status = _getDto.Status == null || _getDto.Status == "" ? "all status" : _getDto.Status;
            _getDto.PO = _getDto.PO == null  || _getDto.PO == "" ? "all po #" : _getDto.PO;
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
            if(_getDto.ForemanName.ToLower() != "all")
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
                if(_getDto.PO.ToLower() == "blank")
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
            var signature = await DbContext.Users.Where(x => x.UserId == _getDto.UserId).Select(x=>x.Signature).FirstOrDefaultAsync();
            WorkOrder = WorkOrder.Where(x => jobs.Select(y => y.WOList).ToList().Any(z => z.Any(t => t == x))).ToList();
            PurchaseOrder = PurchaseOrder.Where(x => jobs.Select(y => y.POList).ToList().Any(z => z.Any(t => t == x))).ToList();

            var contractNumber = jobs.Select(x => x.contractNumber.ToUpper()).ToList();
            return new JobListResponse()
            {
                TotalCount = TotalJobCount,
                PendingCount = PendingJobCount,
                RejectedCount = RejectedJobCount,
                ApprovedCount = ApprovedJobCount,
                VoidedCount = VoidedJobCount,
                ForemanNames = foremen.OrderBy(x=>x).ToList(),
                JobNumbers = jobNumbers.OrderBy(x => x).ToList(),
                WO = WorkOrder.OrderBy(x=>x).ToList(),
                PO = PurchaseOrder.OrderBy(x=>x).ToList(),
                //JobDetails = jobs.OrderBy(x=>Array.IndexOf(stat.ToArray(), x.JobStatus)).ThenBy(x=>x.JobDate).ToList(),
                JobDetails = jobs.OrderByDescending(x=>x.JobDate).ThenBy(x=>x.SortOrder).ToList(),
                LockdownDate = LockdownDate,
                Signature = signature == null ? null : "data:image/png;base64," + Convert.ToBase64String(signature),
                ContractNumber = contractNumber.Distinct().OrderBy(x => x).ToList()
            };
            // var dat = jobs;
        }

        public List<DropDown> getDropDownValues(List<string> Data)
        {
            //return new List<DropDown>();
            var dat = new List<DropDown>();
            var counter = 1;
            foreach(var item in Data)
            {
                var dt = new DropDown();
                dt.Id = counter;
                dt.Name = item;
                dat.Add(dt);
                counter++;
            }
            return dat;
        }

        public async Task<List<JobStatusResponse>> GetJobStatus(long Id)
        {
            var data =  await (from job in DbContext.Job.Where(x => x.Id == Id)
                                join stat in DbContext.JobStatusTracking on job.Id equals stat.JobId
                                join lookup in DbContext.LookUp.Where(x=>x.IsActive == true) on stat.StatusId equals lookup.Id
                                join user in DbContext.Users on stat.CPUserId equals user.UserId into ussr
                                from usr in ussr.DefaultIfEmpty() 
                                select new JobStatusResponse
                                {
                                    Id = stat.Id,
                                    Status = lookup.Value,
                                    StatusChangedDate = stat.AddedDate,
                                    Comments = stat.ReasonRejectionId != null 
                                                      ? (DbContext.LookUp.Where(x => x.Id == stat.ReasonRejectionId && x.Value.ToLower().Trim() != "others" && x.Description.ToLower() != "cl").Select(x => x.Value).FirstOrDefault() == null 
                                                                ?  ("" + stat.Comment == null || stat.Comment == "" ? "" : stat.Comment)
                                                                : DbContext.LookUp.Where(x => x.Id == stat.ReasonRejectionId).Select(x => x.Value).FirstOrDefault() + (stat.Comment == null || stat.Comment == "" ? "" : " - " + stat.Comment))
                                                      :(stat.Comment == null || stat.Comment == "" ? "" : stat.Comment),
                                    ClApproverName =lookup.Value.ToLower() =="voided"? stat.Username?? "" : usr.UserName == null ? job.Approver : "",
                                    CPUserName = usr.UserName ?? "",
                                    IsCpUser = usr.UserName == null ? false : true ,
                                }).OrderBy(x=>x.StatusChangedDate).ToListAsync();
            return data.DistinctBy(x=> new
            {
                x.StatusChangedDate,
                x.Status,
                x.ClApproverName
            }).ToList();
        }



        public async Task<JobDetailsResponse> GetJobDetails(long Id)
        {
            var Header = await DbContext.LookUp.Where(x => x.Type == "Production" || x.Type == "Labor" || x.Type == "T&M" || x.Type == "Equipment" || x.Type == "SewerCameraHeaders").ToListAsync();
            var response = new JobDetailsResponse();
            response.Production = new Production
            {
                Headers = GetHeaders("production", Header),
                Body = await GetBodyPayItem(Id, false)
            };
                response.Equipment = new Equipment
                {
                    Headers = GetHeaders("Equipment", Header),
                    Body = await GetEquipment(Id)
                };
            response.TandM = new TandM
            {
                Headers = GetHeaders("T&M", Header),
                Body = await GetBodyPayItem(Id, true)
            };
            response.Labor = new Labor
            {
                Headers = GetHeaders("Labor", Header),
                Body = await GetBodyLabour(Id)
            };
            var comments =await GetComments(Id);
            response.Comments = new Core.Responses.JobActivity.Comments
            {
                Production = comments.Where(x => x.CommentsFlag.ToUpper() == "P").Select(x => x.comments).FirstOrDefault() ?? "",
                Labor = comments.Where(x => x.CommentsFlag.ToUpper() == "L").Select(x => x.comments).FirstOrDefault() ?? "",
                Equipment = comments.Where(x => x.CommentsFlag.ToUpper() == "E").Select(x => x.comments).FirstOrDefault() ?? ""
            };
            response.SewerCam = new Core.Responses.JobActivity.SewerCamera
            {
                SewerCameraActivity = await GetSewerCamActivity(Id, Header),
                SewerCamDetailsMain = await GetSewerCameraDetails(Id, "main", Header),
                SewerCamDetailsLateral = await GetSewerCameraDetails(Id, "lateral", Header),
            };
            response.IsSewerCam = false;
            if (response.SewerCam.SewerCameraActivity != null && response.SewerCam.SewerCameraActivity.Id != 0)
            {
                response.IsSewerCam = true;
            }
          
            // response.SewerCam = await GetSewerCamData(Id);
            return  response;
        }

        public async Task<SewerCameraActivity?> GetSewerCamActivity(long Id, List<LookUp> Header)
        {
            var data = new SewerCameraActivity();
             data = await (from sewer in DbContext.SewerCam.Where(x => x.JobId == Id)
                           join lkp in DbContext.LookUp.Where(x=>x.IsActive == true) on sewer.ActivityTypeId equals lkp.Id into trans
                           from tr in trans.DefaultIfEmpty()
                              select new SewerCameraActivity
                              {
                                  Id = sewer.Id,
                                  ActivityType = tr.Value ?? "",
                                  County = sewer.County?? "",
                                  Inspector = sewer.Inspector??"",
                                  Phase = sewer.Phase??"",
                                  Comments = sewer.Comments ?? "",
                                  TruckId = sewer.TruckId??""
                              }).FirstOrDefaultAsync();
            
            if(data == null)
            {
                
                data = new SewerCameraActivity();
                data.Header = data.Header = Header.Where(x => x.Type == "SewerCameraHeaders" && x.Description == "Work Details").Select(x => new Header
                {
                    value = x.Value,
                    label = x.Text
                }).ToList();
            }else
            {
                
                data.Header = Header.Where(x => x.Type == "SewerCameraHeaders" && x.Description == "Work Details").Select(x => new Header
                {
                    value = x.Value,
                    label = x.Text
                }).ToList();
            }
            

            return data;
            



        }
        public async Task<SewerCamDetailList> GetSewerCameraDetails(long Id, string flag, List<LookUp> Header)
        {
            var sewerCamDetails = new SewerCamDetailList();
            sewerCamDetails.SewerCamDetail = await (from swc in DbContext.SewerCam.Where(x=>x.JobId == Id).DefaultIfEmpty() join swrd in DbContext.SewerCamDetails.DefaultIfEmpty() on swc.Id equals swrd.SewerCamId
                                     join lkp in DbContext.LookUp.Where(x => x.IsActive == true && x.Value.ToLower().Trim() == flag)
                                     on swrd.SewerCamTypeId equals lkp.Id
                                     select new SewerCamDetail
                                     {
                                         SewerCamDetailsType = lkp.Value,
                                         Location = swrd.Location,
                                         Feet = (swrd.Feet == null || swrd.Feet == "") ? "0" : swrd.Feet

                                     }).ToListAsync();
            sewerCamDetails.Header = Header.Where(x => x.Type == "SewerCameraHeaders" && x.Description?.ToLower().Trim() == flag).Select(x => new Header
            {
                value = x.Value,
                label = x.Text
            }).ToList();
            sewerCamDetails.Total = sewerCamDetails.SewerCamDetail.Select(x => Int32.Parse(x.Feet??"0")).Sum();
            return sewerCamDetails;
        }
        public List<Header> GetHeaders(string type, List<LookUp> header)
        {
            return  header.Where(x => x.Type.ToLower() == type.ToLower()).Select(x => new Core.Responses.JobActivity.Header
            {
                value = x.Value,
                label = x.Text
            }).ToList();
        }

        public async Task<List<Body>> GetBodyPayItem(long JobId, bool flag)
        {
            
            var body =  await DbContext.JobPayItem.Where(x => x.JobmasterId == JobId).Select(x => new Body
            {
                Id = x.Id,
                Payitem = x.PayItem,
                Description = x.Description ?? "",
                Quantity = x.Quantity ?? 0,
                wo = x.WO ?? "",
                Location = x.Address + ", " + x.City + ", " + x.State,
                IsTandM = x.IsTandM,
            }).ToListAsync();
            body = body.Where(x => x.IsTandM == flag).ToList();
            return body;
        }
        public async Task<List<Body>> GetBodyLabour(long Id)
        {
            
            return await DbContext.JobLabour.Where(x => x.JobMasterId == Id).GroupBy(y=>y.EmployeeId).Select(x => new Body
            {
                Id = x.Select(z=>z.Id).First(),
                Employee = x.Select(z=>z.EmployeeName).First(),
                St = x.Select(z=>z.St).Sum() ?? 0,
                Ot = x.Select(z =>z.Ot).Sum() ?? 0,
                Dt = x.Select(z =>z.Dt).Sum() ?? 0,
            }).ToListAsync();
        }

        public async Task<List<Body>> GetEquipment(long Id)
        {
            return await DbContext.JobEquipment.Where(x => x.JobMasterId == Id).GroupBy(x=> new {x.EquipmentCode, x.EquipmentDescription }).Select(x => new Body
            {
                Equipment = x.Key.EquipmentCode,
                Description = x.Key.EquipmentDescription,
                Hours = x.Select(f=>f.Hours).Sum() ?? 0
            }).ToListAsync();
        }

        public async Task<List<CommentsDto>> GetComments(long Id)
        {
           return await DbContext.Comments.Where(x => x.JobMasterId == Id).Join(DbContext.LookUp, comment => comment.CommentId, lookup => lookup.Id, (comment, lookUp) => new CommentsDto
            {
                Id = comment.Id,
                CommentsFlag = lookUp.Value,
                comments = comment.Comment ?? ""
            }).ToListAsync();
        }

        public async Task<List<RejectionReasonDto>> GetRejectionStatus()
        {
           return await DbContext.LookUp.Where(x => x.Type.ToLower() == "reasontype" && x.Description.ToLower() == "cp").Select(x=> new RejectionReasonDto
            {
                Id = x.Id,
                RejectionReason = x.Value
            }).ToListAsync();
        }

        public async Task<ViewApprovalResponse> GetViewApproval(long Id) 
        {
            var response = new ViewApprovalResponse();
            var data = await (from status in DbContext.JobStatusTracking.Where(x => x.IsActive == true && x.JobId == Id) join lkp in DbContext.LookUp.Where(x => x.IsActive == true) on status.StatusId equals lkp.Id select new
            {
                Signature = status.Signature,
                Comment = status.Comment,
                RequesterName = status.RequesterName,
                Status = lkp.Value
            }).FirstOrDefaultAsync();
            if(data == null)
            {
                response.status = false;
                response.message = "Invalid Job";
                return response;
            }
            if(data.Status.ToLower() != "approved")
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


    }
}
