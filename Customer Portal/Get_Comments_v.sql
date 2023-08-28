USE [CustomerPortal]
GO

/****** Object:  View [dbo].[Get_Comments_v]    Script Date: 1/11/2023 8:38:36 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



Create view [dbo].[Get_Comments_v]
as

	Select 
		b.JobMasterID
		, b.CommentTypeID
		, a.[Value]							[CommentType]
		, a.[Text]							[Comment_Title]
		,isnull( b.Comment, 'No Comment')	[Comment]
	From dbo.Lookup_T			a with(nolock)

	left join dbo.comment_t		b with(nolock) on
		a.id = b.CommentTypeID

	Where
		a.[Type] = 'CommentType'
		and a.Active = 1
	Order by 
		b.JobMasterID
		, a.SortOrder
	Offset 0 rows

GO


