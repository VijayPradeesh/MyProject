using CustomerPortal.Services.Core.ApplicationDbContext;
using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.Reports;
using Microsoft.EntityFrameworkCore;

namespace CustomerPortal.Services.Repositories.ReportsRepo
{
    public class ReportsRepo : IReportsRepo
    {
        public ReportsRepo(CustomerPortalDbContext dbContext)
        {
            DbContext = dbContext;
        }
        public CustomerPortalDbContext DbContext { get; }
        public async Task<ReportResponse> GenerateReport(GenerateReportDto _generateReportsDto) {
            //var dt = new List<JobReportResponse>();
            // FromToDate = _generateReportsDto.FromDate.ToShortTimeString() + "-" + _generateReportsDto.ToDate.ToShortDateString();
            
            var reportResponse = new ReportResponse();
            var userData = await GetUserDetails(_generateReportsDto.UserId);
            var dt = new List<JobReportResponse>();
            if(userData != null && userData.Type.ToLower().Trim() == "mears")
            {
                if(userData.Role.ToLower().Trim() == "admin")
                {
                    dt = await DbContext.ReportGeneration.Where(y => y.JobDate >= _generateReportsDto.FromDate && y.JobDate <= _generateReportsDto.ToDate && y.Status != "deleted").Select(x => new JobReportResponse
                    {
                        JobId = x.JobId,
                        JobNumber = x.JobNumber,
                        JobDate = x.JobDate,
                        ForemanName = x.ForemanName,
                        PayItemName = x.PayItem,
                        PayItemDecsription = x.Description,
                        UOM = x.UOM,
                        Quantity = x.Quantity,
                        Status = x.Status,
                        PurchaseOrder = x.PO,
                        WorkOrder = x.WO,
                        Address = x.Address,
                        ContractNumber = x.ContractNumber,
                        ForemanComments = x.ForemanComments,
                        WBSDescription = x.WbsDescription
                    }).ToListAsync();
                }
                else
                {
                    dt = await (from x in DbContext.ReportGeneration.Where(y => y.JobDate >= _generateReportsDto.FromDate && y.JobDate <= _generateReportsDto.ToDate && y.Status != "deleted")
                                join crr in DbContext.ContractRegionMapping.Where(x => x.RegionId == userData.RegionId && x.IsActive == true) on x.ContractNumber equals crr.Contract
                                select new JobReportResponse
                                {
                                    JobId = x.JobId,
                                    JobNumber = x.JobNumber,
                                    JobDate = x.JobDate,
                                    ForemanName = x.ForemanName,
                                    PayItemName = x.PayItem,
                                    PayItemDecsription = x.Description,
                                    UOM = x.UOM,
                                    Quantity = x.Quantity,
                                    Status = x.Status,
                                    PurchaseOrder = x.PO,
                                    WorkOrder = x.WO,
                                    Address = x.Address,
                                    ContractNumber = x.ContractNumber,
                                    ForemanComments = x.ForemanComments,
                                    WBSDescription = x.WbsDescription
                                }
                               ).ToListAsync();
                }
                
            }else
            {
                if(userData != null)
                {
                    dt = await (from x in DbContext.ReportGeneration.Where(y => y.JobDate >= _generateReportsDto.FromDate && y.JobDate <= _generateReportsDto.ToDate && y.Status != "deleted")
                                join crr in DbContext.ContractRegionMapping.Where(x => x.CustomerId == userData.TypeId && x.IsActive == true) on x.ContractNumber equals crr.Contract
                                join urr in DbContext.UserRoleRegion.Where(x => x.UserId == _generateReportsDto.UserId && x.IsActive == true) on crr.RegionId equals urr.RegionId
                                select new JobReportResponse
                                {
                                    JobId = x.JobId,
                                    JobNumber = x.JobNumber,
                                    JobDate = x.JobDate,
                                    ForemanName = x.ForemanName,
                                    PayItemName = x.PayItem,
                                    PayItemDecsription = x.Description,
                                    UOM = x.UOM,
                                    Quantity = x.Quantity,
                                    Status = x.Status,
                                    PurchaseOrder = x.PO,
                                    WorkOrder = x.WO,
                                    Address = x.Address,
                                    ContractNumber = x.ContractNumber,
                                    ForemanComments = x.ForemanComments,
                                    WBSDescription = x.WbsDescription
                                }
                                ).ToListAsync();
                }
                
            }
            
            
            var woList = dt.Select(x => x.WorkOrder).DistinctBy(x=>x).ToList();
            var foremenList = dt.Select(x => x.ForemanName).DistinctBy(x => x).ToList();
            var StatusList = dt.Select(x => x.Status).DistinctBy(x => x).ToList();
            var ContractList = dt.Select(x => x.ContractNumber).DistinctBy(x => x).ToList();
            _generateReportsDto.ContractNumber = _generateReportsDto.ContractNumber == null || _generateReportsDto.ContractNumber == "" ? "all contract" : _generateReportsDto.ContractNumber;
            _generateReportsDto.DfrStatus = _generateReportsDto.DfrStatus == null || _generateReportsDto.DfrStatus == "" ? "all status" : _generateReportsDto.DfrStatus;
            if (_generateReportsDto.Foreman.Count != 0 )
            {
                dt = dt.Where(x => _generateReportsDto.Foreman.Any(y => y == x.ForemanName)).ToList();
            }
            if (_generateReportsDto.WorkOrder.Count != 0)
            {
                dt = dt.Where(x => _generateReportsDto.WorkOrder.Any(y => y == x.WorkOrder)).ToList();
            }
            if(_generateReportsDto.ContractNumber != "all contract")
            {
                dt = dt.Where(x => x.ContractNumber == _generateReportsDto.ContractNumber).ToList();
            }
            if (_generateReportsDto.DfrStatus != "all status")
            {
                dt = dt.Where(x => x.Status == _generateReportsDto.DfrStatus).ToList();
            }

            dt =  dt.OrderByDescending(x=>x.JobDate).ToList();
            reportResponse.StatusList = StatusList;
            reportResponse.ForemanList = foremenList;
            reportResponse.ContractList = ContractList;
            reportResponse.WOList = woList;
            reportResponse.ReportData = dt;
            return reportResponse;

        }

        private static string ReturnWoOrPo(string str, bool flag)
        {
            if (str.Contains('-'))
            {
                var st = str.Split("-");
                return flag ? st[0] : st[1];
            }
            else
            {
                return "";
            }

        }
        public async Task<ReportResponse> GenerateReportResurfacing(GenerateReportDto _generateReportsDto)
        {
            var reportResponse = new ReportResponse();
            var userData = await GetUserDetails(_generateReportsDto.UserId);
            var dt = new List<ResurfacingReportResponse>();
            if (userData != null && userData.Type.ToLower().Trim() == "mears" )
            {
                if (userData.Role.ToLower().Trim() == "admin")
                {
                    dt = await DbContext.ResurfacingReport.Where(y => y.JobDate >= _generateReportsDto.FromDate && y.JobDate <= _generateReportsDto.ToDate && y.Status != "deleted").Select(x => new ResurfacingReportResponse
                    {
                        JobId = x.JobId,
                        JobNumber = x.JobNumber,
                        JobDate = x.JobDate,
                        ContractNumber = x.ContractNumber,
                        ForemanName = x.ForemanName,
                        SurfaceType = x.SurfaceType,
                        MaterialType = x.MaterialType,
                        UOM = x.SurfaceType.ToLower().Trim() != "additional material" ? (ResurfacingMaterialTypeConfig.arr1d.Any(z => z == x.MaterialType.ToLower().Trim()) ? "Quantity" : (x.UOM ? "Sq. Feet" : "Cu. Yards")) : (ResurfacingMaterialTypeConfig.QuantDC.Any(y => y == x.MaterialType.ToLower().Trim()) ? "Cu. Yards" : "Quantity"),
                        Quantity = x.Quantity,
                        Status = x.Status,
                        PurchaseOrder = ReturnWoOrPo(x.WO, true),
                        WorkOrder = ReturnWoOrPo(x.WO, false),
                        Address = x.Address,
                        Length = x.Length,
                        Width = x.Width,
                        Depth = x.Depth,
                        Diameter = x.Diameter,
                        Type = x.Type,
                        Total = x.Total == null || x.Total == 0 ? (x.Quantity == null ? 0 : x.Quantity) : x.Total
                    }).ToListAsync();
                }
                else
                {
                    dt = await (from x in DbContext.ResurfacingReport.Where(y => y.JobDate >= _generateReportsDto.FromDate && y.JobDate <= _generateReportsDto.ToDate && y.Status != "deleted")
                                join crr in DbContext.ContractRegionMapping.Where(x => x.RegionId == userData.RegionId && x.IsActive == true) on x.ContractNumber equals crr.Contract
                                select new ResurfacingReportResponse
                                {
                                    JobId = x.JobId,
                                    JobNumber = x.JobNumber,
                                    JobDate = x.JobDate,
                                    ForemanName = x.ForemanName,
                                    SurfaceType = x.SurfaceType,
                                    ContractNumber = x.ContractNumber,
                                    MaterialType = x.MaterialType,
                                    UOM = x.SurfaceType.ToLower().Trim() != "additional material" ? (ResurfacingMaterialTypeConfig.arr1d.Any(z => z == x.MaterialType.ToLower().Trim()) ? "Quantity" : (x.UOM ? "Sq. Feet" : "Cu. Yards")) : (ResurfacingMaterialTypeConfig.QuantDC.Any(y => y == x.MaterialType.ToLower().Trim()) ? "Cu. Yards" : "Quantity"),
                                    Quantity = x.Quantity,
                                    Status = x.Status,
                                    PurchaseOrder = ReturnWoOrPo(x.WO, true),
                                    WorkOrder = ReturnWoOrPo(x.WO, false),
                                    Address = x.Address,
                                    Length = x.Length,
                                    Width = x.Width,
                                    Depth = x.Depth,
                                    Diameter = x.Diameter,
                                    Type = x.Type,
                                    Total = x.Total == null || x.Total == 0 ? (x.Quantity == null ? 0 : x.Quantity) : x.Total
                                }).ToListAsync();
                }

            }
            else
            {
                if (userData != null)
                {
                    dt = await (from x in DbContext.ResurfacingReport.Where(y => y.JobDate >= _generateReportsDto.FromDate && y.JobDate <= _generateReportsDto.ToDate && y.Status != "deleted")
                                join crr in DbContext.ContractRegionMapping.Where(x => x.CustomerId == userData.TypeId && x.IsActive == true) on x.ContractNumber equals crr.Contract
                                join urr in DbContext.UserRoleRegion.Where(x => x.UserId == _generateReportsDto.UserId && x.IsActive == true) on crr.RegionId equals urr.RegionId
                                select new ResurfacingReportResponse
                                {
                                    JobId = x.JobId,
                                    JobNumber = x.JobNumber,
                                    JobDate = x.JobDate,
                                    ForemanName = x.ForemanName,
                                    SurfaceType = x.SurfaceType,
                                    MaterialType = x.MaterialType,
                                    ContractNumber = x.ContractNumber,

                                    UOM = x.SurfaceType.ToLower().Trim() != "additional material" ? (ResurfacingMaterialTypeConfig.arr1d.Any(z=> z == x.MaterialType.ToLower().Trim()) ? "Quantity" : (x.UOM ? "Sq. Feet" : "Cu. Yards")) : (ResurfacingMaterialTypeConfig.QuantDC.Any(y => y == x.MaterialType.ToLower().Trim()) ? "Cu. Yards" : "Quantity"),

                                    Quantity = x.Quantity,
                                    Status = x.Status,
                                    PurchaseOrder = ReturnWoOrPo(x.WO, true),
                                    WorkOrder = ReturnWoOrPo(x.WO, false),
                                    Address = x.Address,
                                    Length = x.Length,
                                    Width = x.Width,
                                    Depth = x.Depth,
                                    Diameter = x.Diameter,
                                    Type = x.Type,
                                    Total = x.Total == null || x.Total == 0 ? (x.Quantity == null ? 0 : x.Quantity) : x.Total
                                }).ToListAsync();
                }

            }


            var woList = dt.Select(x => x.WorkOrder).DistinctBy(x => x).ToList();
            var foremenList = dt.Select(x => x.ForemanName).DistinctBy(x => x).ToList();
            var StatusList = dt.Select(x => x.Status).DistinctBy(x => x).ToList();
            var ContractList = dt.Select(x => x.ContractNumber).DistinctBy(x => x).ToList();
            _generateReportsDto.ContractNumber = _generateReportsDto.ContractNumber == null || _generateReportsDto.ContractNumber == "" ? "all contract" : _generateReportsDto.ContractNumber;
            _generateReportsDto.DfrStatus = _generateReportsDto.DfrStatus == null || _generateReportsDto.DfrStatus == "" ? "all status" : _generateReportsDto.DfrStatus;
            if (_generateReportsDto.Foreman.Count != 0)
            {
                dt = dt.Where(x => _generateReportsDto.Foreman.Any(y => y == x.ForemanName)).ToList();
            }
            if (_generateReportsDto.WorkOrder.Count != 0)
            {
                dt = dt.Where(x => _generateReportsDto.WorkOrder.Any(y => y == x.WorkOrder)).ToList();
            }
            if (_generateReportsDto.ContractNumber != "all contract")
            {
                dt = dt.Where(x => x.ContractNumber == _generateReportsDto.ContractNumber).ToList();
            }
            if (_generateReportsDto.DfrStatus != "all status")
            {
                dt = dt.Where(x => x.Status == _generateReportsDto.DfrStatus).ToList();
            }

            dt = dt.OrderByDescending(x => x.JobDate).ToList();
            reportResponse.StatusList = StatusList;
            reportResponse.ForemanList = foremenList;
            reportResponse.ContractList = ContractList;
            reportResponse.WOList = woList;
            reportResponse.ResurfacingReportData = dt;
            return reportResponse;
        }
        public async Task<UserRoleDto?> GetUserDetails(long Id)
        {
            return await (from user in DbContext.Users.Where(x => x.UserId == Id)
                          join role in DbContext.UserRoleRegion.Where(x=>x.IsActive == true) on user.UserId equals role.UserId
                          join trm in DbContext.RoleTypeMapping.Where(x=>x.IsActive == true) on role.TypeRoleId equals trm.Id
                          join lookup in DbContext.LookUp.Where(x=>x.IsActive == true) on trm.RoleId equals lookup.Id
                          join lookup1 in DbContext.LookUp.Where(x=>x.IsActive == true) on trm.TypeId equals lookup1.Id
                          select new UserRoleDto
                          {
                              Username = user.UserName,
                              Role = lookup.Value,
                              Type = lookup1.Value,
                              TypeId = lookup1.Id,
                              RegionId = role.RegionId
                          }).FirstOrDefaultAsync();
        }
    }
}
