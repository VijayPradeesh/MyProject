/****** Object:  Table [dbo].[SewerCam_T]    Script Date: 05-05-2023 19:12:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SewerCam_T]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[SewerCam_T](
	[SewerCamId] [bigint] IDENTITY(1,1) NOT NULL,
	[JobMasterId] [bigint] NOT NULL,
	[ActivityTypeId] [bigint] NULL,
	[Inspector] [nvarchar](50) NULL,
	[County] [nvarchar](50) NULL,
	[Phase] [nvarchar](50) NULL,
	[Comments] [nvarchar](400) NULL,
	[CLModifiedOn] [datetime] NULL,
	[TruckId] [nvarchar](50) NULL,
 CONSTRAINT [PK_SewerCam_T] PRIMARY KEY CLUSTERED 
(
	[SewerCamId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[SewerCamDetails_T]    Script Date: 05-05-2023 19:12:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SewerCamDetails_T]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[SewerCamDetails_T](
	[SewerCamDetailsId] [bigint] IDENTITY(1,1) NOT NULL,
	[SewerCamId] [bigint] NULL,
	[SewerCamTypeId] [bigint] NULL,
	[Location] [nvarchar](50) NULL,
	[Feet] [nvarchar](20) NULL,
	[CLModifiedOn] [datetime] NULL,
	[ItemOrder] [int] NULL,
 CONSTRAINT [PK_SewerCamDetails_T] PRIMARY KEY CLUSTERED 
(
	[SewerCamDetailsId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_SewerCam_T_JobMaster_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[SewerCam_T]'))
ALTER TABLE [dbo].[SewerCam_T]  WITH CHECK ADD  CONSTRAINT [FK_SewerCam_T_JobMaster_T] FOREIGN KEY([JobMasterId])
REFERENCES [dbo].[JobMaster_T] ([ID])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_SewerCam_T_JobMaster_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[SewerCam_T]'))
ALTER TABLE [dbo].[SewerCam_T] CHECK CONSTRAINT [FK_SewerCam_T_JobMaster_T]
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_SewerCam_T_Lookup_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[SewerCam_T]'))
ALTER TABLE [dbo].[SewerCam_T]  WITH CHECK ADD  CONSTRAINT [FK_SewerCam_T_Lookup_T] FOREIGN KEY([ActivityTypeId])
REFERENCES [dbo].[Lookup_T] ([ID])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_SewerCam_T_Lookup_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[SewerCam_T]'))
ALTER TABLE [dbo].[SewerCam_T] CHECK CONSTRAINT [FK_SewerCam_T_Lookup_T]
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK__SewerCamD__Sewer__4A4E069C]') AND parent_object_id = OBJECT_ID(N'[dbo].[SewerCamDetails_T]'))
ALTER TABLE [dbo].[SewerCamDetails_T]  WITH CHECK ADD FOREIGN KEY([SewerCamId])
REFERENCES [dbo].[SewerCam_T] ([SewerCamId])
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_SewerCamDetails_T_Lookup_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[SewerCamDetails_T]'))
ALTER TABLE [dbo].[SewerCamDetails_T]  WITH CHECK ADD  CONSTRAINT [FK_SewerCamDetails_T_Lookup_T] FOREIGN KEY([SewerCamTypeId])
REFERENCES [dbo].[Lookup_T] ([ID])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_SewerCamDetails_T_Lookup_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[SewerCamDetails_T]'))
ALTER TABLE [dbo].[SewerCamDetails_T] CHECK CONSTRAINT [FK_SewerCamDetails_T_Lookup_T]
GO
