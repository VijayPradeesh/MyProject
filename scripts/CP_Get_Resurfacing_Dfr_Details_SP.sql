USE [CrewLink.Prod.FEB2023.01]
GO
/****** Object:  StoredProcedure [dbo].[CP_Get_Resurfacing_DFR_Details_SP]    Script Date: 16-05-2023 07:53:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================================================
-- Author:		
-- Create date: 
-- Description:	Pull Crew Link Resurfacing Data DFR for Customer Portal

-- =============================================================================

Alter PROCEDURE [dbo].[CP_Get_Resurfacing_DFR_Details_SP]
	-- Add the parameters for the stored procedure here
	@ResurfacingID bigint, 
	@Status nvarchar(255) = Null,
	@CLComment varchar(max) = Null,
	@CLUserID bigint,
	@Debug bit = 0
AS
BEGIN
/*=================================== Tests ====================================

	Exec [dbo].[CP_Get_Resurfacing_DFR_Details_SP]
		@ResurfacingID = 10784
		, @Status = 'Pending'
		, @CLComment = 'testing'
		, @CLUserID = 45
		, @Debug = 1


==============================================================================*/

/*********************************** SETUP ************************************/

	If @Debug = 0 Begin
		-- SET NOCOUNT ON added to prevent extra result sets from
		-- interfering with SELECT statements.
		SET NOCOUNT ON;
		SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED; --nolock
	End 

	If @Debug = 1 Print '-- Prevent Parameter Sniffing and Create Variables --'
	Declare 
		@_ResurfacingID bigint		= @ResurfacingID
		, @_StatusID bigint
		, @_Status varchar(255)		= @Status
		, @_CLComment varchar(max)	= @CLComment
		, @_CLUserID bigInt			= @CLUserID
		, @_CLUserName varchar(50)
		, @_CLUserRole varchar(50)
		, @NoRegionId bigint
		, @NoCompanyId bigint		--- No Company
		, @SVCACCT bigint
		, @CLReasonType bigint
		, @ErrorMSG varchar(250)
/*==============================================================*/

	If @Debug = 1 Print 'Drop / Create tmp table'

	If OBJECT_ID('tempdb..#tmp_Resurfacing') is not null 
	Drop Table #tmp_Resurfacing;

	Create Table #tmp_Resurfacing
	(
		[ResurfacingID]				bigint not null
		, [CompanyCode]				nvarchar(10) not null
		, [JobNumber]				nvarchar(10) not null
		, [JobStartDate]			datetime not null
		, [Contract]				varchar(50) not null
		, [ForemanID]				int not null
		, [ForemanName]				varchar(80) not null
		, [ForemanRole]				varchar(50) not null
		, [ApproverID]				int not null
		, [ApproverName]			varchar(80) not null
		, [ApproverRole]			varchar(50) not null
		, [ApproverEmail]			varchar(255)
		, [StreetAddress]			nvarchar(50)
		, [WorkOrder]				nvarchar(50) not null
		, [City]					nvarchar(50) not null
		, [State]					nvarchar(20) not null
		, [BacklogWorkDate]			datetime
		, [TrafficControl]			bit 
		, [CustomerComplaint]		bit 
		, [Comments]				nvarchar(400)
		, [CLModifiedOn]			datetime   		 	  
		, [ResurfacingMasterID]		bigint Null
	)

	

--------------------------------------------------------------------------------
-- Get Status defaults to Pending if nothing provided
--------------------------------------------------------------------------------

	If (nullif(trim(@_Status),'') is null) Begin
		If @Debug = 1 Print '--> Set Status ID to Pending if no status is provided'

		Select 
			@_StatusID = [ID]
		From [CustomerPortal.Development].[dbo].[Lookup_T]
		Where
			[Type] = 'DFRStatus'
			and [Value] = 'Pending'
			and Active = 1
	End
	Else Begin

		Select 
			@_StatusID = [ID]
		From [CustomerPortal.Development].[dbo].[Lookup_T]
		Where
			[Type] = 'DFRStatus'
			and [Value] = @_Status
			and [Active] = 1

		If nullif(@_StatusID,0) is null Begin
			set @ErrorMSG = concat('Cannot map Status ID based on what was provided from Crewlink - ', isnull(@_Status, 'No Status passed'));

			RAISERROR(@ErrorMSG, 17,1)
		End

	End

--------------------------------------------------------------------------------
-- Added by details
--------------------------------------------------------------------------------

	If @Debug = 1 Print '--> Get CL Username'
	Select
		@_CLUserName = [USER_NAME]
	From
		[dbo].[CL_USER]
	Where
		[USER_ID] = @_CLUserID


	If @Debug = 1 Print '--> Get CL User Role'
	Select
		@_CLUserRole = B.[USER_ROLE_NAME]
	From
		[dbo].[CL_USER] A

	Join [dbo].[CL_USER_ROLES_T] B on
		A.[USER_ROLE_ID] = B.[USER_ROLE_ID]
		and b.[ISACTIVE] = 1
		
	Where
		[USER_ID] = @_CLUserID

--------------------------------------------------------------------------------
-- Misc Settings
--------------------------------------------------------------------------------

	If @Debug = 1 Print '--> Set No Region ID'
	Select
		@NoRegionId = [ID]
	From [CustomerPortal.Development].[dbo].[Lookup_T]
	Where
		[Type] = 'ContractRegion'
		and [Value] = 'No Region'
		and [Active] = 1

	Select 
		@NoCompanyId = [ID]
	From [CustomerPortal.Development].[dbo].[Lookup_T]
	Where
		[Type] = 'Company'
		and [Value] = 'No Company'
		and [Active] = 1

	If @Debug = 1 Print '--> Get Svc account for Region Mapping'
	Select
		@SVCACCT = ID
	From [CustomerPortal.Development].[dbo].[User_T]
	Where
		[Username] = 'CustomerPortalSVC'
		and [Active] = 1

	If @Debug = 1 Print '--> Get ReasonTypeID for DFR Status Tracking'
	Select
		@CLReasonType = [ID]
	From [CustomerPortal.Development].[dbo].[Lookup_T]
	Where
		[Type] = 'ReasonType'
		and [Value] = 'CrewLink'
		and [Active] = 1

--------------------------------------------------------------------------------
-- Query variables
--------------------------------------------------------------------------------

	If @Debug = 1 Begin
		Print '--> Return Variables for debugging'
		
		Select
			@_ResurfacingID			[ResurfacingId]
			, @_StatusID	[StatusID]
			, @_Status		[Status]
			, @CLReasonType [ReasonType]
			, @_CLComment	[CLComment]
			, @_CLUserID	[CLUserID]
			, @_CLUserName	[CLUsername]
			, @_CLUserRole	[CLUserRole]
			, @NoRegionId	[NoRegionID]
			, @NoCompanyId  [NoCompanyID]
			, @SVCACCT		[SVCACCT]

	End
/******************************* END SETUP ************************************/
--------------------------------------------------------------------------------
-----> JobMaster_T
--------------------------------------------------------------------------------
	
	If @Debug = 1 Print '--> Get Job Master Data'
	Insert into #tmp_Resurfacing
	(
		[ResurfacingID]
		, [CompanyCode]
		, [JobNumber]
		, [JobStartDate]
		, [Contract]
		, [ForemanID]
		, [ForemanName]
		, [ForemanRole]
		, [ApproverID]
		, [ApproverName]
		, [ApproverRole]
		, [ApproverEmail]
		, [StreetAddress]
		, [WorkOrder]
		, [City]
		, [State]
		, [BacklogWorkDate]
		, [TrafficControl]
		, [CustomerComplaint]
		, [Comments]
		, [CLModifiedOn]
		, [ResurfacingMasterID]
	)

	Select
		J.[CL_RESURFACING_ID]				as [ResurfacingID]
		, JM.[COMPANY_CODE]					as [CompanyCode]
		, JM.[JOB_NUMBER]					as [JobNumber]
		, J.[JOB_START_DATE]				as [JobStartDate]
		, JM.[CONTRACT_NUMBER]				as [Contract]

		, J.[USER_ID]						as [ForemanID]
		, FE.[EMPLOYEE_NAME]				as [ForemanName]
		, FUR.[USER_ROLE_NAME]				as [ForemanRole]

		, LDU.[USER_ID]						as [ApproverID]
		, SE.[EMPLOYEE_NAME]				as [ApproverName]
		, AUR.[USER_ROLE_NAME]				as [ApproverRole]
		, NULL								as [ApproverEmail]					
		
		,j.[STREET_ADDRESS]					as [StreetAddress]
		,j.WORK_ORDER						as [WorkOrder]
		,CM.CITY_CODE					    as [City]
		,CM.STATE_CODE						as [State]
		,j.BACKLOG_WORK_DATE				as [BackLogWorkDate]
		,j.TRAFFIC_CONTROL					as [TrafficControl]
		,j.CUSTOMER_COMPLAINT				as [CustomerComplaint]
		,CR.COMMENT_DESC					as [Comments]
		, j.[MODIFIED_ON]					as [CLModifiedOn]
		, CPJ.[ID]							as [ResurfacingMasterID]

	From [dbo].[CL_RESURFACING_T]					J 

	Join [dbo].[WI_JOB_MASTER_T]					JM on
		J.[WI_JOB_ID] = JM.[WI_JOB_ID]

	Join [dbo].[CL_USER]							FU on 
		J.[USER_ID] = FU.[USER_ID]

	Join [dbo].[WI_EMPLOYEE_MASTER_T]				FE on 
		FE.[WI_EMPLOYEE_ID] = FU.[WI_EMPLOYEE_ID]

	Join [dbo].[WI_EMPLOYEE_MASTER_T]				SE on 
		JM.[SUPERINTENDENT] = SE.[EMPLOYEE_ID]

	Join [dbo].[CL_USER]							LDU on 
		SE.[WI_EMPLOYEE_ID] = LDU.[WI_Employee_ID]

	Left Join [dbo].[CL_USER_ROLES_T]				FUR on
		FU.[USER_ROLE_ID] = FUR.[USER_ROLE_ID]
		and FUR.[ISACTIVE] = 1

	Left Join [dbo].[CL_USER_ROLES_T]				AUR on
		LDU.[USER_ROLE_ID] = AUR.[USER_ROLE_ID]
		and AUR.[ISACTIVE] = 1


	Left Join [CustomerPortal.Development].[dbo].[ResurfacingMaster_T]	CPJ on
		J.[CL_RESURFACING_ID] = CPJ.[ResurfacingId]
		and CPJ.[Active] = 1

	Join [dbo].[WI_CITYCODE_MASTER_T]						CM  on
		cm.WI_CITY_ID = j.WI_CITY_ID

	Left Join [dbo].[CL_COMMENT_T]					CR on 
		CR.RESURFACING_ID = j.CL_RESURFACING_ID and CR.COMMENT_TYPE = 'F'

	Outer Apply (
	Select top 1 IS_COMPLETED as IS_COMPLETED from [dbo].[CL_JOB_SURFACES_RESTORED_T] 
	where IS_COMPLETED = 0 and CL_RESURFACING_ID = @_ResurfacingID) as	COMP

	

	Where 
		J.[JOB_STATUS_ID] in (1,5,7) -- 1 = Pending, 7 = Reviewed

		and J.[CL_RESURFACING_ID] = @_ResurfacingID

		and isnull(comp.IS_COMPLETED,1) <> 0


	-- Exit Script if no data exists in temp
	If Not Exists(select 1 From #tmp_Resurfacing) Begin

		set @ErrorMSG = concat('Job is not active ', @_ResurfacingID);

		RAISERROR(@ErrorMSG, 17,1)

	end

	If @Debug = 1 Begin
		Print '--> Return Temp table'
		Select * From #tmp_Resurfacing

	End
	Else Begin

		If Exists(select 1 from #tmp_Resurfacing where ResurfacingMasterID is not null) Begin

			Update A
			set
				[CompanyCode]		= B.[CompanyCode]
				, [JobNumber]		= B.[JobNumber]
				, [JobStartDate]	= B.[JobStartDate]
				, [Contract]		= B.[Contract]
				, [ForemanID]		= B.[ForemanID]
				, [ForemanName]		= B.[ForemanName]
				, [ForemanRole]		= B.[ForemanRole] 
				, [ApproverID]		= B.[ApproverID]
				, [ApproverName]	= B.[ApproverName]
				, [ApproverRole]	= B.[ApproverRole]
				, [ApproverEmail]	= B.[ApproverEmail]
				, [StreetAddress]   = B.[StreetAddress]
				, [WorkOrder]       = B.[WorkOrder]
				, [City]			= B.[City]
				, [State]			= B.[State]
				, [BacklogWorkDate] = B.[BacklogWorkDate]
				, [TrafficControl]  = B.[TrafficControl]
				, [CustomerComplaint] = B.[CustomerComplaint]
				, [Comments]         = B.[Comments]
				, [CLModifiedOn]	= B.[CLModifiedOn]
			
			From [CustomerPortal.Development].[dbo].[ResurfacingMaster_T] A
			Join #tmp_Resurfacing B on
				a.ResurfacingId = b.ResurfacingID

		End 
		Else Begin

			Insert into [CustomerPortal.Development].[dbo].[ResurfacingMaster_T]
			(ResurfacingId, CompanyCode, JobNumber, JobStartDate, [Contract],ForemanID,ForemanName,ForemanRole,ApproverID, ApproverName, ApproverRole,ApproverEmail,StreetAddress, WorkOrder,City,[State], BacklogWorkDate, TrafficControl, CustomerComplaint,Comments,CLModifiedOn)
			Select
				[ResurfacingID], [CompanyCode], [JobNumber], [JobStartDate], [Contract], [ForemanID], [ForemanName], [ForemanRole], [ApproverID], [ApproverName], [ApproverRole], [ApproverEmail],[StreetAddress], [WorkOrder], [City], [State], [BacklogWorkDate], [TrafficControl], [CustomerComplaint], [Comments], [CLModifiedOn]
			From #tmp_Resurfacing

		End

		If @Debug = 1 Print '--> Update #tmp_Resurfacing with  ResurfacingMaster ID'
		Update a
		Set
			[ResurfacingMasterID] = [ID] 
		From #tmp_Resurfacing a
		Join [CustomerPortal.Development].[dbo].[ResurfacingMaster_T] b on
			a.[ResurfacingID] = b.[ResurfacingId]
		Where
			a.[ResurfacingMasterID] is null
	End

--------------------------------------------------------------------------------
-----> ContractRegionMapping_T
--------------------------------------------------------------------------------

	If Not Exists(Select 1 from #tmp_Resurfacing a Join [CustomerPortal.Development].[dbo].[ContractRegionMapping_T] b on a.[Contract] = b.[Contract] Where b.[Active] = 1) Begin

		If @Debug = 1 Begin
			Print '--> Insert New Contract with no region mapping'

			Select
				[Contract]		[Contract]
				, @NoRegionId	[RegionID]
				, @NoCompanyId  [NoCompanyID]
				, @SVCACCT		[AddedBy]
			From #tmp_Resurfacing

		End
		Else Begin

			Insert into [CustomerPortal.Development].[dbo].[ContractRegionMapping_T]
			([Contract], [RegionID],[CompanyId], [AddedBy])
			Select
				[Contract]
				, @NoRegionId
				, @NoCompanyId -- Inserting no company
				, @SVCACCT
			From #tmp_Resurfacing

			--------------------------------------------------------------------
			--	Who / How are we going to notify if there is a new contract?
			--------------------------------------------------------------------

		End
	End

--------------------------------------------------------------------------------
----->  ResurfacingRestored_T
--------------------------------------------------------------------------------

	If @Debug = 1 Begin
		Print '---> Get ResurfacingRestored_T'

		select 
			TMP.ResurfacingMasterID             as [ResurfacingMasterId]
			,STM.SURFACE_TYPE_NAME			    as [SurfaceType]
			, MTM.MATERIAL_TYPE_NAME			as [MaterialType]
			
			, JSR.ORIGINAL_LENGTH				as [OriginalLength]
			, JSR.ORIGINAL_WIDTH				as [OriginalWidth]
			, JSR.ORIGINAL_DEPTH				as [OriginalDepth]
			, JSR.ORIGINAL_DIAMETER				as [OriginalDiameter]
			, JSR.ORIGINAL_COUNT				as [OriginalCount]
			, JSR.ORIGINAL_TYPE					as [OriginalType]
			, JSR.ORIGINAL_TOTAL				as [OriginalTotal]

			, JSR.RESTORED_LENGTH				as [RestoredLength]
			, JSR.RESTORED_WIDTH				as [RestoredWidth]
			, JSR.RESTORED_DEPTH				as [RestoredDepth]
			, JSR.RESTORED_DIAMETER				as [RestoredDiameter]
			, JSR.RESTORED_COUNT				as [RestoredCount]
			, JSR.RESTORED_TYPE					as [RestoredType]
			, JSR.RESTORED_TOTAL				as [RestoredTotal]

			, JSR.IS_COMPLETED					as [IsCompleted]
			, JSR.MODIFIED_ON					as [CLModifiedOn]

			from [dbo].[CL_JOB_SURFACES_RESTORED_T] as JSR 

		Join [dbo].[CL_SURFACE_TYPE_MASTER_T]       as STM on 
			jsr.CL_SURFACE_TYPE_ID = STM.CL_SURFACE_TYPE_ID

		Join [dbo].[CL_MATERIAL_TYPE_MASTER_T]      as MTM on 
			JSR.CL_MATERIAL_TYPE_ID = MTM.CL_MATERIAL_TYPE_ID

		Join #tmp_Resurfacing                       as TMP on 
			JSR.CL_RESURFACING_ID = TMP.ResurfacingID

		Where JSR.ISACTIVE = 1 

		Order by JSR.CL_RESURFACING_ID Desc

		

	End
	Else Begin

		--> Delete any info if exists to reinsert
		If Exists( Select 1 From [CustomerPortal.Development].[dbo].[ResurfacingMaster_T] a Join [CustomerPortal.Development].[dbo].[ResurfacingRestored_T] b on a.[ID] = b.ResurfacingMasterId Where a.[Active] = 1) Begin

			Delete a
			From [CustomerPortal.Development].[dbo].[ResurfacingRestored_T]	a 
			Join #tmp_Resurfacing								b on 
				a.[ResurfacingMasterId] = b.[ResurfacingMasterID]

		End

		Insert into [CustomerPortal.Development].[dbo].[ResurfacingRestored_T]
		([ResurfacingMasterId], [SurfaceType], [MaterialType], [OriginalLength], [OriginalWidth], [OriginalDepth], [OriginalDiameter], [OriginalCount],
		[OriginalType], [OriginalTotal], [RestoredLength], [RestoredWidth], [RestoredDepth], [RestoredDiameter], [RestoredCount], [RestoredType], [RestoredTotal], [IsCompleted], [CLModifiedOn])

		select 
			TMP.ResurfacingMasterID             as [ResurfacingMasterId]
			,STM.SURFACE_TYPE_NAME			    as [SurfaceType]
			, MTM.MATERIAL_TYPE_NAME			as [MaterialType] 						
			, JSR.ORIGINAL_LENGTH				as [OriginalLength]
			, JSR.ORIGINAL_WIDTH				as [OriginalWidth]
			, JSR.ORIGINAL_DEPTH				as [OriginalDepth]
			, JSR.ORIGINAL_DIAMETER				as [OriginalDiameter]
			, JSR.ORIGINAL_COUNT				as [OriginalCount]
			, JSR.ORIGINAL_TYPE					as [OriginalType]
			, JSR.ORIGINAL_TOTAL				as [OriginalTotal]
			, JSR.RESTORED_LENGTH				as [RestoredLength]
			, JSR.RESTORED_WIDTH				as [RestoredWidth]
			, JSR.RESTORED_DEPTH				as [RestoredDepth]
			, JSR.RESTORED_DIAMETER				as [RestoredDiameter]
			, JSR.RESTORED_COUNT				as [RestoredCount]
			, JSR.RESTORED_TYPE					as [RestoredType]
			, JSR.RESTORED_TOTAL				as [RestoredTotal]
			, JSR.IS_COMPLETED					as [IsCompleted]
			, JSR.MODIFIED_ON					as [CLModifiedOn]

			from [dbo].[CL_JOB_SURFACES_RESTORED_T] as JSR 

		Join [dbo].[CL_SURFACE_TYPE_MASTER_T]       as STM on 
			jsr.CL_SURFACE_TYPE_ID = STM.CL_SURFACE_TYPE_ID

		Join [dbo].[CL_MATERIAL_TYPE_MASTER_T]      as MTM on 
			JSR.CL_MATERIAL_TYPE_ID = MTM.CL_MATERIAL_TYPE_ID

		Join #tmp_Resurfacing                       as TMP on 
			JSR.CL_RESURFACING_ID = TMP.ResurfacingID

		Where JSR.ISACTIVE = 1

		Order by JSR.CL_RESURFACING_ID Desc
	End

--------------------------------------------------------------------------------
-----> ResurfacingAdditionalMaterials_T
--------------------------------------------------------------------------------

	If @Debug = 1 Begin
		Print '---> Get ResurfacingAdditionalMaterials_T'

		Select 
			TMP.ResurfacingMasterID				as [ResurfacingMasterId]
			, AMM.ADD_MATERIAL_NAME				as [AdditionalMaterial]
			, JAM.QTY							as [Quantity]
			, JAM.MODIFIED_ON					as [CLModifiedOn]		

		from [dbo].[CL_JOB_ADD_MATERIAL_T]		as JAM

		Join [dbo].[CL_ADD_MATERIAL_MASTER_T]   as AMM on 
			JAM.CL_ADD_MATERIAL_ID = AMM.CL_ADD_MATERIAL_ID

		Join #tmp_Resurfacing					as TMP on 
			JAM.CL_RESURFACING_ID = TMP.ResurfacingID

		where JAM.ISACTIVE = 1

		Order by JAM.CL_ADD_MATERIAL_ID desc


		
	End
	Else Begin

		--> Delete any info if exists to reinsert
		If Exists( Select 1 From [CustomerPortal.Development].[dbo].[ResurfacingMaster_T] a Join [CustomerPortal.Development].[dbo].[ResurfacingAdditionalMaterial_T] b on a.[ID] = b.[ResurfacingMasterId] Where a.[Active] = 1) Begin

			Delete a
			From [CustomerPortal.Development].[dbo].[ResurfacingAdditionalMaterial_T]	a 
			Join #tmp_Resurfacing							b on 
				a.[ResurfacingMasterId] = b.[ResurfacingMasterID]
		End

		Insert into [CustomerPortal.Development].[dbo].[ResurfacingAdditionalMaterial_T]
		([ResurfacingMasterId],[AdditionalMaterial], [Quantity], [CLModifiedOn])

		Select 
			TMP.ResurfacingMasterID				as [ResurfacingMasterId]
			, AMM.ADD_MATERIAL_NAME				as [AdditionalMaterial]
			, JAM.QTY							as [Quantity]
			, JAM.MODIFIED_ON					as [CLModifiedOn]		

		from [dbo].[CL_JOB_ADD_MATERIAL_T]		as JAM

		Join [dbo].[CL_ADD_MATERIAL_MASTER_T]   as AMM on 
			JAM.CL_ADD_MATERIAL_ID = AMM.CL_ADD_MATERIAL_ID

		Join #tmp_Resurfacing					as TMP on 
			JAM.CL_RESURFACING_ID = TMP.ResurfacingID

		where JAM.ISACTIVE = 1

		Order by JAM.CL_ADD_MATERIAL_ID desc
	End

--------------------------------------------------------------------------------
-----> ResurfacingDrawingImages_T
--------------------------------------------------------------------------------

	If @Debug = 1 Begin
		Print '---> Get ResurfacingDrawingImages_T'

		Select  
		TMP.ResurfacingMasterID         as [ResurfacingMasterId]
		, RDI.[IMAGE_DATA]				as [Image]
		, RDI.[IMAGE_ORDER]				as [ImageOrder]
		, RDI.MODIFIED_ON				as [ClModifiedOn]
		from [P360_IMAGES].[P360_Images_IFS_UAT].[dbo].[CrewLink_Drawing_Images] as RDI

		Join #tmp_Resurfacing as TMP on 
			RDI.RESURFACING_ID = TMP.ResurfacingID


	End
	Else Begin

		--> Delete any info if exists to reinsert
		If Exists( Select 1 From [CustomerPortal.Development].[dbo].[ResurfacingMaster_T] a Join [CustomerPortal.Development].[dbo].[ResurfacingDrawingImages_T] b on a.ID = b.[ResurfacingMasterId] Where a.[Active] = 1) Begin

			Delete a
			From [CustomerPortal.Development].[dbo].[ResurfacingDrawingImages_T]	a 
			Join #tmp_Resurfacing									b on 
				a.[ResurfacingMasterId] = b.[ResurfacingMasterID]
		End

		Insert into [CustomerPortal.Development].[dbo].[ResurfacingDrawingImages_T]
		([ResurfacingMasterId], [Image], [ImageOrder], [CLModifiedOn])

		Select  
		TMP.ResurfacingMasterID			as [ResurfacingMasterId]
		, RDI.[IMAGE_DATA]				as [Image]
		, RDI.[IMAGE_ORDER]				as [ImageOrder]
		, RDI.MODIFIED_ON				as [ClModifiedOn]

		from [P360_IMAGES].[P360_Images_IFS_UAT].[dbo].[CrewLink_Drawing_Images] as RDI

		Join #tmp_Resurfacing													 as TMP on 
			RDI.RESURFACING_ID = TMP.ResurfacingID
		
	End
--------------------------------------------------------------------------------
-----> ResurfacingStatusTracking_T
--------------------------------------------------------------------------------

	If @Debug = 1 Begin
		Print '---> ResurfacingStatusTracking_T'

		Select
			[ResurfacingMasterID]	[ResurfacingMasterId]
			, @_StatusID	[StatusID]
			, @CLReasonType [ReasonType]
			, @_CLComment	[Comment]
			, @_CLUserID	[CLUserID]
			, @_CLUserName	[CLUsername]
			, @_CLUserRole	[CLUserRole]
		From #tmp_Resurfacing

	End
	Else Begin

		--> Inactive current status if there is one
		If Exists( Select 1 From [CustomerPortal.Development].[dbo].[ResurfacingMaster_T] a Join [CustomerPortal.Development].[dbo].[ResurfacingStatusTracking_T] b on a.ID = b.[ResurfacingMasterId] Where a.[Active] = 1 and b.[Active] = 1 ) Begin

			Update a
			set	
				[Active]			= 0
				, [ChangedBy]		= @_CLUserID
				, [ChangedDate]		= GETDATE()
			From [CustomerPortal.Development].[dbo].[ResurfacingStatusTracking_T]	a 
		
			Join #tmp_Resurfacing									b on 
				a.ResurfacingMasterId = b.[ResurfacingMasterID]

			Where 
				a.[Active] = 1

		End

		Insert into [CustomerPortal.Development].[dbo].[ResurfacingStatusTracking_T]
		(ResurfacingMasterId, [StatusID], [ReasonTypeID], [Comment], [CLUserId], [CLUsername], [CLUserRole])
		
		Select
			[ResurfacingMasterID]	[ResurfacingMasterId]
			, @_StatusID	[StatusID]
			, @CLReasonType [ReasonTypeID]
			, @_CLComment	[Comment]
			, @_CLUserID	[CLUserID]
			, @_CLUserName	[CLUsername]
			, @_CLUserRole	[CLUserRole]
		From #tmp_Resurfacing

	End

END