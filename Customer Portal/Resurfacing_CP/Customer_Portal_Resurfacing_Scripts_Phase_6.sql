-------------------------------------------------------------------------------------------
---------------------------Customer Portal Resurfacing scripts-----------------------------
-------------------------------------------------------------------------------------------



------------------->Table Creation

/****** Object:  Table [dbo].[ResurfacingAdditionalMaterial_T]    Script Date: 12-06-2023 09:50:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ResurfacingAdditionalMaterial_T]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[ResurfacingAdditionalMaterial_T](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[ResurfacingMasterId] [bigint] NOT NULL,
	[AdditionalMaterial] [nvarchar](50) NOT NULL,
	[Quantity] [decimal](18, 2) NOT NULL,
	[CLModifiedOn] [datetime] NULL,
 CONSTRAINT [PK_ResurfacingAdditionalMaterial] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[ResurfacingDrawingImages_T]    Script Date: 12-06-2023 09:50:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ResurfacingDrawingImages_T]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[ResurfacingDrawingImages_T](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[ResurfacingMasterId] [bigint] NOT NULL,
	[ImageOrder] [int] NULL,
	[CLModifiedOn] [datetime] NULL,
	[Comments] [nvarchar](1000) NULL,
	[Flag] [nvarchar](2) NULL,
	[ImagesBinary] [varbinary](max) NULL,
 CONSTRAINT [PK_ResurfacingDrawingImages] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[ResurfacingMaster_T]    Script Date: 12-06-2023 09:50:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ResurfacingMaster_T]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[ResurfacingMaster_T](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[ResurfacingId] [bigint] NOT NULL,
	[CompanyCode] [nvarchar](10) NOT NULL,
	[JobNumber] [nvarchar](10) NOT NULL,
	[JobStartDate] [datetime] NOT NULL,
	[Contract] [nvarchar](50) NOT NULL,
	[ForemanName] [nvarchar](80) NOT NULL,
	[ApproverName] [nvarchar](80) NOT NULL,
	[ApproverEmail] [nvarchar](80) NULL,
	[AddedDate] [datetime] NOT NULL,
	[ChangedDate] [datetime] NULL,
	[Active] [bit] NOT NULL,
	[ForemanID] [int] NULL,
	[ApproverID] [int] NULL,
	[CLModifiedOn] [datetime] NULL,
	[ForemanRole] [nvarchar](50) NOT NULL,
	[ApproverRole] [nvarchar](50) NOT NULL,
	[StreetAddress] [nvarchar](120) NOT NULL,
	[WorkOrder] [nvarchar](50) NOT NULL,
	[City] [nvarchar](50) NOT NULL,
	[State] [nvarchar](20) NOT NULL,
	[BacklogWorkDate] [datetime] NULL,
	[TrafficControl] [bit] NULL,
	[CustomerComplaint] [bit] NULL,
	[Comments] [nvarchar](400) NULL,
	[IsSquareFeet] [bit] NOT NULL,
	[IsRequester] [bit] NULL,
 CONSTRAINT [PK_ResurfacingMaster_T] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[ResurfacingRestored_T]    Script Date: 12-06-2023 09:50:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ResurfacingRestored_T]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[ResurfacingRestored_T](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[ResurfacingMasterId] [bigint] NOT NULL,
	[SurfaceType] [nvarchar](50) NOT NULL,
	[MaterialType] [nvarchar](50) NOT NULL,
	[OriginalLength] [decimal](18, 2) NULL,
	[OriginalWidth] [decimal](18, 2) NULL,
	[OriginalDepth] [decimal](18, 2) NULL,
	[OriginalDiameter] [decimal](18, 2) NULL,
	[OriginalCount] [decimal](18, 2) NULL,
	[OriginalType] [nvarchar](200) NULL,
	[OriginalTotal] [decimal](18, 2) NULL,
	[RestoredLength] [decimal](18, 2) NULL,
	[RestoredWidth] [decimal](18, 2) NULL,
	[RestoredDepth] [decimal](18, 2) NULL,
	[RestoredDiameter] [decimal](18, 2) NULL,
	[RestoredTotal] [decimal](18, 2) NULL,
	[RestoredType] [nvarchar](200) NULL,
	[IsCompleted] [bit] NULL,
	[CLModifiedOn] [datetime] NULL,
	[RestoredCount] [decimal](18, 2) NULL,
 CONSTRAINT [PK_ResurfacingAdditionalMaterial_T] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[ResurfacingStatusTracking_T]    Script Date: 12-06-2023 09:50:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ResurfacingStatusTracking_T]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[ResurfacingStatusTracking_T](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[ResurfacingMasterId] [bigint] NOT NULL,
	[StatusID] [bigint] NOT NULL,
	[Comment] [varchar](max) NULL,
	[AddedDate] [datetime] NOT NULL,
	[ChangedBy] [bigint] NULL,
	[ChangedDate] [datetime] NULL,
	[Active] [bit] NOT NULL,
	[CLUserId] [bigint] NULL,
	[CPUserId] [bigint] NULL,
	[ReasonTypeID] [bigint] NULL,
	[CPIPAddress] [nvarchar](25) NULL,
	[CLUsername] [varchar](50) NULL,
	[CLUserRole] [varchar](50) NULL,
	[Signature] [varbinary](max) NULL,
	[Requester] [nvarchar](50) NULL,
 CONSTRAINT [PK_ResurfacingStatusTracking_T] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF_ResurfacingMaster_T_AddedDate]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[ResurfacingMaster_T] ADD  CONSTRAINT [DF_ResurfacingMaster_T_AddedDate]  DEFAULT (getdate()) FOR [AddedDate]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF_ResurfacingMaster_T_Active]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[ResurfacingMaster_T] ADD  CONSTRAINT [DF_ResurfacingMaster_T_Active]  DEFAULT ((1)) FOR [Active]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF__Resurfaci__IsSqu__7073AF84]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[ResurfacingMaster_T] ADD  DEFAULT ((0)) FOR [IsSquareFeet]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF_ResurfacingStatusTracking_T_AddedDate]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[ResurfacingStatusTracking_T] ADD  CONSTRAINT [DF_ResurfacingStatusTracking_T_AddedDate]  DEFAULT (getdate()) FOR [AddedDate]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF_ResurfacingStatusTracking_T_Active]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[ResurfacingStatusTracking_T] ADD  CONSTRAINT [DF_ResurfacingStatusTracking_T_Active]  DEFAULT ((1)) FOR [Active]
END
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_ResurfacingAdditionalMaterial_ResurfacingMaster_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[ResurfacingAdditionalMaterial_T]'))
ALTER TABLE [dbo].[ResurfacingAdditionalMaterial_T]  WITH CHECK ADD  CONSTRAINT [FK_ResurfacingAdditionalMaterial_ResurfacingMaster_T] FOREIGN KEY([ResurfacingMasterId])
REFERENCES [dbo].[ResurfacingMaster_T] ([ID])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_ResurfacingAdditionalMaterial_ResurfacingMaster_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[ResurfacingAdditionalMaterial_T]'))
ALTER TABLE [dbo].[ResurfacingAdditionalMaterial_T] CHECK CONSTRAINT [FK_ResurfacingAdditionalMaterial_ResurfacingMaster_T]
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_ResurfacingDrawingImages_ResurfacingMaster_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[ResurfacingDrawingImages_T]'))
ALTER TABLE [dbo].[ResurfacingDrawingImages_T]  WITH CHECK ADD  CONSTRAINT [FK_ResurfacingDrawingImages_ResurfacingMaster_T] FOREIGN KEY([ResurfacingMasterId])
REFERENCES [dbo].[ResurfacingMaster_T] ([ID])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_ResurfacingDrawingImages_ResurfacingMaster_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[ResurfacingDrawingImages_T]'))
ALTER TABLE [dbo].[ResurfacingDrawingImages_T] CHECK CONSTRAINT [FK_ResurfacingDrawingImages_ResurfacingMaster_T]
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_ResurfacingAdditionalMaterial_T_ResurfacingMaster_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[ResurfacingRestored_T]'))
ALTER TABLE [dbo].[ResurfacingRestored_T]  WITH CHECK ADD  CONSTRAINT [FK_ResurfacingAdditionalMaterial_T_ResurfacingMaster_T] FOREIGN KEY([ResurfacingMasterId])
REFERENCES [dbo].[ResurfacingMaster_T] ([ID])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_ResurfacingAdditionalMaterial_T_ResurfacingMaster_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[ResurfacingRestored_T]'))
ALTER TABLE [dbo].[ResurfacingRestored_T] CHECK CONSTRAINT [FK_ResurfacingAdditionalMaterial_T_ResurfacingMaster_T]
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK__Resurfaci__CPUse__6225902D]') AND parent_object_id = OBJECT_ID(N'[dbo].[ResurfacingStatusTracking_T]'))
ALTER TABLE [dbo].[ResurfacingStatusTracking_T]  WITH CHECK ADD FOREIGN KEY([CPUserId])
REFERENCES [dbo].[User_T] ([ID])
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK__Resurfaci__Reaso__640DD89F]') AND parent_object_id = OBJECT_ID(N'[dbo].[ResurfacingStatusTracking_T]'))
ALTER TABLE [dbo].[ResurfacingStatusTracking_T]  WITH CHECK ADD FOREIGN KEY([ReasonTypeID])
REFERENCES [dbo].[Lookup_T] ([ID])
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK__Resurfaci__Statu__6319B466]') AND parent_object_id = OBJECT_ID(N'[dbo].[ResurfacingStatusTracking_T]'))
ALTER TABLE [dbo].[ResurfacingStatusTracking_T]  WITH CHECK ADD FOREIGN KEY([StatusID])
REFERENCES [dbo].[Lookup_T] ([ID])
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_ResurfacingStatusTracking]') AND parent_object_id = OBJECT_ID(N'[dbo].[ResurfacingStatusTracking_T]'))
ALTER TABLE [dbo].[ResurfacingStatusTracking_T]  WITH CHECK ADD  CONSTRAINT [FK_ResurfacingStatusTracking] FOREIGN KEY([ResurfacingMasterId])
REFERENCES [dbo].[ResurfacingMaster_T] ([ID])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_ResurfacingStatusTracking]') AND parent_object_id = OBJECT_ID(N'[dbo].[ResurfacingStatusTracking_T]'))
ALTER TABLE [dbo].[ResurfacingStatusTracking_T] CHECK CONSTRAINT [FK_ResurfacingStatusTracking]
GO


------------------->Data Insertion

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

BEGIN 
	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Lookup_T] WHERE Type = 'Screens' AND VALUE = 'Contract Mapping')
	BEGIN 
	INSERT [dbo].Lookup_T(Type, Value, Text, Description, SortOrder, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
	VALUES (
	'Screens', 
	'Contract Mapping',
	'Contract Mapping',
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
	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Lookup_T] WHERE Type = 'Screens' AND VALUE = 'Screen Mapping')
	BEGIN 
	INSERT [dbo].Lookup_T(Type, Value, Text, Description, SortOrder, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
	VALUES (
	'Screens', 
	'Screen Mapping',
	'Screen Mapping',
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
	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Lookup_T] WHERE Type = 'SurfacesRestored' AND VALUE = 'length')
	BEGIN 
	INSERT [dbo].Lookup_T(Type, Value, Text, Description, SortOrder, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
	VALUES (
	'SurfacesRestored', 
	'length',
	'Length',
	'ResurfacingHeader',
	1,
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), 
	GETDATE(), 
	NULL, NULL, 
	1
	)
	END
END

BEGIN 
	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Lookup_T] WHERE Type = 'SurfacesRestored' AND VALUE = 'width')
	BEGIN 
	INSERT [dbo].Lookup_T(Type, Value, Text, Description, SortOrder, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
	VALUES (
	'SurfacesRestored', 
	'width',
	'Width',
	'ResurfacingHeader',
	2,
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), 
	GETDATE(), 
	NULL, NULL, 
	1
	)
	END
END


BEGIN 
	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Lookup_T] WHERE Type = 'SurfacesRestored' AND VALUE = 'diameter')
	BEGIN 
	INSERT [dbo].Lookup_T(Type, Value, Text, Description, SortOrder, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
	VALUES (
	'SurfacesRestored', 
	'diameter',
	'Diameter',
	'ResurfacingHeader',
	3,
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), 
	GETDATE(), 
	NULL, NULL, 
	1
	)
	END
END


BEGIN 
	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Lookup_T] WHERE Type = 'SurfacesRestored' AND VALUE = 'depth')
	BEGIN 
	INSERT [dbo].Lookup_T(Type, Value, Text, Description, SortOrder, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
	VALUES (
	'SurfacesRestored', 
	'depth',
	'Depth',
	'ResurfacingHeader',
	4,
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), 
	GETDATE(), 
	NULL, NULL, 
	1
	)
	END
END


BEGIN 
	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Lookup_T] WHERE Type = 'SurfacesRestored' AND VALUE = 'quantity')
	BEGIN 
	INSERT [dbo].Lookup_T(Type, Value, Text, Description, SortOrder, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
	VALUES (
	'SurfacesRestored', 
	'quantity',
	'Quantity',
	'ResurfacingHeader',
	5,
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), 
	GETDATE(), 
	NULL, NULL, 
	1
	)
	END
END

BEGIN 
	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Lookup_T] WHERE Type = 'SurfacesRestored' AND [Value] = 'total' AND [Text] = 'Total(Sq. ft)')
	BEGIN 
	INSERT [dbo].Lookup_T(Type, Value, Text, Description, SortOrder, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
	VALUES (
	'SurfacesRestored', 
	'total',
	'Total(Sq. ft)',
	'ResurfacingHeader',
	6,
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), 
	GETDATE(), 
	NULL, NULL, 
	1
	)
	END
END

BEGIN 
	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Lookup_T] WHERE Type = 'SurfacesRestored' AND [Value] = 'total' AND [Text] = 'Total(Cu. yd)')
	BEGIN 
	INSERT [dbo].Lookup_T(Type, Value, Text, Description, SortOrder, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
	VALUES (
	'SurfacesRestored', 
	'total',
	'Total(Cu. yd)',
	'ResurfacingHeader',
	6,
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), 
	GETDATE(), 
	NULL, NULL, 
	1
	)
	END
END


BEGIN 
	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Lookup_T] WHERE Type = 'SurfacesRestored' AND VALUE = 'type')
	BEGIN 
	INSERT [dbo].Lookup_T(Type, Value, Text, Description, SortOrder, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
	VALUES (
	'SurfacesRestored', 
	'type',
	'Type',
	'ResurfacingHeader',
	7,
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), 
	GETDATE(), 
	NULL, NULL, 
	1
	)
	END
END

BEGIN 
	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Lookup_T] WHERE Type = 'SurfacesRestored' AND VALUE = 'type')
	BEGIN 
	INSERT [dbo].Lookup_T(Type, Value, Text, Description, SortOrder, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
	VALUES (
	'SurfacesRestored', 
	'type',
	'Type',
	'ResurfacingHeader',
	7,
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), 
	GETDATE(), 
	NULL, NULL, 
	1
	)
	END
END

BEGIN
	--- Changing Home to Dashboard
	UPDATE  dbo.Lookup_T
	SET Value = 'Dashboard', Text = 'Dashboard'
	where Type = 'Screens' and Value = 'Home'
END;

-------INSERTING CONTRACT MAPPING SCREEN FOR MEARS ADMIN----------------
IF NOT EXISTS (SELECT TOP 1 * FROM TypeRoleScreenMapping_T WHERE 
		CompanyRoleID = (SELECT TOP 1 ID FROM TypeRoleMapping_T WHERE 
						CompanyID = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Company' and Value = 'Mears' and Active = 1) and 
						RoleID = (select top 1 ID from Lookup_T where Type = 'UserRole' and Value = 'Admin') AND 
						Active = 1) and 
		ScreenID = (select top 1 ID from Lookup_T where Type = 'Screens' and Value = 'Contract Mapping') and 
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
			    (select top 1 ID from Lookup_T where Type = 'Screens' and Value = 'Contract Mapping'),
				(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'),
				 GETDATE(),
				 NULL,
				 NULL, 
				 1)
END;

-------INSERTING SCREEN MAPPING SCREEN FOR MEARS ADMIN----------------
IF NOT EXISTS (SELECT TOP 1 * FROM TypeRoleScreenMapping_T WHERE 
		CompanyRoleID = (SELECT TOP 1 ID FROM TypeRoleMapping_T WHERE 
						CompanyID = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Company' and Value = 'Mears' and Active = 1) and 
						RoleID = (select top 1 ID from Lookup_T where Type = 'UserRole' and Value = 'Admin') AND 
						Active = 1) and 
		ScreenID = (select top 1 ID from Lookup_T where Type = 'Screens' and Value = 'Screen Mapping') and 
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
			    (select top 1 ID from Lookup_T where Type = 'Screens' and Value = 'Screen Mapping'),
				(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'),
				 GETDATE(),
				 NULL,
				 NULL, 
				 1)
END;

------------------->View


/****** Object:  View [dbo].[ResurfacingStatusDetails_v]    Script Date: 12-06-2023 09:45:32 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO






/****** Script for SelectTopNRows command from SSMS  *****
 Select * From 	dbo.DFRStatusDetails_v */
CREATE View [dbo].[ResurfacingStatusDetails_v]
as
	
	Select 
        a.ID                                     as [ResurfacingMasterID]
        , a.ResurfacingId                        as [ResurfacingId]
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
		, case 
			when b.Signature is not null then 'image/png'
		end as [MIME]
        , cast('' as xml).value('xs:base64Binary(sql:column("b.signature"))', 'varchar(max)')   as [SignatureBase64]
        --, b.Signature                            as [SignatureBinary]  --- Data type in Crewlink is varbinary(max)

    From [dbo].[ResurfacingMaster_T]                    a with (nolock)

    Join [dbo].[ResurfacingStatusTracking_T]            b with (nolock) on
        a.[ID] = b.ResurfacingMasterId

    Join [dbo].[Lookup_T]                       c with (nolock) on
        b.[StatusID] = c.[ID]
        and c.[Type] = 'DFRStatus'
        and c.[Active] = 1

    outer apply (
					Select Top 1 
						UserID
						, TypeRoleID
					From [dbo].[UserRoleRegionMapping_T] d with (nolock) 
					Where
       					b.[CPUserID] = d.[UserId]
       					and d.[Active] = 1
				) as p

    Left Join [dbo].[TypeRoleMapping_T]        e with (nolock) on
        p.[TypeRoleID] = e.[ID]
        and e.[Active] = 1

    Left Join [dbo].[Lookup_T]                 f with (nolock) on
        e.[RoleID] = f.[ID]
        and f.[Type] = 'UserRole'
        and f.Active = 1

    Left Join [dbo].[User_T]                   g with(nolock) on
        b.[CPUserID] = G.[ID]
        and g.[Active] = 1

    Left Join [dbo].[Lookup_T]                 h with (nolock) on
        b.[ReasonTypeID] = h.[ID]
        and h.[Type] = 'ReasonType'
        and h.[Active] = 1

	Where
		a.Active = 1

GO



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




