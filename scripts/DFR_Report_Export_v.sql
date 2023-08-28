USE [CustomerPortal.Development]
GO

/****** Object:  View [dbo].[ReportGeneration_V]    Script Date: 15-02-2023 14:13:18 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO





CREATE VIEW [dbo].[DFR_Report_Export_v ] 
AS  
with comments as (

		Select		
			JobMasterID
			, CommentTypeID
			, CommentType
			, Comment_Title
			, Comment
		From dbo.Get_Comments_v with(nolock)

	)


	Select
		j.[ID]																as [JobId]
		, j.[ForemanName]
		, l.[Value]															as [Status]
		, j.[Contract]														as [Contract]
		--case when Tst.JobMasterID is null then '' else Tst.Comment end as ForemanComments ,
		, (select Comment from comments where CommentType = 'P' and JobMasterID = j.ID)	as [ForemanComments] -- Don't think this is accurate, these are comments based on Rev numbers?
		, (select Comment from comments where CommentType = 'E' and JobMasterID = j.ID)	as [EquipmentComments]	
		, (select Comment from comments where CommentType = 'L' and JobMasterID = j.ID)	as [LaborComments]
		, j.[JobNumber]
		, j.[JobStartDate]													as [JobDate]
		, r.[PayItem]
		, r.[Description]
		, isnull(r.WO, '')													as [WO]
		, isnull(r.PO, '')													as [PO]
		--case when revenue.WO is null then '' else  revenue.WO end as WO ,
		--case when revenue.PO is null then '' else  revenue.PO end as PO, 
		, r.Qty																as [Quantity]
		, CONCAT(r.Address, ', ', r.City, ', ', r.State)					as [Address]
		, r.UOM ,
		r.WbsDescription                                                    as WbsDescription		--, r.WbsDescription
		,'' ApproverComments	-- j.ApproverComments

	From dbo.JobMaster_T as j with(nolock)

	Left Join dbo.JobRevenue_T as r with(nolock) on 
		j.ID = r.JobMasterID

	Left Join dbo.DFRStatusTracking_T as s with(nolock) on 
		j.ID = s.JobMasterID

	Left Join dbo.Lookup_T as l with(nolock) on 
		s.StatusID = l.ID  

	where 
		s.Active = 1
GO


