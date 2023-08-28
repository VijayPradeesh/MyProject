SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF OBJECT_ID('tempdb..#lookup_temp') IS NOT NULL 
BEGIN
 DROP TABLE #lookup_temp
END



CREATE TABLE #lookup_temp (
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
	[Active] [bit] NOT NULL)
GO




SET IDENTITY_INSERT #lookup_temp ON 
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (1, N'CommentType', N'E', N'Equipment', N'CrewLink Comment Type', 1, 1, CAST(N'2022-11-23T11:18:58.630' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (2, N'CommentType', N'L', N'Labor', N'CrewLink Comment Type', 2, 1, CAST(N'2022-11-23T11:18:58.630' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (3, N'CommentType', N'P', N'Pay Item (Revenue)', N'CrewLink Comment Type', 3, 1, CAST(N'2022-11-23T11:18:58.630' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (4, N'UserType', N'Mears', N'Mears', N'Mears User Type', 1, 1, CAST(N'2022-11-23T11:18:58.630' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (5, N'UserType', N'Spire', N'Spire', N'Mears User Type', 2, 1, CAST(N'2022-11-23T11:18:58.630' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (6, N'UserRole', N'Admin', N'Admin', N'Administrator Role', 1, 1, CAST(N'2022-11-23T11:18:58.630' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (7, N'UserRole', N'Inspector', N'Inspector', N'Inspector Role', 2, 1, CAST(N'2022-11-23T11:18:58.630' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (9, N'Region', N'KC', N'KC', N'KC', 1, 1, CAST(N'2022-11-23T11:18:58.630' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (11, N'Production', N'payitem', N'PayItem', N'Production header', 1, 1, CAST(N'2022-11-25T11:12:52.693' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (12, N'Production', N'description', N'Description', N'Production header', 1, 1, CAST(N'2022-11-25T11:13:56.237' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (13, N'Production', N'quantity', N'Quantity', N'Production header', 1, 1, CAST(N'2022-11-25T11:14:41.867' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (14, N'Production', N'wo', N'WO#', N'Production header', 1, 1, CAST(N'2022-11-25T11:15:12.403' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (15, N'Production', N'location', N'Location', N'Production header', 1, 1, CAST(N'2022-11-25T11:15:57.823' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (16, N'T&M', N'payitem', N'Pay Item', N'T&M header', 1, 1, CAST(N'2022-11-25T11:21:52.730' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (17, N'T&M', N'description', N'Description', N'T&M header', 1, 1, CAST(N'2022-11-25T11:22:10.583' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (18, N'T&M', N'quantity', N'Quantity', N'T&M header', 1, 1, CAST(N'2022-11-25T11:22:24.387' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (19, N'T&M', N'wo', N'WO#', N'T&M header', 1, 1, CAST(N'2022-11-25T11:22:37.557' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (20, N'T&M', N'location', N'Location', N'T&M header', 1, 1, CAST(N'2022-11-25T11:22:50.257' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (21, N'Labour', N'employee', N'Employee', N'Labour header', 1, 1, CAST(N'2022-11-25T11:23:57.240' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (22, N'Labour', N'ot', N'OT', N'Labour header', 1, 1, CAST(N'2022-11-25T11:24:58.450' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (23, N'Labour', N'dt', N'DT', N'Labour header', 1, 1, CAST(N'2022-11-25T11:24:58.450' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (24, N'Labour', N'st', N'ST', N'Labour header', 1, 1, CAST(N'2022-11-25T11:25:21.687' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (25, N'Equipment', N'equipment', N'Equipment', N'Equipment header', 1, 1, CAST(N'2022-11-25T11:26:52.273' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (26, N'Equipment', N'description', N'Description', N'Equipment header', 1, 1, CAST(N'2022-11-25T11:26:52.273' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (27, N'Equipment', N'hours', N'Hours', N'Equipment header', 1, 1, CAST(N'2022-11-25T11:26:52.273' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (28, N'Contract', N'SPIRE 21-23A', N'SPIRE 21-23A', N'Spire Contract', 1, 1, CAST(N'2022-11-25T14:46:20.503' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (29, N'Contract', N'SPIRE 21-23 B', N'SPIRE 21-23 B', N'Spire Contract', 1, 1, CAST(N'2022-11-25T14:47:09.610' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (30, N'Contract', N'SPIRE 25TH AND BELLEVIEW', N'SPIRE 25TH AND BELLEVIEW', N'Spire Contract', 1, 1, CAST(N'2022-11-25T14:47:28.553' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (31, N'DFRStatus', N'Pending', N'Pending', N'DFR Status', 1, 1, CAST(N'2022-11-25T14:50:14.460' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (32, N'DFRStatus', N'Rejected', N'Rejected', N'DFR Status', 1, 1, CAST(N'2022-11-25T14:50:23.993' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (33, N'DFRStatus', N'Approved', N'Approved', N'DFR Status', 1, 1, CAST(N'2022-11-25T14:50:35.273' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (35, N'ReasonType', N'Incorrect Work Order Number', N'Incorrect Work Order Number', N'Incorrect Work Order Number', 1, 1, CAST(N'2022-11-28T12:55:01.187' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (36, N'ReasonType', N'Others', N'Others', N'Others', 1, 1, CAST(N'2022-11-28T12:55:23.247' AS DateTime), NULL, NULL, 1)
GO
INSERT #lookup_temp ([ID], [Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) VALUES (37, N'ContractRegion', N'No Region', N'No Region', N'No Region mapping will need mapping in ContractRegionMapping_T', 1, 1, CAST(N'2022-12-03T15:42:36.460' AS DateTime), NULL, NULL, 1)
GO
SET IDENTITY_INSERT #lookup_temp OFF
GO
SET IDENTITY_INSERT [dbo].[Lookup_T] ON
GO
insert into [dbo].[Lookup_T] (	[ID],[Type] ,[Value] ,[Text] ,[Description] ,[SortOrder] ,[AddedBy] ,[AddedDate] ,[ChangedBy] ,[ChangedDate] ,[Active] )
select 	[ID],[Type] ,[Value] ,[Text] ,[Description] ,[SortOrder] ,[AddedBy] ,[AddedDate] ,[ChangedBy] ,[ChangedDate] ,[Active]  from #lookup_temp
where not exists (select ID from [dbo].[Lookup_T] as lookup where lookup.ID = #lookup_temp.ID )
SET IDENTITY_INSERT [dbo].[Lookup_T] OFF
