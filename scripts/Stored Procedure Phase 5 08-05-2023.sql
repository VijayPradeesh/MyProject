USE [CrewLink.Prod.FEB2023.01]
GO
/****** Object:  StoredProcedure [dbo].[CP_Get_Job_DFR_Details_SP]    Script Date: 08-05-2023 16:41:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================================================
-- Author:		Chris Carlsen
-- Create date: 2022-11-29 12:30:15.738
-- Description:	Pull Crew Link Job Data DFR for Customer Portal
-- Sewer Camera Related Changes: Line no: 61 and 767
-- =============================================================================

ALTER PROCEDURE [dbo].[CP_Get_Job_DFR_Details_SP]
	-- Add the parameters for the stored procedure here
	@JobID bigint, 
	@Status nvarchar(255) = Null,
	@CLComment varchar(max) = Null,
	@CLUserID bigint,
	@Debug bit = 0
AS
BEGIN
/*=================================== Tests ====================================

	Exec [dbo].[CP_Get_Job_DFR_Details_SP]
		@JobID = 848006
		, @Status = 'Pending'
		, @CLComment = 'testing void functionality'
		, @CLUserID = 45
		, @Debug = 1

	Select * From customerportal.dbo.lookup_t

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
		@_JobID bigint = @JobID
		, @_StatusID bigint
		, @_Status varchar(255) = @Status
		, @_CLComment varchar(max) = @CLComment
		, @_CLUserID bigInt = @CLUserID
		, @_CLUserName varchar(50)
		, @_CLUserRole varchar(50)
		, @NoRegionId bigint
		, @NoCompanyId bigint --- No Company
		, @SVCACCT bigint
		, @CLReasonType bigint
		, @ErrorMSG varchar(250)
		------Sewer Camera Related Changes ----------------
		,@SewerCamId bigint = 0
		/*==============================================================*/
	If @Debug = 1 Print 'Drop / Create tmp table'
	If OBJECT_ID('tempdb..#tmp_job') is not null 
	Drop Table #tmp_job;
	Create Table #tmp_job
	(
		[JobID] bigint not null
		, [CompanyCode] nvarchar(10) not null
		, [JobNumber] nvarchar(10) not null
		, [JobStartDate] datetime not null
		, [Contract] varchar(50) not null
		, [ForemanID] int not null
		, [ForemanName] varchar(80) not null
		, [ForemanRole] varchar(50) not null
		, [ApproverID] int not null
		, [ApproverName] varchar(80) not null
		, [ApproverRole] varchar(50) not null
		, [ApproverEmail] varchar(255)
		, [IsLockDown] bit not null
		, [CLModifiedOn] datetime   		 	  
		, [JobMasterID] bigint Null
		, [Requester] nvarchar(50) Null -- 24/03/2023 Added Requester field
		, [IsRequester] bit null -- 24/03/2023 Added IsRequester field
		, [SewerCamId] bigint null -- Sewer Cam Id 
	)

	If OBJECT_ID('tempdb..#tmpSC') is not null 
		Drop Table #tmpSC;
		Create table #tmpSC
		(
			[JobMasterId] bigint,-- not null,
   			[Value] nvarchar(400),
   			[Section] nvarchar(50),
   			[Infoname] nvarchar(50),
   			[ItemOrder] int,
			[ClModifiedOn] datetime
		)

	If OBJECT_ID('tempdb..#tmpSCM') is not null 
		Drop Table #tmpSCM;
		Create table #tmpSCM
		(
			[JobMasterId] bigint,
   			[ActivityType] bigint null,
			[Inspector] nvarchar(50) null,
			[County] nvarchar(50) null,
			[Phase] nvarchar(50) null,
			[TruckId] nvarchar(50) null,
			[Comments] nvarchar(50) null,
			[CLModifiedOn] datetime null
		)

	If OBJECT_ID('tempdb..#tmpSCD') is not null 
	Drop Table #tmpSCD;
	Create table #tmpSCD
	(
		[JobMasterId] bigint ,
		[SewerCamId] bigint,
   		[SewerCamTypeId] bigint null,
		[Location] nvarchar(50) null,
		[Feet] nvarchar(50) null,
		[ItemOrder] int null,
		[CLModifiedOn] datetime null
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
			@_JobID			[JobID]
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
	Insert into #tmp_job
	(
		[JobID]
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
		, [IsLockDown]
		, [CLModifiedOn]
		, [JobMasterID]
		, [Requester]  -- 24/03/2023 Added Requester field
		, [IsRequester] -- 24/03/2023 Added IsRequester field
		, [SewerCamId]
	)

	Select
		J.[JOB_ID]							as [JobID]
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
		
		, NULL								as [ApproverEmail]					--Told to put in null -  Karthick 11-29-2022
		--, AE.[Employee_Email]	 as [ApproverEmail]								--temp remove for query execution time Do we pass as a parameter from AD from CrewLink???
		
		, isnull(LD.LOCK_DOWN_STATUS, 0)	as [IsJobLocked]
		, j.[MODIFIED_ON]					as [CLModifiedOn]
		, CPJ.[ID]							as [JobMasterID]
		, CRT.[REQUESTER]                   as [Requester] -- 24/03/2023 Added Requester and IsRequester field
		, CM.Is_CP_Requester                as [IsRequester]
		, CPSC.SewerCamId					as [SewerCamId]

	From [dbo].[CL_JOB_T]							J 

	Join [dbo].[WI_JOB_MASTER_T]					JM on
		J.[WI_JOB_ID] = JM.[WI_JOB_ID]

	Join [dbo].WI_CONTRACT_MASTER_T                 CM on
		JM.CONTRACT_NUMBER = CM.CONTRACT_NUMBER

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

	LEFT JOIN [dbo].[CL_LOCK_DOWN_T]				LD on 
		LDU.[USER_ID] = LD.[USER_ID]
		AND (J.[JOB_START_DATE] >= LD.[CALENDAR_START_DATE] and J.[JOB_START_DATE] <= LD.[CALENDAR_END_DATE])

	Left Join [CustomerPortal.Development].[dbo].[JobMaster_T]	CPJ on
		J.[JOB_ID] = CPJ.[JobID]
		and CPJ.[Active] = 1

	Left Join [CustomerPortal.Development].[dbo].[SewerCam_T] CPSC  on
		CPJ.ID = CPSC.JobMasterId


	Left join [dbo].[CL_REQUESTER_NAME_TRACKING_T] CRT on 
	j.JOB_ID = CRT.JOB_ID and CRT.[ISACTIVE] = 1  -- 24/03/2023 Requester field

	--Left Join [SIGMA].[WebImport].[dbo].[PR_EMPLOYEE_MASTER_3_MC] AE on --temp remove for query execution time
	--	se.[employee_id] = trim(ae.[employee_code])

	Where 
		J.[JOB_STATUS_ID] in (1,5,7) -- 1 = Pending, 7 = Reviewed
		and isnull(j.[STATUS], 0) <> 1
		and J.[JOB_ID] = @_JobID


	-- Exit Script if no data exists in temp
	If Not Exists(select 1 From #tmp_job) Begin

		set @ErrorMSG = concat('Job is not active ', @_JobID);

		RAISERROR(@ErrorMSG, 17,1)

	end

	If @Debug = 1 Begin
		Print '--> Return Temp table'
		Select * From #tmp_job

	End
	Else Begin

		If Exists(select 1 from #tmp_job where JobMasterID is not null) Begin

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
				, [IsLockDown]		= B.[IsLockDown]
				, [CLModifiedOn]	= B.[CLModifiedOn]
				, [IsRequester]      = B.IsRequester -- 24/03/2023 Added IsRequester field
			From [CustomerPortal.Development].[dbo].[JobMaster_T] A
			Join #tmp_job B on
				a.JobID = b.JobID

		End 
		Else Begin
			-- 24/03/2023 Added IsRequester field
			Insert into [CustomerPortal.Development].[dbo].[JobMaster_T]
			(JobID, CompanyCode, JobNumber, JobStartDate, [Contract],ForemanID,ForemanName,ForemanRole,ApproverID, ApproverName, ApproverRole,ApproverEmail,IsLockDown,CLModifiedOn, IsRequester)
			Select
				[JobID], [CompanyCode], [JobNumber], [JobStartDate], [Contract], [ForemanID], [ForemanName], [ForemanRole], [ApproverID], [ApproverName], [ApproverRole], [ApproverEmail], [IsLockDown], [CLModifiedOn], [IsRequester]
			From #tmp_job

		End

		If @Debug = 1 Print '--> Update tmp_job with Job Master ID'
		Update a
		Set
			[JobMasterID] = [ID] 
		From #tmp_job a
		Join [CustomerPortal.Development].[dbo].[JobMaster_T] b on
			a.[JobID] = b.[JobID]
		Where
			a.[JobMasterID] is null
	End

--------------------------------------------------------------------------------
-----> ContractRegionMapping_T
--------------------------------------------------------------------------------

	If Not Exists(Select 1 from #tmp_job a Join [CustomerPortal.Development].[dbo].[ContractRegionMapping_T] b on a.[Contract] = b.[Contract] Where b.[Active] = 1) Begin

		If @Debug = 1 Begin
			Print '--> Insert New Contract with no region mapping'

			Select
				[Contract]		[Contract]
				, @NoRegionId	[RegionID],
				@NoCompanyId    [NoCompanyID]
				, @SVCACCT		[AddedBy]
			From #tmp_job

		End
		Else Begin

			Insert into [CustomerPortal.Development].[dbo].[ContractRegionMapping_T]
			([Contract], [RegionID],[CompanyId], [AddedBy])
			Select
				[Contract]
				, @NoRegionId
				, @NoCompanyId -- Inserting no company
				, @SVCACCT
			From #tmp_job

			--------------------------------------------------------------------
			--	Who / How are we going to notify if there is a new contract?
			--------------------------------------------------------------------

		End
	End

--------------------------------------------------------------------------------
----->  JobRevenue_T
--------------------------------------------------------------------------------

	If @Debug = 1 Begin
		Print '---> Get JobRevenue_T'

		Select
			tj.[JobMasterID]										as [JobMasterID]
			, JP.[JOB_PAYITEM_ID]									as [JobPayItemID]
			, JP.[WI_PAYITEM_ID]									as [WIPayItemID]
			, PM.[PAYITEM]											as [PayItem]
			, PM.[DESCRIPTION]										as [Description]
			, JP.[QTY]												as [Qty]
			, PM.[UOM]												as [UOM]
			, JP.[WORK_ORDER]										as [WO]
			, JP.[PO_NUMBER]										as [PO]
			, JP.[STREET_ADDRESS]									as [Address]
			, CM.[STATE_CODE]										as [State]
			, CM.[CITY_CODE]										as [City]
			, cast(IIF(TM.[PAY_ITEM] IS NOT NULL, 1, 0) as bit)		as [IsTandM]
			, JP.[MODIFIED_ON]										as [CLModifiedOn],
			PM.[WBS_DESCRIPTION]                                    as [WbsDescription]
		From [dbo].[CL_JOB_PAYITEM_T]					JP

		Join [dbo].[WI_PAYITEM_MASTER_T]				PM on
			PM.[WI_PAYITEM_ID] = JP.[WI_PAYITEM_ID]

		Join [dbo].[WI_CITYCODE_MASTER_T]				CM on 
			CM.[WI_CITY_ID] = JP.[WI_CITY_ID]

		Join #tmp_job												tj on
			jp.[JOB_ID] = tj.[JobID]

		Left Join [dbo].[CL_T_AND_M_PAYITEM_MAPPING_T]	TM on 
			TM.[PAY_ITEM] = PM.[PAYITEM]

		Where 
			JP.[ISACTIVE] = 1

		Order by 
			JP.[JOB_PAYITEM_ID] desc

	End
	Else Begin

		--> Delete any info if exists to reinsert
		If Exists( Select 1 From [CustomerPortal.Development].[dbo].[JobMaster_T] a Join [CustomerPortal.Development].[dbo].[JobRevenue_T] b on a.[ID] = b.[JobMasterID] Where a.[Active] = 1) Begin

			Delete a
			From [CustomerPortal.Development].[dbo].[JobRevenue_T]	a 
			Join #tmp_job								b on 
				a.[JobMasterID] = b.[JobMasterID]

		End

		Insert into [CustomerPortal.Development].[dbo].[JobRevenue_T]
		([JobMasterID], [JobPayItemID], [WIPayItemID], [PayItem], [Description], [Qty], [UOM], [WO], [PO], [Address], [State], [City], [IsTandM], [CLModifiedOn], [WbsDescription])

		Select
			tj.[JobMasterID]										as [JobMasterID]
			, JP.[JOB_PAYITEM_ID]									as [JobPayItemID]
			, JP.[WI_PAYITEM_ID]									as [WIPayItemID]
			, PM.[PAYITEM]											as [PayItem]
			, PM.[DESCRIPTION]										as [Description]
			, JP.[QTY]												as [Qty]
			, PM.[UOM]												as [UOM]
			, JP.[WORK_ORDER]										as [WO]
			, JP.[PO_NUMBER]										as [PO]
			, JP.[STREET_ADDRESS]									as [Address]
			, CM.[STATE_CODE]										as [State]
			, CM.[CITY_CODE]										as [City]
			, cast(IIF(TM.[PAY_ITEM] IS NOT NULL, 1, 0) as bit)		as [IsTandM]
			, JP.[MODIFIED_ON]										as [CLModifiedOn],
			PM.[WBS_DESCRIPTION]                                    as [WbsDescription]
		From [dbo].[CL_JOB_PAYITEM_T]					JP

		Join [dbo].[WI_PAYITEM_MASTER_T]				PM ON
			PM.[WI_PAYITEM_ID] = JP.[WI_PAYITEM_ID]

		Join [dbo].[WI_CITYCODE_MASTER_T]				CM ON 
			CM.[WI_CITY_ID] = JP.[WI_CITY_ID]

		Join #tmp_job												tj on
			jp.[JOB_ID] = tj.[JobID]

		Left Join [dbo].CL_T_AND_M_PAYITEM_MAPPING_T	TM ON 
			TM.[PAY_ITEM] = PM.[PAYITEM]

		Where 
			JP.[ISACTIVE] = 1

		Order by 
			JP.[JOB_PAYITEM_ID] desc
	End

--------------------------------------------------------------------------------
-----> JobLabor_T
--------------------------------------------------------------------------------

	If @Debug = 1 Begin
		Print '---> Get JobLabor_T'

		Select
			tj.[JobMasterID]		as [JobMasterID]
			, JL.[JOB_LABOR_ID]		as [JobLaborID]
			, EM.[EMPLOYEE_ID]		as [EmployeeID]
			, EM.[EMPLOYEE_NAME]	as [EmployeeName]
			, JL.[STANDARD_HOURS]	as [STHours]
			, JL.[OT_HOURS]			as [OTHours]
			, JL.[DT_HOURS]			as [DTHours]
			, JL.[MODIFIED_ON]		as [CLModifiedOn]
		From [dbo].[CL_JOB_LABOR_T]			as JL

		Join [dbo].[CL_CONTRACT_CREW_T]		as CC ON 
			JL.[FOREMAN_CREW_ID] = CC.[FOREMAN_CREW_ID]

		Join [dbo].[WI_EMPLOYEE_MASTER_T]	as EM ON 
			EM.[WI_EMPLOYEE_ID] = CC.[WI_EMPLOYEE_ID]

		Join #tmp_job						as tj on
			jL.[JOB_ID] = tj.[JobID]

		Where 
			JL.[ISACTIVE] = 1

		Order by 
			JL.[JOB_LABOR_ID] desc
	End
	Else Begin

		--> Delete any info if exists to reinsert
		If Exists( Select 1 From [CustomerPortal.Development].[dbo].[JobMaster_T] a Join [CustomerPortal.Development].[dbo].[JobLabor_T] b on a.[ID] = b.[JobMasterID] Where a.[Active] = 1) Begin

			Delete a
			From [CustomerPortal.Development].[dbo].[JobLabor_T]	a 
			Join #tmp_job								b on 
				a.[JobMasterID] = b.[JobMasterID]
		End

		Insert into [CustomerPortal.Development].[dbo].[JobLabor_T]
		([JobMasterID], [JobLaborID], [EmployeeID], [EmployeeName], [STHours], [OTHours], [DTHours], [CLModifiedOn])

		Select
			tj.[JobMasterID]		as [JobMasterID]
			, JL.[JOB_LABOR_ID]		as [JobLaborID]
			, EM.[EMPLOYEE_ID]		as [EmployeeID]
			, EM.[EMPLOYEE_NAME]	as [EmployeeName]
			, JL.[STANDARD_HOURS]	as [STHours]
			, JL.[OT_HOURS]			as [OTHours]
			, JL.[DT_HOURS]			as [DTHours]
			, JL.[MODIFIED_ON]		as [CLModifiedOn]
		From [dbo].[CL_JOB_LABOR_T]			as JL

		Join [dbo].[CL_CONTRACT_CREW_T]		as CC ON 
			JL.[FOREMAN_CREW_ID] = CC.[FOREMAN_CREW_ID]

		Join [dbo].[WI_EMPLOYEE_MASTER_T]		as EM ON 
			EM.[WI_EMPLOYEE_ID] = CC.[WI_EMPLOYEE_ID]

		Join #tmp_job										as tj on
			jL.[JOB_ID] = tj.[JobID]

		Where 
			JL.[ISACTIVE] = 1

		Order by 
			JL.[JOB_LABOR_ID] desc
	End

--------------------------------------------------------------------------------
-----> JobEquipment_T
--------------------------------------------------------------------------------

	If @Debug = 1 Begin
		Print '---> Get JobEquipment_T'

		Select
			tj.[JobMasterID]				as [JobMasterID]
			, JE.[JOB_EQUIPMENT_ID]			as [JobEquipmentID]
			, FM.[EQUIPMENT_CODE]			as [EquipmentCode]
			, FM.[EQUIPMENT_DESCRIPTION]	as [EquipmentDescription]
			, JE.[HOURS]					as [Hours]
			, JE.[MODIFIED_ON]				as [CLModifiedOn]

		From [dbo].[CL_JOB_EQUIPMENT_T]		as JE

		Join [dbo].[CL_CONTRACT_FLEET_T]	as CF ON 
			JE.[CONTRACT_FLEET_ID] = CF.[CONTRACT_FLEET_ID]

		Join [dbo].[WI_FLEET_MASTER_T]		as FM ON 
			FM.WI_FLEET_ID = CF.WI_FLEET_ID

		Join #tmp_job						as tj on
			je.JOB_ID = tj.JobID

		Where 
			JE.[ISACTIVE] = 1

		Order by 
			JE.[JOB_EQUIPMENT_ID] desc
	End
	Else Begin

		--> Delete any info if exists to reinsert
		If Exists( Select 1 From [CustomerPortal.Development].[dbo].[JobMaster_T] a Join [CustomerPortal.Development].[dbo].[JobEquipment_T] b on a.ID = b.[JobMasterID] Where a.[Active] = 1) Begin

			Delete a
			From [CustomerPortal.Development].[dbo].[JobEquipment_T]	a 
			Join #tmp_job									b on 
				a.[JobMasterID] = b.[JobMasterID]
		End

		Insert into [CustomerPortal.Development].[dbo].[JobEquipment_T]
		([JobMasterID], [JobEquipmentID], [EquipmentCode], [EquipmentDescription], [Hours], [CLModifiedOn])

		Select
			tj.[JobMasterID]				as [JobMasterID]
			, JE.[JOB_EQUIPMENT_ID]			as [JobEquipmentID]
			, FM.[EQUIPMENT_CODE]			as [EquipmentCode]
			, FM.[EQUIPMENT_DESCRIPTION]	as [EquipmentDescription]
			, JE.[HOURS]					as [Hours]
			, JE.[MODIFIED_ON]				as [CLModifiedOn]

		From [dbo].[CL_JOB_EQUIPMENT_T]		as JE

		Join [dbo].[CL_CONTRACT_FLEET_T]	as CF ON 
			JE.[CONTRACT_FLEET_ID] = CF.[CONTRACT_FLEET_ID]

		Join [dbo].[WI_FLEET_MASTER_T]		as FM ON 
			FM.[WI_FLEET_ID] = CF.[WI_FLEET_ID]

		Join #tmp_job						as tj on
			je.[JOB_ID] = tj.[JobID]

		Where 
			JE.[ISACTIVE] = 1

		Order by 
			JE.[JOB_EQUIPMENT_ID] desc
	End

--------------------------------------------------------------------------------
-----> Comment_T
--------------------------------------------------------------------------------

	If @Debug = 1 Begin
		Print '---> Get Comment_T'

		Select
			tj.JobMasterID		as [JobMasterID]
			--, C.JOB_ID			as JobID
			, c.COMMENT_ID		as [CLCommentID]
			, lu.ID				as [CommentTypeID]
			, c.[COMMENT_DESC]	as [Comment]
			, c.[Modified_ON]	as [CLModifiedOn]
		From [dbo].[CL_COMMENT_T] C

		Join [CustomerPortal.Development].[dbo].[Lookup_T] lu on
			c.[COMMENT_TYPE] = lu.[Value]
			and lu.[Type] = 'CommentType'
			and lu.[Active] = 1

		Join #tmp_job tj on
			c.[JOB_ID] = tj.[JobID]

		Order by 
			[Comment_ID] desc

	End
	Else Begin

		--> Delete any info if exists to reinsert
		If Exists( Select 1 From [CustomerPortal.Development].[dbo].[JobMaster_T] a Join [CustomerPortal.Development].[dbo].[Comment_T] b on a.ID = b.JobMasterID Where a.Active = 1) Begin

			Delete a
			From [CustomerPortal.Development].[dbo].[Comment_T]		a 
			Join #tmp_job								b on 
				a.[JobMasterID] = b.[JobMasterID]
		End

		Insert into [CustomerPortal.Development].[dbo].[Comment_T]
		([JobMasterID], [CLCommentID], [CommentTypeID], [Comment], [CLModifiedOn])

		Select
			tj.[JobMasterID]		as [JobMasterID]
			--, C.JOB_ID			as JobID
			, c.[COMMENT_ID]		as [CLCommentID]
			, lu.[ID]				as [CommentTypeID]
			, c.[COMMENT_DESC]		as [Comment]
			, c.[Modified_ON]		as [CLModifiedOn]
		From [dbo].[CL_COMMENT_T] C

		Join [CustomerPortal.Development].[dbo].[Lookup_T] lu on
			c.[COMMENT_TYPE] = lu.[Value]
			and lu.[Type] = 'CommentType'
			and lu.[Active] = 1

		Join #tmp_job tj on
			c.[JOB_ID] = tj.[JobID]

		Order by 
			[Comment_ID] desc
	End

--------------------------------------------------------------------------------
-----> JobStatusTracking_T
--------------------------------------------------------------------------------

	If @Debug = 1 Begin
		Print '---> JobStatusTracking_T'

		Select
			[JobMasterID]	[JobMasterID]
			, @_StatusID	[StatusID]
			, @CLReasonType [ReasonType]
			, @_CLComment	[Comment]
			, @_CLUserID	[CLUserID]
			, @_CLUserName	[CLUsername]
			, @_CLUserRole	[CLUserRole]
		From #tmp_job

	End
	Else Begin

		--> Inactive current status if there is one
		If Exists( Select 1 From [CustomerPortal.Development].[dbo].[JobMaster_T] a Join [CustomerPortal.Development].[dbo].[DFRStatusTracking_T] b on a.ID = b.[JobMasterID] Where a.[Active] = 1 and b.[Active] = 1 ) Begin

			Update a
			set	
				[Active]			= 0
				, [ChangedBy]		= @_CLUserID
				, [ChangedDate]		= GETDATE()
			From [CustomerPortal.Development].[dbo].[DFRStatusTracking_T]	a 
		
			Join #tmp_job										b on 
				a.[JobMasterID] = b.[JobMasterID]

			Where 
				a.[Active] = 1

		End

		Insert into [CustomerPortal.Development].[dbo].[DFRStatusTracking_T]
		([JobMasterID], [StatusID], [ReasonTypeID], [Comment], [CLUserId], [CLUsername], [CLUserRole], [Requester])
		
		Select
			[JobMasterID]	[JobMasterID]
			, @_StatusID	[StatusID]
			, @CLReasonType [ReasonTypeID]
			, @_CLComment	[Comment]
			, @_CLUserID	[CLUserID]
			, @_CLUserName	[CLUsername]
			, @_CLUserRole	[CLUserRole]
			, [Requester]   [Requester] -- 24/03/2023 Added Requester field
		From #tmp_job

	End

--------------------------------------------------------------------------------
-----> Sewer Camera Changes
--------------------------------------------------------------------------------
	Insert into #tmpSC 
	([JobMasterId],[Value],[Section], [Infoname], [ItemOrder], [ClModifiedOn]) 

	Select  
			t.JobMasterID                     as [JobMasterId]                          
			,trans.value					  as [Value]
			,mas.SECTION					  as [Section]			
			,mas.ADDITIONAL_INFO_NAME		  as [Infoname]			
			,trans.ITEM_ORDER 				  as [ItemOrder]									
			,t.CLModifiedOn	                  as [CLModifiedOn]
			
	from #tmp_job as t 

		Join [CustomerPortal.Development].[dbo].[JobRevenue_T] as r on 
			t.JobMasterID = r.JobMasterID

		cross apply (Select Top 1 [PayItem] from [dbo].[CL_SPIRE_SEWER_CAM_DFR_PAY_ITEMS_T] 
					Where PAY_ITEM = r.PayItem)  as sp
							
				--Join [dbo].[CL_SPIRE_SEWER_CAM_DFR_PAY_ITEMS_T]		as sp 
				--			on sp.PAY_ITEM = r.PayItem

		Join [dbo].[CL_DFR_ADDITIONAL_INFO_TRANS_T]	as trans on 
			trans.JOB_ID = t.JobID
			and trans.ISACTIVE = 1 

		Join  [dbo].[CL_DFR_ADDITIONAL_INFO_MASTER_T]		as mas on 
			mas.ADDITIONAL_INFO_ID = trans.ADDITIONAL_INFO_ID 

		Join [dbo].[CL_DFR_MASTER_T] as m on 
			m.DFR_ID = mas.DFR_ID 

 		where   m.UNIQUE_KEY = 'SPIRE SEWER CAMERA' --and COALESCE(t.JobMasterId,[Value])  is not null



	INSERT INTO #tmpSCM 
	([JobMasterId], [ActivityType], [County], [Phase], [TruckId], [Comments], [Inspector], [CLModifiedOn])

	Select top 1 
			Max(JobMasterId)		as [JobMasterId]		    
			,Max(lkp.ID)			as [ActivityType]
			,Max (County)			as [County]
			,Max (Phase)			as [Phase]
			,Max(TruckId)			as [TruckId]
			,Max(Comments)			as [Comments]
			,Max(Inspector)			as [Inspector]
			,Max(ClModifiedOn)		as [ClModifiedOn]	
				
	from #tmpSC
			pivot
			(
				Min(Value) 
				for [Infoname] 
				in ([ActivityType], [County], [Phase], [TruckId], [Comments],[Inspector])
			) as pivotTable1

			left join [CustomerPortal.Development].[dbo].[Lookup_T] as lkp on 
				pivotTable1.ActivityType = lkp.Text
				and lkp.Active = 1


	Insert Into #tmpSCD
	([JobMasterId],[SewerCamId], [SewerCamTypeId], [ItemOrder], [Location], [Feet], [CLModifiedOn] )

	Select 
			t.JobMasterID          as [JobMasterId]
			,t.SewerCamId          as [SewerCamId]
			,lkp.ID                as [SewerCamTypeId]
			,ItemOrder			   as [ItemOrder]
			,[Location]			   as [Location]
			,Feet				   as [Feet]
			,t.CLModifiedOn		   as [CLModified]

	from #tmpSC
			pivot
			(
				Max(Value) 
				for [Infoname] 
				in ([Location], [Feet]) 
			) as pivotTable

			left join  [CustomerPortal.Development].[dbo].[Lookup_T] as lkp on 
				pivotTable.Section = lkp.Value
				and lkp.Active = 1

			Join #tmp_job											as t
				on t.JobMasterID = pivotTable.JobMasterId

			where COALESCE(ItemOrder,Location,Feet)  is not null

						
--------------------------------------------------------------------------------
-----> SewerCam_T
--------------------------------------------------------------------------------
			
	If @Debug = 1 Begin
				
			print '------>Printing Sewer Cam data '

			Select 
				[JobMasterId]
				, [Value]
				, [SECTION]
				, [ItemOrder]
				, [Infoname]
				, [CLModifiedOn] 

			from #tmpSC
				
			Select 
				[JobMasterId]
				, [ActivityType]
				, [County]
				, [Phase]
				, [TruckId]
				, [Comments]
				, [Inspector]
				, [CLModifiedOn]
						
			from #tmpSCM

	End

	Else Begin

		Delete sd from [CustomerPortal.Development].[dbo].SewerCamDetails_T as sd
				Join #tmp_job as jb on 
				jb.SewerCamId = sd.SewerCamId

		Delete SC from [CustomerPortal.Development].[dbo].[SewerCam_T] as SC
				Join #tmp_job as jb on 
				jb.SewerCamId = SC.SewerCamId
				

		If exists(select 1 from #tmpSC) Begin 

			Insert into [CustomerPortal.Development].[dbo].[SewerCam_T]
			([JobMasterId],[ActivityTypeId],[County],[Phase], [TruckId], [Comments], [Inspector], [CLModifiedOn] )

			Select 
				[JobMasterId]
				, [ActivityType]
				, [County]
				, [Phase]
				, [TruckId]
				, [Comments]
				, [Inspector]
				, [CLModifiedOn]
						
			from #tmpSCM
					
						--update #tmp_job
						--set
						--	SewerCamID = SCOPE_IDENTITY()  --- Returned Null when the sp is called multiple time concurrently
		END

	END
			
--------------------------------------------------------------------------------
-----> SewerCamDetails
--------------------------------------------------------------------------------

	If @Debug = 1 Begin
		Print '------> Printing Sewer Cam Details'

		Select 
			[JobMasterId]
			, [SewerCamId] 
			, [SewerCamTypeId]
			, [ItemOrder]
			, [Location]
			, [Feet]
			, [CLModifiedOn]
				
		from #tmpSCD

	END

	ELSE BEGIN	

		If Exists (select 1 from [CustomerPortal.Development].[dbo].[SewerCam_T]  as a 
					join #tmp_job as t on 
					a.JobMasterId = t.JobMasterID) BEGIN

			Insert into [CustomerPortal.Development].[dbo].[SewerCamDetails_T]
			([SewerCamId], [SewerCamTypeId], [ItemOrder], [Location], [Feet], [CLModifiedOn])

			Select 
				a.SewerCamId 
				, [SewerCamTypeId]
				, [ItemOrder]
				, [Location]
				, [Feet]
				, t.[CLModifiedOn]
				
			from #tmpSCD as t
				Join [CustomerPortal.Development].[dbo].[SewerCam_T]  as a on 
					a.JobMasterId = t.JobMasterId
							  
		END
				
	END

	--END

END
