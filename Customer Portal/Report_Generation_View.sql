USE [CustomerPortal.Development]
GO

/****** Object:  View [dbo].[ReportGeneration_V]    Script Date: 13-02-2023 16:13:32 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO




CREATE VIEW [dbo].[ReportGeneration_V] 
AS  
select
job.ID as JobId,
job.ForemanName as ForemanName,
lkp.Value as Status,
job.contract as Contract,
case when Tst.JobMasterID is null then '' else Tst.Comment end as ForemanComments ,
job.JobNumber as JobNumber, 
job.JobStartDate as JobDate, revenue.PayItem as PayItem, 
revenue.Description as Description,
case when revenue.WO is null then '' else  revenue.WO end as WO ,
case when revenue.PO is null then '' else  revenue.PO end as PO, 
revenue.Qty as Quantity, 
CONCAT(revenue.Address, ', ', revenue.City, ', ', revenue.State) as Address, 
revenue.UOM as UOM ,
revenue.WbsDescription as WbsDescription,
job.ApproverComments as ApproverComments
from JobMaster_T as job with(nolock)
left join JobRevenue_T as revenue with(nolock) on job.ID = revenue.JobMasterID
left join DFRStatusTracking_T as status with(nolock) on job.ID = status.JobMasterID
left join Lookup_T as lkp with(nolock) on status.StatusID = lkp.ID  
left outer join 
(select comments.JobMasterID as JobMasterId, lkp1.Value as Value, comments.Comment from Comment_T as comments with(nolock)
join Lookup_T as lkp1 with(nolock) on comments.CommentTypeID = lkp1.ID and lkp1.Value = 'P') as Tst
on Tst.JobMasterID = job.ID
where status.Active = 1
GO


