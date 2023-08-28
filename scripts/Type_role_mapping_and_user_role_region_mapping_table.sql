/****** Object:  Table [dbo].[TypeRoleMapping_T]    Script Date: 28-11-2022 12:47:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TypeRoleMapping_T]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[TypeRoleMapping_T](
	[TypeRoleMappingId] [bigint] IDENTITY(1,1) NOT NULL,
	[TypeId] [bigint] NOT NULL,
	[RoleId] [bigint] NOT NULL,
	[IS_ACTIVE] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[TypeRoleMappingId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[UserRoleRegionMapping_T]    Script Date: 28-11-2022 12:47:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UserRoleRegionMapping_T]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[UserRoleRegionMapping_T](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[UserID] [bigint] NOT NULL,
	[RoleId] [bigint] NOT NULL,
	[TypeID] [bigint] NOT NULL,
	[RegionID] [bigint] NULL,
	[AddedBy] [bigint] NOT NULL,
	[AddedDate] [datetime] NOT NULL,
	[ChangedBy] [bigint] NULL,
	[ChangedDate] [datetime] NULL,
	[Active] [bit] NOT NULL
 CONSTRAINT [PK_UserRole_T] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF_UserRole_T_AddedDate]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[UserRoleRegionMapping_T] ADD  CONSTRAINT [DF_UserRole_T_AddedDate]  DEFAULT (getdate()) FOR [AddedDate]
END
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DF_UserRole_T_Active]') AND type = 'D')
BEGIN
ALTER TABLE [dbo].[UserRoleRegionMapping_T] ADD  CONSTRAINT [DF_UserRole_T_Active]  DEFAULT ((1)) FOR [Active]
END
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK__TypeRoleM__RoleI__160F4887]') AND parent_object_id = OBJECT_ID(N'[dbo].[TypeRoleMapping_T]'))
ALTER TABLE [dbo].[TypeRoleMapping_T]  WITH CHECK ADD FOREIGN KEY([RoleId])
REFERENCES [dbo].[Lookup_T] ([ID])
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK__TypeRoleM__TypeI__17036CC0]') AND parent_object_id = OBJECT_ID(N'[dbo].[TypeRoleMapping_T]'))
ALTER TABLE [dbo].[TypeRoleMapping_T]  WITH CHECK ADD FOREIGN KEY([TypeId])
REFERENCES [dbo].[Lookup_T] ([ID])
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK__UserRole___Regio__1332DBDC]') AND parent_object_id = OBJECT_ID(N'[dbo].[UserRoleRegionMapping_T]'))
ALTER TABLE [dbo].[UserRoleRegionMapping_T]  WITH CHECK ADD FOREIGN KEY([RegionID])
REFERENCES [dbo].[Lookup_T] ([ID])
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK__UserRoleR__RoleI__18EBB532]') AND parent_object_id = OBJECT_ID(N'[dbo].[UserRoleRegionMapping_T]'))
ALTER TABLE [dbo].[UserRoleRegionMapping_T]  WITH CHECK ADD FOREIGN KEY([RoleId])
REFERENCES [dbo].[Lookup_T] ([ID])
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_UserRole_T_User_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[UserRoleRegionMapping_T]'))
ALTER TABLE [dbo].[UserRoleRegionMapping_T]  WITH CHECK ADD  CONSTRAINT [FK_UserRole_T_User_T] FOREIGN KEY([UserID])
REFERENCES [dbo].[User_T] ([ID])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_UserRole_T_User_T]') AND parent_object_id = OBJECT_ID(N'[dbo].[UserRoleRegionMapping_T]'))
ALTER TABLE [dbo].[UserRoleRegionMapping_T] CHECK CONSTRAINT [FK_UserRole_T_User_T]
GO
