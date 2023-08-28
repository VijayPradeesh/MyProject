/****** Object:  Table [dbo].[CL_NASHVILLE_DFN_DATA_T]    Script Date: 14-03-2022 12:21:02 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CL_NASHVILLE_DFN_DATA_T]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[CL_NASHVILLE_DFN_DATA_T](
	[JOB_ID] [bigint] NOT NULL,
	[PAY_ITEM_NUMBER] [nvarchar](50) NULL,
	[PAY_ITEM_DESCRIPTION] [nvarchar](50) NULL,
	[UOM] [nvarchar](10) NULL,
	[START_STATION] [nvarchar](50) NULL,
	[STOP_STATION] [nvarchar](50) NULL,
	[IS_ACTIVE] [bit] NULL,
	[CREATED_ON] [datetime] NULL,
	[CREATED_BY] [int] NULL,
	[MODIFIED_BY] [int] NULL,
	[DFN_ID] [bigint] IDENTITY(1,1) NOT NULL,
	[MODIFIED_ON] [datetime] NULL,
	[TOTAL_FOOTAGE] [int] NOT NULL,
 CONSTRAINT [PK_vashDFNdata] PRIMARY KEY CLUSTERED 
(
	[DFN_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
--IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF__CL_NASHVI__TOTAL__5FA91635]') AND type = 'D')
--BEGIN
--ALTER TABLE [dbo].[CL_NASHVILLE_DFN_DATA_T] ADD  DEFAULT ((0)) FOR [TOTAL_FOOTAGE]
--END
--GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_NDFN_JOB]') AND parent_object_id = OBJECT_ID(N'[dbo].[CL_NASHVILLE_DFN_DATA_T]'))
ALTER TABLE [dbo].[CL_NASHVILLE_DFN_DATA_T]  WITH CHECK ADD  CONSTRAINT [FK_NDFN_JOB] FOREIGN KEY([JOB_ID])
REFERENCES [dbo].[CL_JOB_T] ([JOB_ID])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_NDFN_JOB]') AND parent_object_id = OBJECT_ID(N'[dbo].[CL_NASHVILLE_DFN_DATA_T]'))
ALTER TABLE [dbo].[CL_NASHVILLE_DFN_DATA_T] CHECK CONSTRAINT [FK_NDFN_JOB]
GO
