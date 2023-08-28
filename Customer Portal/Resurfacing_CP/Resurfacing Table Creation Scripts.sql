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
