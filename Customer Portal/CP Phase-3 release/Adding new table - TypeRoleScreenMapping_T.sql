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
