/****** Object:  Table [dbo].[Comment_T]    Script Date: 06-12-2022 16:53:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Comment_T]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Comment_T](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[JobMasterID] [bigint] NOT NULL,
	[CommentTypeID] [bigint] NOT NULL,
	[Comment] [varchar](max) NULL,
	[CLModifiedOn] [datetime] NULL,
	[CLCommentId] [bigint] NOT NULL,
 CONSTRAINT [PK_Comment_T] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[ContractRegionMapping_T]    Script Date: 06-12-2022 16:53:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ContractRegionMapping_T]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[ContractRegionMapping_T](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[Contract] [varchar](50) NOT NULL,
	[RegionID] [bigint] NOT NULL,
	[AddedBy] [bigint] NOT NULL,
	[AddedDate] [datetime] NOT NULL,
	[ChangedBy] [bigint] NULL,
	[ChangedDate] [datetime] NULL,
	[Active] [bit] NOT NULL,
 CONSTRAINT [PK_ContractRegionMapping_T] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[DFRStatusTracking_T]    Script Date: 06-12-2022 16:53:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DFRStatusTracking_T]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[DFRStatusTracking_T](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[JobMasterID] [bigint] NOT NULL,
	[StatusID] [bigint] NOT NULL,
	[Comment] [varchar](max) NULL,
	[AddedDate] [datetime] NOT NULL,
	[ChangedBy] [bigint] NULL,
	[ChangedDate] [datetime] NULL,
	[Active] [bit] NOT NULL,
	[CLUserId] [int] NULL,
	[CPUserId] [bigint] NULL,
	[ReasonTypeID] [bigint] NULL,
 CONSTRAINT [PK_JobStatusTracking_T] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[ErrorLogging_T]    Script Date: 06-12-2022 16:53:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ErrorLogging_T]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[ErrorLogging_T](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[ControllerName] [nvarchar](30) NULL,
	[ErrorStatusCode] [nvarchar](10) NOT NULL,
	[ExceptionDate] [datetime] NOT NULL,
	[ExceptionInnerMessage] [nvarchar](1000) NULL,
	[ExceptionStackTrace] [nvarchar](1000) NULL,
	[ExceptionMessage] [nvarchar](1000) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[JobEquipment_T]    Script Date: 06-12-2022 16:53:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[JobEquipment_T]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[JobEquipment_T](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[JobMasterID] [bigint] NOT NULL,
	[JobEquipmentID] [bigint] NOT NULL,
	[EquipmentCode] [nvarchar](10) NOT NULL,
	[EquipmentDescription] [nvarchar](30) NOT NULL,
	[Hours] [decimal](18, 2) NULL,
	[CLModifiedOn] [datetime] NULL,
 CONSTRAINT [PK_JobEquipment_T] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[JobLabor_T]    Script Date: 06-12-2022 16:53:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[JobLabor_T]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[JobLabor_T](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[JobMasterID] [bigint] NOT NULL,
	[JobLaborID] [bigint] NOT NULL,
	[EmployeeID] [nvarchar](20) NOT NULL,
	[EmployeeName] [nvarchar](80) NOT NULL,
	[STHours] [decimal](18, 2) NULL,
	[OTHours] [decimal](18, 2) NULL,
	[DTHours] [decimal](18, 2) NULL,
	[CLModifiedOn] [datetime] NULL,
 CONSTRAINT [PK_JobLabor_T] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[JobMaster_T]    Script Date: 06-12-2022 16:53:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[JobMaster_T]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[JobMaster_T](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[JobID] [bigint] NOT NULL,
	[CompanyCode] [nvarchar](10) NOT NULL,
	[JobNumber] [nvarchar](10) NOT NULL,
	[JobStartDate] [datetime] NOT NULL,
	[Contract] [varchar](50) NOT NULL,
	[ForemanName] [nvarchar](80) NOT NULL,
	[ApproverName] [nvarchar](80) NOT NULL,
	[ApproverEmail] [nvarchar](80) NULL,
	[AddedDate] [datetime] NOT NULL,
	[ChangedDate] [datetime] NULL,
	[Active] [bit] NOT NULL,
	[ForemanID] [int] NULL,
	[ApproverID] [int] NULL,
	[IsLockDown] [bit] NULL,
	[CLModifiedOn] [datetime] NULL,
	[ForemanRole] [varchar](50) NOT NULL,
	[ApproverRole] [varchar](50) NOT NULL,
 CONSTRAINT [PK_JobMaster_T] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[JobRevenue_T]    Script Date: 06-12-2022 16:53:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[JobRevenue_T]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[JobRevenue_T](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[JobMasterID] [bigint] NOT NULL,
	[JobPayItemID] [bigint] NOT NULL,
	[WIPayItemID] [bigint] NOT NULL,
	[PayItem] [nvarchar](20) NOT NULL,
	[Description] [nvarchar](200) NULL,
	[Qty] [numeric](12, 2) NULL,
	[UOM] [nvarchar](20) NOT NULL,
	[WO] [nvarchar](50) NOT NULL,
	[PO] [nvarchar](50) NULL,
	[Address] [nvarchar](50) NOT NULL,
	[City] [nvarchar](50) NOT NULL,
	[State] [nvarchar](20) NOT NULL,
	[IsTandM] [bit] NOT NULL,
	[CLModifiedOn] [datetime] NULL,
 CONSTRAINT [PK_JobRevenue] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Lookup_T]    Script Date: 06-12-2022 16:53:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Lookup_T]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Lookup_T](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[Type] [nvarchar](255) NOT NULL,
	[Value] [nvarchar](255) NOT NULL,
	[Text] [nvarchar](255) NOT NULL,
	[Description] [nvarchar](255) NULL,
	[SortOrder] [int] NULL,
	[AddedBy] [bigint] NULL,
	[AddedDate] [datetime] NOT NULL,
	[ChangedBy] [bigint] NULL,
	[ChangedDate] [datetime] NULL,
	[Active] [bit] NOT NULL,
 CONSTRAINT [PK_Lookup_T] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[TypeRoleMapping_T]    Script Date: 06-12-2022 16:53:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TypeRoleMapping_T]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[TypeRoleMapping_T](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[TypeID] [bigint] NOT NULL,
	[RoleID] [bigint] NOT NULL,
	[AddedBy] [bigint] NOT NULL,
	[AddedDate] [datetime] NOT NULL,
	[ChangedBy] [bigint] NULL,
	[ChangedDate] [datetime] NULL,
	[Active] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[User_T]    Script Date: 06-12-2022 16:53:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[User_T]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[User_T](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[Username] [nvarchar](30) NOT NULL,
	[FirstName] [nvarchar](30) NOT NULL,
	[LastName] [nvarchar](30) NOT NULL,
	[Email] [nvarchar](255) NOT NULL,
	[PasswordUpdatedOn] [datetime] NULL,
	[IsLockedOut] [bit] NOT NULL,
	[LockedOutOn] [datetime] NULL,
	[LastLoginDate] [datetime] NULL,
	[LoginFailedDate] [datetime] NULL,
	[AccessFailedCount] [int] NOT NULL,
	[IsNewAccount] [bit] NOT NULL,
	[AddedBy] [bigint] NOT NULL,
	[AddedDate] [datetime] NOT NULL,
	[ChangedBy] [bigint] NULL,
	[ChangedDate] [datetime] NULL,
	[Active] [bit] NOT NULL,
	[ForgetPassword] [bit] NULL,
 CONSTRAINT [PK_User_T] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[UserPasswordHistory_T]    Script Date: 06-12-2022 16:53:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UserPasswordHistory_T]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[UserPasswordHistory_T](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[UserID] [bigint] NOT NULL,
	[PasswordHash] [varbinary](255) NULL,
	[PasswordSalt] [varbinary](255) NULL,
	[AddedDate] [datetime] NOT NULL,
	[Active] [bit] NOT NULL,
 CONSTRAINT [PK_UserPasswordHistory_T] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[UserRoleRegionMapping_T]    Script Date: 06-12-2022 16:53:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UserRoleRegionMapping_T]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[UserRoleRegionMapping_T](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[UserID] [bigint] NOT NULL,
	[TypeRoleID] [bigint] NOT NULL,
	[RegionID] [bigint] NOT NULL,
	[AddedBy] [bigint] NOT NULL,
	[AddedDate] [datetime] NOT NULL,
	[ChangedBy] [bigint] NULL,
	[ChangedDate] [datetime] NULL,
	[Active] [bit] NOT NULL,
 CONSTRAINT [PK_UserRoleRegionMapping_T] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF_ContractRegionMapping_T_AddedDate]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[ContractRegionMapping_T] ADD  CONSTRAINT [DF_ContractRegionMapping_T_AddedDate]  DEFAULT (getdate()) FOR [AddedDate]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF_ContractRegionMapping_T_Active]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[ContractRegionMapping_T] ADD  CONSTRAINT [DF_ContractRegionMapping_T_Active]  DEFAULT ((1)) FOR [Active]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF_JobStatusTracking_T_AddedDate]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[DFRStatusTracking_T] ADD  CONSTRAINT [DF_JobStatusTracking_T_AddedDate]  DEFAULT (getdate()) FOR [AddedDate]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF_JobStatusTracking_T_Active]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[DFRStatusTracking_T] ADD  CONSTRAINT [DF_JobStatusTracking_T_Active]  DEFAULT ((1)) FOR [Active]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF_JobMaster_T_AddedDate]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[JobMaster_T] ADD  CONSTRAINT [DF_JobMaster_T_AddedDate]  DEFAULT (getdate()) FOR [AddedDate]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF_JobMaster_T_Active]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[JobMaster_T] ADD  CONSTRAINT [DF_JobMaster_T_Active]  DEFAULT ((1)) FOR [Active]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF__JobMaster__IsLoc__45BE5BA9]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[JobMaster_T] ADD  DEFAULT ((1)) FOR [IsLockDown]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF_JobRevenue_T_IsTandM]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[JobRevenue_T] ADD  CONSTRAINT [DF_JobRevenue_T_IsTandM]  DEFAULT ((0)) FOR [IsTandM]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF_Lookup_T_AddedDate]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[Lookup_T] ADD  CONSTRAINT [DF_Lookup_T_AddedDate]  DEFAULT (getdate()) FOR [AddedDate]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF_Lookup_T_Active]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[Lookup_T] ADD  CONSTRAINT [DF_Lookup_T_Active]  DEFAULT ((1)) FOR [Active]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF__TypeRoleM__Added__3587F3E0]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[TypeRoleMapping_T] ADD  DEFAULT (getdate()) FOR [AddedDate]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF__TypeRoleM__Activ__367C1819]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[TypeRoleMapping_T] ADD  DEFAULT ((1)) FOR [Active]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF_User_T_IsLockedOut]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[User_T] ADD  CONSTRAINT [DF_User_T_IsLockedOut]  DEFAULT ((0)) FOR [IsLockedOut]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF_User_T_AccessFailedCount]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[User_T] ADD  CONSTRAINT [DF_User_T_AccessFailedCount]  DEFAULT ((0)) FOR [AccessFailedCount]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF_User_T_IsNewAccount]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[User_T] ADD  CONSTRAINT [DF_User_T_IsNewAccount]  DEFAULT ((1)) FOR [IsNewAccount]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF_User_T_AddedDate]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[User_T] ADD  CONSTRAINT [DF_User_T_AddedDate]  DEFAULT (getdate()) FOR [AddedDate]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF_User_T_Active]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[User_T] ADD  CONSTRAINT [DF_User_T_Active]  DEFAULT ((1)) FOR [Active]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF_UserPasswordHistory_T_AddedDate]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[UserPasswordHistory_T] ADD  CONSTRAINT [DF_UserPasswordHistory_T_AddedDate]  DEFAULT (getdate()) FOR [AddedDate]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF_UserPasswordHistory_T_Active]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[UserPasswordHistory_T] ADD  CONSTRAINT [DF_UserPasswordHistory_T_Active]  DEFAULT ((1)) FOR [Active]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF__UserRoleR__Added__73852659]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[UserRoleRegionMapping_T] ADD  CONSTRAINT [DF__UserRoleR__Added__73852659]  DEFAULT (getdate()) FOR [AddedDate]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF__UserRoleR__Activ__74794A92]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[UserRoleRegionMapping_T] ADD  CONSTRAINT [DF__UserRoleR__Activ__74794A92]  DEFAULT ((1)) FOR [Active]
END
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK__Comment_T__Comme__2180FB33]') AND parent_object_id = OBJECT_ID(N'[dbo].[Comment_T]'))
ALTER TABLE [dbo].[Comment_T]  WITH CHECK ADD FOREIGN KEY([CommentTypeID])
REFERENCES [dbo].[Lookup_T] ([ID])
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_Comment_T_JobMaster_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[Comment_T]'))
ALTER TABLE [dbo].[Comment_T]  WITH CHECK ADD  CONSTRAINT [FK_Comment_T_JobMaster_T] FOREIGN KEY([JobMasterID])
REFERENCES [dbo].[JobMaster_T] ([ID])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_Comment_T_JobMaster_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[Comment_T]'))
ALTER TABLE [dbo].[Comment_T] CHECK CONSTRAINT [FK_Comment_T_JobMaster_T]
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_ContractRegionMapping_T_Lookup_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[ContractRegionMapping_T]'))
ALTER TABLE [dbo].[ContractRegionMapping_T]  WITH CHECK ADD  CONSTRAINT [FK_ContractRegionMapping_T_Lookup_T] FOREIGN KEY([RegionID])
REFERENCES [dbo].[Lookup_T] ([ID])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_ContractRegionMapping_T_Lookup_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[ContractRegionMapping_T]'))
ALTER TABLE [dbo].[ContractRegionMapping_T] CHECK CONSTRAINT [FK_ContractRegionMapping_T_Lookup_T]
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_ContractRegionMapping_T_User_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[ContractRegionMapping_T]'))
ALTER TABLE [dbo].[ContractRegionMapping_T]  WITH CHECK ADD  CONSTRAINT [FK_ContractRegionMapping_T_User_T] FOREIGN KEY([AddedBy])
REFERENCES [dbo].[User_T] ([ID])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_ContractRegionMapping_T_User_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[ContractRegionMapping_T]'))
ALTER TABLE [dbo].[ContractRegionMapping_T] CHECK CONSTRAINT [FK_ContractRegionMapping_T_User_T]
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_ContractRegionMapping_T_User_T1]') AND parent_object_id = OBJECT_ID(N'[dbo].[ContractRegionMapping_T]'))
ALTER TABLE [dbo].[ContractRegionMapping_T]  WITH CHECK ADD  CONSTRAINT [FK_ContractRegionMapping_T_User_T1] FOREIGN KEY([ChangedBy])
REFERENCES [dbo].[User_T] ([ID])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_ContractRegionMapping_T_User_T1]') AND parent_object_id = OBJECT_ID(N'[dbo].[ContractRegionMapping_T]'))
ALTER TABLE [dbo].[ContractRegionMapping_T] CHECK CONSTRAINT [FK_ContractRegionMapping_T_User_T1]
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK__DFRStatus__CPUse__46B27FE2]') AND parent_object_id = OBJECT_ID(N'[dbo].[DFRStatusTracking_T]'))
ALTER TABLE [dbo].[DFRStatusTracking_T]  WITH CHECK ADD FOREIGN KEY([CPUserId])
REFERENCES [dbo].[User_T] ([ID])
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK__DFRStatus__Statu__47A6A41B]') AND parent_object_id = OBJECT_ID(N'[dbo].[DFRStatusTracking_T]'))
ALTER TABLE [dbo].[DFRStatusTracking_T]  WITH CHECK ADD FOREIGN KEY([StatusID])
REFERENCES [dbo].[Lookup_T] ([ID])
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK__JobStatus__Rejec__208CD6FA]') AND parent_object_id = OBJECT_ID(N'[dbo].[DFRStatusTracking_T]'))
ALTER TABLE [dbo].[DFRStatusTracking_T]  WITH CHECK ADD FOREIGN KEY([ReasonTypeID])
REFERENCES [dbo].[Lookup_T] ([ID])
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_JobStatusTracking_T_JobStatusTracking_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[DFRStatusTracking_T]'))
ALTER TABLE [dbo].[DFRStatusTracking_T]  WITH CHECK ADD  CONSTRAINT [FK_JobStatusTracking_T_JobStatusTracking_T] FOREIGN KEY([JobMasterID])
REFERENCES [dbo].[JobMaster_T] ([ID])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_JobStatusTracking_T_JobStatusTracking_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[DFRStatusTracking_T]'))
ALTER TABLE [dbo].[DFRStatusTracking_T] CHECK CONSTRAINT [FK_JobStatusTracking_T_JobStatusTracking_T]
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_JobEquipment_T_JobMaster_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[JobEquipment_T]'))
ALTER TABLE [dbo].[JobEquipment_T]  WITH CHECK ADD  CONSTRAINT [FK_JobEquipment_T_JobMaster_T] FOREIGN KEY([JobMasterID])
REFERENCES [dbo].[JobMaster_T] ([ID])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_JobEquipment_T_JobMaster_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[JobEquipment_T]'))
ALTER TABLE [dbo].[JobEquipment_T] CHECK CONSTRAINT [FK_JobEquipment_T_JobMaster_T]
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_JobLabor_T_JobMaster_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[JobLabor_T]'))
ALTER TABLE [dbo].[JobLabor_T]  WITH NOCHECK ADD  CONSTRAINT [FK_JobLabor_T_JobMaster_T] FOREIGN KEY([JobMasterID])
REFERENCES [dbo].[JobMaster_T] ([ID])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_JobLabor_T_JobMaster_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[JobLabor_T]'))
ALTER TABLE [dbo].[JobLabor_T] CHECK CONSTRAINT [FK_JobLabor_T_JobMaster_T]
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_JobRevenue_T_JobMaster_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[JobRevenue_T]'))
ALTER TABLE [dbo].[JobRevenue_T]  WITH CHECK ADD  CONSTRAINT [FK_JobRevenue_T_JobMaster_T] FOREIGN KEY([JobMasterID])
REFERENCES [dbo].[JobMaster_T] ([ID])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_JobRevenue_T_JobMaster_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[JobRevenue_T]'))
ALTER TABLE [dbo].[JobRevenue_T] CHECK CONSTRAINT [FK_JobRevenue_T_JobMaster_T]
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK__TypeRoleM__RoleI__793DFFAF]') AND parent_object_id = OBJECT_ID(N'[dbo].[TypeRoleMapping_T]'))
ALTER TABLE [dbo].[TypeRoleMapping_T]  WITH CHECK ADD  CONSTRAINT [FK__TypeRoleM__RoleI__793DFFAF] FOREIGN KEY([RoleID])
REFERENCES [dbo].[Lookup_T] ([ID])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK__TypeRoleM__RoleI__793DFFAF]') AND parent_object_id = OBJECT_ID(N'[dbo].[TypeRoleMapping_T]'))
ALTER TABLE [dbo].[TypeRoleMapping_T] CHECK CONSTRAINT [FK__TypeRoleM__RoleI__793DFFAF]
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK__TypeRoleM__TypeI__76619304]') AND parent_object_id = OBJECT_ID(N'[dbo].[TypeRoleMapping_T]'))
ALTER TABLE [dbo].[TypeRoleMapping_T]  WITH CHECK ADD  CONSTRAINT [FK__TypeRoleM__TypeI__76619304] FOREIGN KEY([TypeID])
REFERENCES [dbo].[Lookup_T] ([ID])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK__TypeRoleM__TypeI__76619304]') AND parent_object_id = OBJECT_ID(N'[dbo].[TypeRoleMapping_T]'))
ALTER TABLE [dbo].[TypeRoleMapping_T] CHECK CONSTRAINT [FK__TypeRoleM__TypeI__76619304]
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_TypeRoleMapping_T_User_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[TypeRoleMapping_T]'))
ALTER TABLE [dbo].[TypeRoleMapping_T]  WITH CHECK ADD  CONSTRAINT [FK_TypeRoleMapping_T_User_T] FOREIGN KEY([AddedBy])
REFERENCES [dbo].[User_T] ([ID])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_TypeRoleMapping_T_User_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[TypeRoleMapping_T]'))
ALTER TABLE [dbo].[TypeRoleMapping_T] CHECK CONSTRAINT [FK_TypeRoleMapping_T_User_T]
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_TypeRoleMapping_T_User_T1]') AND parent_object_id = OBJECT_ID(N'[dbo].[TypeRoleMapping_T]'))
ALTER TABLE [dbo].[TypeRoleMapping_T]  WITH CHECK ADD  CONSTRAINT [FK_TypeRoleMapping_T_User_T1] FOREIGN KEY([ChangedBy])
REFERENCES [dbo].[User_T] ([ID])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_TypeRoleMapping_T_User_T1]') AND parent_object_id = OBJECT_ID(N'[dbo].[TypeRoleMapping_T]'))
ALTER TABLE [dbo].[TypeRoleMapping_T] CHECK CONSTRAINT [FK_TypeRoleMapping_T_User_T1]
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_UserPasswordHistory_T_User_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[UserPasswordHistory_T]'))
ALTER TABLE [dbo].[UserPasswordHistory_T]  WITH CHECK ADD  CONSTRAINT [FK_UserPasswordHistory_T_User_T] FOREIGN KEY([UserID])
REFERENCES [dbo].[User_T] ([ID])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_UserPasswordHistory_T_User_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[UserPasswordHistory_T]'))
ALTER TABLE [dbo].[UserPasswordHistory_T] CHECK CONSTRAINT [FK_UserPasswordHistory_T_User_T]
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK__UserRoleR__Regio__7755B73D]') AND parent_object_id = OBJECT_ID(N'[dbo].[UserRoleRegionMapping_T]'))
ALTER TABLE [dbo].[UserRoleRegionMapping_T]  WITH CHECK ADD  CONSTRAINT [FK__UserRoleR__Regio__7755B73D] FOREIGN KEY([RegionID])
REFERENCES [dbo].[Lookup_T] ([ID])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK__UserRoleR__Regio__7755B73D]') AND parent_object_id = OBJECT_ID(N'[dbo].[UserRoleRegionMapping_T]'))
ALTER TABLE [dbo].[UserRoleRegionMapping_T] CHECK CONSTRAINT [FK__UserRoleR__Regio__7755B73D]
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_UserRoleRegionMapping_T_User_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[UserRoleRegionMapping_T]'))
ALTER TABLE [dbo].[UserRoleRegionMapping_T]  WITH CHECK ADD  CONSTRAINT [FK_UserRoleRegionMapping_T_User_T] FOREIGN KEY([UserID])
REFERENCES [dbo].[User_T] ([ID])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_UserRoleRegionMapping_T_User_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[UserRoleRegionMapping_T]'))
ALTER TABLE [dbo].[UserRoleRegionMapping_T] CHECK CONSTRAINT [FK_UserRoleRegionMapping_T_User_T]
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_UserRoleRegionMapping_T_User_T1]') AND parent_object_id = OBJECT_ID(N'[dbo].[UserRoleRegionMapping_T]'))
ALTER TABLE [dbo].[UserRoleRegionMapping_T]  WITH CHECK ADD  CONSTRAINT [FK_UserRoleRegionMapping_T_User_T1] FOREIGN KEY([AddedBy])
REFERENCES [dbo].[User_T] ([ID])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_UserRoleRegionMapping_T_User_T1]') AND parent_object_id = OBJECT_ID(N'[dbo].[UserRoleRegionMapping_T]'))
ALTER TABLE [dbo].[UserRoleRegionMapping_T] CHECK CONSTRAINT [FK_UserRoleRegionMapping_T_User_T1]
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_UserRoleRegionMapping_T_User_T2]') AND parent_object_id = OBJECT_ID(N'[dbo].[UserRoleRegionMapping_T]'))
ALTER TABLE [dbo].[UserRoleRegionMapping_T]  WITH CHECK ADD  CONSTRAINT [FK_UserRoleRegionMapping_T_User_T2] FOREIGN KEY([ChangedBy])
REFERENCES [dbo].[User_T] ([ID])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_UserRoleRegionMapping_T_User_T2]') AND parent_object_id = OBJECT_ID(N'[dbo].[UserRoleRegionMapping_T]'))
ALTER TABLE [dbo].[UserRoleRegionMapping_T] CHECK CONSTRAINT [FK_UserRoleRegionMapping_T_User_T2]
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_UserRoleRegionMapping_T_User_T3]') AND parent_object_id = OBJECT_ID(N'[dbo].[UserRoleRegionMapping_T]'))
ALTER TABLE [dbo].[UserRoleRegionMapping_T]  WITH CHECK ADD  CONSTRAINT [FK_UserRoleRegionMapping_T_User_T3] FOREIGN KEY([AddedBy])
REFERENCES [dbo].[User_T] ([ID])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_UserRoleRegionMapping_T_User_T3]') AND parent_object_id = OBJECT_ID(N'[dbo].[UserRoleRegionMapping_T]'))
ALTER TABLE [dbo].[UserRoleRegionMapping_T] CHECK CONSTRAINT [FK_UserRoleRegionMapping_T_User_T3]
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_UserRoleRegionMapping_T_User_T4]') AND parent_object_id = OBJECT_ID(N'[dbo].[UserRoleRegionMapping_T]'))
ALTER TABLE [dbo].[UserRoleRegionMapping_T]  WITH CHECK ADD  CONSTRAINT [FK_UserRoleRegionMapping_T_User_T4] FOREIGN KEY([ChangedBy])
REFERENCES [dbo].[User_T] ([ID])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_UserRoleRegionMapping_T_User_T4]') AND parent_object_id = OBJECT_ID(N'[dbo].[UserRoleRegionMapping_T]'))
ALTER TABLE [dbo].[UserRoleRegionMapping_T] CHECK CONSTRAINT [FK_UserRoleRegionMapping_T_User_T4]
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_UserRoleRegionMapping_T_UserRoleRegionMapping_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[UserRoleRegionMapping_T]'))
ALTER TABLE [dbo].[UserRoleRegionMapping_T]  WITH CHECK ADD  CONSTRAINT [FK_UserRoleRegionMapping_T_UserRoleRegionMapping_T] FOREIGN KEY([TypeRoleID])
REFERENCES [dbo].[TypeRoleMapping_T] ([ID])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_UserRoleRegionMapping_T_UserRoleRegionMapping_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[UserRoleRegionMapping_T]'))
ALTER TABLE [dbo].[UserRoleRegionMapping_T] CHECK CONSTRAINT [FK_UserRoleRegionMapping_T_UserRoleRegionMapping_T]
GO
