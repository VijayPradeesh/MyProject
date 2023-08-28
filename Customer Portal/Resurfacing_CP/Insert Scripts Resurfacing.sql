-------------------------------------------------------------------------------------------
---------------------------Customer Portal Resurfacing scripts---------------------------------
--------------------------------------------------------------------------------------------

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

