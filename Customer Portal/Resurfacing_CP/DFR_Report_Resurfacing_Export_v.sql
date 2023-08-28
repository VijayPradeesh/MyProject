

/****** Object:  View [dbo].[DFR_Report_Resurfacing_Export_v]    Script Date: 12-06-2023 09:45:25 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO





CREATE VIEW [dbo].[DFR_Report_Resurfacing_Export_v] 
AS 

	Select 
	SS.[ResurfacingMasterId]								as [ResurfacingId],	 
	M.JobNumber,
	M.JobStartDate											as JobDate,
	M.ForemanName,
	M.[Contract],
	M.WorkOrder												as [WO],		
	CONCAT(M.StreetAddress,', ',M.City,', ',M.State)		as [Address],
	[SurfaceType],
	[MaterialType],
	[Length],
	[Width],
	[Diameter],
	SS.[Type]												as [Type],
	[Depth],
	[Total],
	[Quantity],
	LT.[Value]												as [Status],
	M.IsSquareFeet											as [UOM]
	from

		(Select
		ResurfacingMasterId									as [ResurfacingMasterId],
		SurfaceType											as [SurfaceType],
		MaterialType										as [MaterialType],
		RestoredLength										as [Length],
		RestoredWidth										as [Width],
		RestoredDiameter									as [Diameter],
		RestoredType										as [Type],
		RestoredDepth										as [Depth],
		RestoredTotal										as [Total],
		RestoredCount										as [Quantity]
		from [dbo].[ResurfacingRestored_T] 

	Union All

		Select
		ResurfacingMasterId									as [ResurfacingMasterId],
		'Additional Material'								as [SurfaceType],
		AdditionalMaterial									as [MaterialType],
		null												as [Length],
		null												as [Width],
		null											    as [Diameter],
		null												as [Type],
		null												as [Depth],
		null												as [Total],
		Quantity											as [Quantity]
		from [dbo].[ResurfacingAdditionalMaterial_T])
	As SS

		inner join
			[CustomerPortal.Development].[dbo].[ResurfacingMaster_T] as M
		on M.ID=SS.ResurfacingMasterId

		inner join
		[CustomerPortal.Development].[dbo].[ResurfacingStatusTracking_T] as ST
		on M.ID=ST.ResurfacingMasterId and ST.Active=1

		inner join 
		[dbo].[Lookup_T] as LT
		on ST.StatusID = LT.ID
		and LT.Active=1

GO


