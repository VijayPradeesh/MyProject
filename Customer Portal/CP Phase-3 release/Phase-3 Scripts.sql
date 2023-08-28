-------------------------------------------------------------------------------------------
---------------------------Customer Portal Phase-3 scripts---------------------------------
--------------------------------------------------------------------------------------------

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

	IF  EXISTS(SELECT 1 FROM sys.columns 
          WHERE Name = N'TypeID'
          AND Object_ID = Object_ID(N'TypeRoleMapping_T'))
BEGIN
	--- Renaming the column TypeId to CompanyId
     exec SP_RENAME 'TypeRoleMapping_T.TypeID','CompanyID'
END;



IF NOT EXISTS (SELECT 1 FROM sys.columns 
          WHERE Name = N'IsRequester'
          AND Object_ID = Object_ID(N'JobMaster_T'))
BEGIN
		--- Adding a new column "IsRequester"
        ALTER TABLE dbo.JobMaster_T
		ADD  IsRequester bit  NULL 
END;

IF NOT EXISTS(SELECT 1 FROM sys.columns 
          WHERE Name = N'CompanyId'
          AND Object_ID = Object_ID(N'ContractRegionMapping_T'))
BEGIN
		--- Adding a new Column CompanyId
        ALTER TABLE dbo.ContractRegionMapping_T
		ADD  CompanyId BIGINT  NULL 
END;


IF  EXISTS(SELECT 1 FROM sys.columns 
          WHERE Name = N'CompanyId'
          AND Object_ID = Object_ID(N'ContractRegionMapping_T'))
BEGIN
		ALTER TABLE dbo.ContractRegionMapping_T
		ADD FOREIGN KEY (CompanyId) REFERENCES LookUp_T(ID) 
END;

IF NOT EXISTS (SELECT 1 FROM sys.columns 
          WHERE Name = N'Signature'
          AND Object_ID = Object_ID(N'DFRStatusTracking_T'))
BEGIN
		--- Adding a new column "Signature"
        ALTER TABLE dbo.DFRStatusTracking_T
		ADD  Signature varbinary(max)  NULL 
END;

IF NOT EXISTS (SELECT 1 FROM sys.columns 
          WHERE Name = N'Requester'
          AND Object_ID = Object_ID(N'DFRStatusTracking_T'))
BEGIN
		--- Adding a new column Requester
        ALTER TABLE dbo.DFRStatusTracking_T
		ADD  Requester nvarchar(50)  NULL 
END;



BEGIN
	--- Changing the Type "UserType" to "Company"
	UPDATE  dbo.Lookup_T
	SET Type = 'Company', Description = 'Company'
	where Type = 'UserType'
END;

BEGIN 
	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Lookup_T] WHERE Type = 'Screens' AND VALUE = 'Home')
	BEGIN 
	INSERT [dbo].Lookup_T(Type, Value, Text, Description, SortOrder, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
	VALUES (
	'Screens', 
	'Home',
	'Home',
	'Screens',
	1,
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), 
	GETDATE(), 
	NULL, NULL, 
	1
	)
	END
END

BEGIN 
	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Lookup_T] WHERE Type = 'Screens' AND VALUE = 'User Access')
	BEGIN 
	INSERT [dbo].Lookup_T(Type, Value, Text, Description, SortOrder, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
	VALUES (
	'Screens', 
	'User Access',
	'User Access',
	'Screens',
	1,
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), 
	GETDATE(), 
	NULL, NULL, 
	1
	)
	END
END

BEGIN 
	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Lookup_T] WHERE Type = 'Screens' AND VALUE = 'Reports')
	BEGIN 
	INSERT [dbo].Lookup_T(Type, Value, Text, Description, SortOrder, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
	VALUES (
	'Screens', 
	'Reports',
	'Reports',
	'Screens',
	1,
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), 
	GETDATE(), 
	NULL, NULL, 
	1
	)
	END
END

BEGIN 
	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Lookup_T] WHERE Type = 'Company' AND VALUE = 'No Company')
	BEGIN 
	INSERT [dbo].Lookup_T(Type, Value, Text, Description, SortOrder, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
	VALUES (
	'Company', 
	'No Company',
	'No Company',
	'For unassigned Contracts',
	1,
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), 
	GETDATE(), 
	NULL, NULL, 
	1
	)
	END
END

GO


/****** Object:  Table [dbo].[TypeRoleScreenMapping_T]    Script Date: 22-03-2023 12:46:08 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TypeRoleScreenMapping_T]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[TypeRoleScreenMapping_T](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[CompanyRoleID] [bigint] NOT NULL,
	[ScreenID] [bigint] NOT NULL,
	[AddedBy] [bigint] NOT NULL,
	[AddedDate] [datetime] NOT NULL,
	[ChangedBy] [bigint] NULL,
	[ChangedDate] [datetime] NULL,
	[Active] [bit] NOT NULL,
 CONSTRAINT [PK_TypeRoleScreenMapping_T] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK__TypeRoleS__TypeR__214BF109]') AND parent_object_id = OBJECT_ID(N'[dbo].[TypeRoleScreenMapping_T]'))
ALTER TABLE [dbo].[TypeRoleScreenMapping_T]  WITH CHECK ADD FOREIGN KEY([CompanyRoleID])
REFERENCES [dbo].[TypeRoleMapping_T] ([ID])
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_TypeRoleScreenMapping_T_Lookup_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[TypeRoleScreenMapping_T]'))
ALTER TABLE [dbo].[TypeRoleScreenMapping_T]  WITH CHECK ADD  CONSTRAINT [FK_TypeRoleScreenMapping_T_Lookup_T] FOREIGN KEY([ScreenID])
REFERENCES [dbo].[Lookup_T] ([ID])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_TypeRoleScreenMapping_T_Lookup_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[TypeRoleScreenMapping_T]'))
ALTER TABLE [dbo].[TypeRoleScreenMapping_T] CHECK CONSTRAINT [FK_TypeRoleScreenMapping_T_Lookup_T]
GO

-----------------------------------------------------------
-------Inserting CompanyId in ContractRegionMapping--------
-----------------------------------------------------------
BEGIN
	UPDATE  ContractRegionMapping_T
	Set CompanyId = (SELECT TOP 1 ID from Lookup_T WHERE Type = 'Company' and Value = 'Spire' and Active = 1)
END


----------------------------------------------------------------
------Inserting Screen Mapping ---------------------------------
----------------------------------------------------------------


-------INSERTING HOME SCREEN FOR MEARS ADMIN----------------
IF NOT EXISTS (SELECT TOP 1 * FROM TypeRoleScreenMapping_T WHERE 
		CompanyRoleID = (SELECT TOP 1 ID FROM TypeRoleMapping_T WHERE 
						CompanyID = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Company' and Value = 'Mears' and Active = 1) and 
						RoleID = (select top 1 ID from Lookup_T where Type = 'UserRole' and Value = 'Admin') AND 
						Active = 1) and 
		ScreenID = (select top 1 ID from Lookup_T where Type = 'Screens' and Value = 'Home') and 
		Active = 1)
BEGIN
	INSERT INTO TypeRoleScreenMapping_T(
		CompanyRoleID,
		ScreenID,
		AddedBy,
		AddedDate,
		ChangedBy,
		ChangedDate,
		Active)
		VALUES((SELECT TOP 1 ID FROM TypeRoleMapping_T WHERE 
						CompanyID = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Company' and Value = 'Mears' and Active = 1) and 
						RoleID = (select top 1 ID from Lookup_T where Type = 'UserRole' and Value = 'Admin') AND Active = 1),
			    (select top 1 ID from Lookup_T where Type = 'Screens' and Value = 'Home'),
				(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'),
				 GETDATE(),
				 NULL,
				 NULL, 
				 1)
END;

-------INSERTING USER ACCESS SCREEN FOR MEARS ADMIN----------------
IF NOT EXISTS (SELECT TOP 1 * FROM TypeRoleScreenMapping_T WHERE 
		CompanyRoleID = (SELECT TOP 1 ID FROM TypeRoleMapping_T WHERE 
						CompanyID = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Company' and Value = 'Mears' and Active = 1) and 
						RoleID = (select top 1 ID from Lookup_T where Type = 'UserRole' and Value = 'Admin') AND 
						Active = 1) and 
		ScreenID = (select top 1 ID from Lookup_T where Type = 'Screens' and Value = 'User Access') and 
		Active = 1)
BEGIN
	INSERT INTO TypeRoleScreenMapping_T(
		CompanyRoleID,
		ScreenID,
		AddedBy,
		AddedDate,
		ChangedBy,
		ChangedDate,
		Active)
		VALUES((SELECT TOP 1 ID FROM TypeRoleMapping_T WHERE 
						CompanyID = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Company' and Value = 'Mears' and Active = 1) and 
						RoleID = (select top 1 ID from Lookup_T where Type = 'UserRole' and Value = 'Admin') AND Active = 1),
			    (select top 1 ID from Lookup_T where Type = 'Screens' and Value = 'User Access'),
				(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'),
				 GETDATE(),
				 NULL,
				 NULL, 
				 1)
END;


-------INSERTING REPORTS SCREEN FOR MEARS ADMIN----------------
IF NOT EXISTS (SELECT TOP 1 * FROM TypeRoleScreenMapping_T WHERE 
		CompanyRoleID = (SELECT TOP 1 ID FROM TypeRoleMapping_T WHERE 
						CompanyID = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Company' and Value = 'Mears' and Active = 1) and 
						RoleID = (select top 1 ID from Lookup_T where Type = 'UserRole' and Value = 'Admin') AND 
						Active = 1) and 
		ScreenID = (select top 1 ID from Lookup_T where Type = 'Screens' and Value = 'Reports') and 
		Active = 1)
BEGIN
	INSERT INTO TypeRoleScreenMapping_T(
		CompanyRoleID,
		ScreenID,
		AddedBy,
		AddedDate,
		ChangedBy,
		ChangedDate,
		Active)
		VALUES((SELECT TOP 1 ID FROM TypeRoleMapping_T WHERE 
						CompanyID = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Company' and Value = 'Mears' and Active = 1) and 
						RoleID = (select top 1 ID from Lookup_T where Type = 'UserRole' and Value = 'Admin') AND Active = 1),
			    (select top 1 ID from Lookup_T where Type = 'Screens' and Value = 'Reports'),
				(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'),
				 GETDATE(),
				 NULL,
				 NULL, 
				 1)
END;

-------INSERTING HOME SCREEN FOR SPIRE ADMIN----------------
IF NOT EXISTS (SELECT TOP 1 * FROM TypeRoleScreenMapping_T WHERE 
		CompanyRoleID = (SELECT TOP 1 ID FROM TypeRoleMapping_T WHERE 
						CompanyID = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Company' and Value = 'Spire' and Active = 1) and 
						RoleID = (select top 1 ID from Lookup_T where Type = 'UserRole' and Value = 'Admin') AND Active = 1) and 
		ScreenID = (select top 1 ID from Lookup_T where Type = 'Screens' and Value = 'Home') and 
		Active = 1)
BEGIN
	INSERT INTO TypeRoleScreenMapping_T(
		CompanyRoleID,
		ScreenID,
		AddedBy,
		AddedDate,
		ChangedBy,
		ChangedDate,
		Active)
		VALUES((SELECT TOP 1 ID FROM TypeRoleMapping_T WHERE 
						CompanyID = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Company' and Value = 'Spire' and Active = 1) and 
							RoleID = (select top 1 ID from Lookup_T where Type = 'UserRole' and Value = 'Admin') AND Active = 1),
			    (select top 1 ID from Lookup_T where Type = 'Screens' and Value = 'Home'),
				(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'),
				 GETDATE(),
				 NULL,
				 NULL, 
				 1)
END;


-------INSERTING USER ACCESS SCREEN FOR SPIRE ADMIN----------------
IF NOT EXISTS (SELECT TOP 1 * FROM TypeRoleScreenMapping_T WHERE 
         CompanyRoleID = (SELECT TOP 1 ID FROM TypeRoleMapping_T WHERE 
						CompanyID = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Company' and Value = 'Spire' and Active = 1) and 
						RoleID = (select top 1 ID from Lookup_T where Type = 'UserRole' and Value = 'Admin') AND Active = 1) and 
		  ScreenID = (select top 1 ID from Lookup_T where Type = 'Screens' and Value = 'User Access') and 
		  Active = 1)
BEGIN
	INSERT INTO TypeRoleScreenMapping_T(
		CompanyRoleID,
		ScreenID,
		AddedBy,
		AddedDate,
		ChangedBy,
		ChangedDate,
		Active)
		VALUES((SELECT TOP 1 ID FROM TypeRoleMapping_T WHERE 
						CompanyID = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Company' and Value = 'Spire' and Active = 1) and 
						RoleID = (select top 1 ID from Lookup_T where Type = 'UserRole' and Value = 'Admin') AND Active = 1),
			    (select top 1 ID from Lookup_T where Type = 'Screens' and Value = 'User Access'),
				(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'),
				 GETDATE(),
				 NULL,
				 NULL, 
				 1)
END;

-------INSERTING REPORTS SCREEN FOR SPIRE ADMIN----------------
IF NOT EXISTS (SELECT TOP 1 * FROM TypeRoleScreenMapping_T WHERE 
         CompanyRoleID = (SELECT TOP 1 ID FROM TypeRoleMapping_T WHERE 
						CompanyID = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Company' and Value = 'Spire' and Active = 1) and 
						RoleID = (select top 1 ID from Lookup_T where Type = 'UserRole' and Value = 'Admin') AND Active = 1) and 
		  ScreenID = (select top 1 ID from Lookup_T where Type = 'Screens' and Value = 'Reports') and 
		  Active = 1)
BEGIN
	INSERT INTO TypeRoleScreenMapping_T(
		CompanyRoleID,
		ScreenID,
		AddedBy,
		AddedDate,
		ChangedBy,
		ChangedDate,
		Active)
		VALUES((SELECT TOP 1 ID FROM TypeRoleMapping_T WHERE 
						CompanyID = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Company' and Value = 'Spire' and Active = 1) and 
						RoleID = (select top 1 ID from Lookup_T where Type = 'UserRole' and Value = 'Admin') AND Active = 1),
			    (select top 1 ID from Lookup_T where Type = 'Screens' and Value = 'Reports'),
				(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'),
				 GETDATE(),
				 NULL,
				 NULL, 
				 1)
END;

-------INSERTING HOME SCREEN FOR SPIRE INSPECTOR----------------
IF NOT EXISTS (SELECT TOP 1 * FROM TypeRoleScreenMapping_T WHERE 
         CompanyRoleID = (SELECT TOP 1 ID FROM TypeRoleMapping_T WHERE 
						CompanyID = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Company' and Value = 'Spire' and Active = 1) and 
						RoleID = (select top 1 ID from Lookup_T where Type = 'UserRole' and Value = 'Inspector') AND 
						Active = 1) and 
		  ScreenID = (select top 1 ID from Lookup_T where Type = 'Screens' and Value = 'Home') and 
		  Active = 1)
BEGIN
	INSERT INTO TypeRoleScreenMapping_T(
		CompanyRoleID,
		ScreenID,
		AddedBy,
		AddedDate,
		ChangedBy,
		ChangedDate,
		Active)
		VALUES((SELECT TOP 1 ID FROM TypeRoleMapping_T WHERE 
						CompanyID = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Company' and Value = 'Spire' and Active = 1) and 
						RoleID = (select top 1 ID from Lookup_T where Type = 'UserRole' and Value = 'Inspector') AND 
						Active = 1),
			    (select top 1 ID from Lookup_T where Type = 'Screens' and Value = 'Home'),
				 (SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'),
				 GETDATE(),
				 NULL,
				 NULL, 
				 1)
END;

-------INSERTING REPORT SCREEN FOR SPIRE INSPECTOR----------------
IF NOT EXISTS (SELECT TOP 1 * FROM TypeRoleScreenMapping_T WHERE 
         CompanyRoleID = (SELECT TOP 1 ID FROM TypeRoleMapping_T WHERE 
						CompanyID = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Company' and Value = 'Spire' and Active = 1) and 
						RoleID = (select top 1 ID from Lookup_T where Type = 'UserRole' and Value = 'Inspector') AND Active = 1) and 
		  ScreenID = (select top 1 ID from Lookup_T where Type = 'Screens' and Value = 'Reports') and 
		  Active = 1)
BEGIN
	INSERT INTO TypeRoleScreenMapping_T(
		CompanyRoleID,
		ScreenID,
		AddedBy,
		AddedDate,
		ChangedBy,
		ChangedDate,
		Active)
		VALUES((SELECT TOP 1 ID FROM TypeRoleMapping_T WHERE 
						CompanyID = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Company' and Value = 'Spire' and Active = 1) and 
						RoleID = (select top 1 ID from Lookup_T where Type = 'UserRole' and Value = 'Inspector') AND Active = 1),
			    (select top 1 ID from Lookup_T where Type = 'Screens' and Value = 'Reports'),
				(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'),
				 GETDATE(),
				 NULL,
				 NULL, 
				 1)
END;




------- View Changes -----
/****** Object:  View [dbo].[DFRStatusDetails_v]    Script Date: 22-03-2023 12:26:38 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

/****** Script for SelectTopNRows command from SSMS  *****
 Select * From 	dbo.DFRStatusDetails_v*/
ALTER View [dbo].[DFRStatusDetails_v]
as
	
	Select 
        a.ID                                     as [JobMasterID]
        , a.JobID                                as [JobID]
        , a.JobNumber                            as [JobNumber]
        , a.JobStartDate                         as [JobStartDate]
        , b.StatusID                             as [StatusID]
        , c.[Text]                               as [Status]    
        , b.ReasonTypeID                         as [ReasonTypeID]
        , h.[Text]                               as [Reason]
        , b.Comment                              as [Comment]
        , a.ForemanID                            as [ForemanID]
        , a.ForemanName                          as [ForemanName]
        , a.ForemanRole                          as [ForemanRole]
        , a.ApproverID                           as [Approver]
        , a.ApproverName                         as [ApproverName]
        , a.ApproverRole                         as [ApproverRole]
        , isnull(b.CLUserID, b.CPUserId)         as [RespondedBy]
        , isnull(b.CLUserRole, f.[Text])         as [RespondedByRole]
        , Case 
            When b.CLUserId is not null and b.CLUsername is not null then b.CLUsername
            When b.CLUserID is not null and b.CLUsername is null then a.ApproverName
            When b.cluserid is null then g.[Username]
            else Null
        end                                      as [RespondedByName]
        , b.AddedDate                            as [RespondedOn]
        , b.CPIPAddress                          as [CPIPAddress]
        , b.Active                               as [DFRActive]
		, b.Requester                            as [Requester]
        , 'data:image/png;base64,' + cast('' as xml).value('xs:base64Binary(sql:column("b.signature"))', 'varchAr(max)')   as [SignatureBase64]
        , b.Signature                            as [SignatureBinary]  --- Data type in Crewlink is varbinary(max)

 

    From [dbo].[JobMaster_T]                    a with (nolock)

 



    Join [dbo].[DFRStatusTracking_T]            b with (nolock) on
        a.[ID] = b.[JobMasterID]

    Join [dbo].[Lookup_T]                        c with (nolock) on
        b.[StatusID] = c.[ID]
        and c.[Type] = 'DFRStatus'
        and c.[Active] = 1

 

    outer apply (select top 1 * from  [dbo].[UserRoleRegionMapping_T]    d with (nolock) where
        b.[CPUserID] = d.[UserId]
        and d.[Active] = 1) as p

 

    Left Join [dbo].[TypeRoleMapping_T]        e with (nolock) on
        p.[TypeRoleID] = e.[ID]
        and e.[Active] = 1

 

    Left Join [dbo].[Lookup_T]                    f with (nolock) on
        e.[RoleID] = f.[ID]
        and f.[Type] = 'UserRole'
        and f.Active = 1

 

    Left Join [dbo].[User_T]                    g with(nolock) on
        b.[CPUserID] = G.[ID]
        and g.[Active] = 1

 

    Left Join [dbo].[Lookup_T]                        h with (nolock) on
        b.[ReasonTypeID] = h.[ID]
        and h.[Type] = 'ReasonType'
        and h.[Active] = 1

GO



