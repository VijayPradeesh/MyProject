BEGIN 
	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Lookup_T] WHERE Type = 'SewerCamActivityType' AND VALUE = 'Pre Cam')
	BEGIN 
		INSERT [dbo].Lookup_T(Type, Value, Text, Description, SortOrder, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
		VALUES (
		'SewerCamActivityType', 
		'Pre Cam',
		'6',
		'Spire Sewer Camera Activity Type',
		1,
		(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), 
		GETDATE(), 
		NULL, NULL, 
		1
		)
	END

	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Lookup_T] WHERE Type = 'SewerCamActivityType' AND VALUE = 'Post Cam')
	BEGIN 
		INSERT [dbo].Lookup_T(Type, Value, Text, Description, SortOrder, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
		VALUES (
		'SewerCamActivityType', 
		'Post Cam',
		'7',
		'Spire Sewer Camera Activity Type',
		1,
		(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), 
		GETDATE(), 
		NULL, NULL, 
		1
		)
	END

	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Lookup_T] WHERE Type = 'SewerCamType' AND VALUE = 'Main')
	BEGIN 
	INSERT [dbo].Lookup_T(Type, Value, Text, Description, SortOrder, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
	VALUES (
	'SewerCamType', 
	'Main',
	'Main',
		'Spire Sewer Cam Type',
		1,
		(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), 
		GETDATE(), 
		NULL, NULL, 
		1
		)
	END

	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Lookup_T] WHERE Type = 'SewerCamType' AND VALUE = 'Lateral')
	BEGIN 
		INSERT [dbo].Lookup_T(Type, Value, Text, Description, SortOrder, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
		VALUES (
		'SewerCamType', 
		'Lateral',
		'Lateral',
		'Spire Sewer Cam Type',
		1,
		(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), 
		GETDATE(), 
		NULL, NULL, 
		1
		)	
	END

	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Lookup_T] WHERE Type = 'SewerCameraHeaders' AND VALUE = 'workType')
	BEGIN 
		INSERT [dbo].Lookup_T(Type, Value, Text, Description, SortOrder, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
		VALUES (
		'SewerCameraHeaders', 
		'workType',
		'Work Type',
		'Work Details',
		1,
		(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), 
		GETDATE(), 
		NULL, NULL, 
		1
		)
	END

	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Lookup_T] WHERE Type = 'SewerCameraHeaders' AND VALUE = 'county')
	BEGIN 
		INSERT [dbo].Lookup_T(Type, Value, Text, Description, SortOrder, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
		VALUES (
		'SewerCameraHeaders', 
		'county',
		'County',
		'Work Details',
		1,
		(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), 
		GETDATE(), 
		NULL, NULL, 
		1
		)
	END

	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Lookup_T] WHERE Type = 'SewerCameraHeaders' AND VALUE = 'phase')
	BEGIN 
		INSERT [dbo].Lookup_T(Type, Value, Text, Description, SortOrder, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
		VALUES (
		'SewerCameraHeaders', 
		'phase',
		'Phase #',
		'Work Details',
		1,
		(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), 
		GETDATE(), 
		NULL, NULL, 
		1
		)	
	END

	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Lookup_T] WHERE Type = 'SewerCameraHeaders' AND VALUE = 'inspector')
	BEGIN 
		INSERT [dbo].Lookup_T(Type, Value, Text, Description, SortOrder, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
		VALUES (
		'SewerCameraHeaders', 
		'inspector',
		'Inspector',
		'Work Details',
		1,
		(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), 
		GETDATE(), 
		NULL, NULL, 
		1
		)
	END

	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Lookup_T] WHERE Type = 'SewerCameraHeaders' AND VALUE = 'truckID')
	BEGIN 
		INSERT [dbo].Lookup_T(Type, Value, Text, Description, SortOrder, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
		VALUES (
		'SewerCameraHeaders', 
		'truckID',
		'Truck ID',
		'Work Details',
		1,
		(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), 
		GETDATE(), 
		NULL, NULL, 
		1
		)
	END

	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Lookup_T] WHERE Type = 'SewerCameraHeaders' AND VALUE = 'comments')
	BEGIN 
		INSERT [dbo].Lookup_T(Type, Value, Text, Description, SortOrder, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
		VALUES (
		'SewerCameraHeaders', 
		'comments',
		'Comments',
		'Comments',
		1,
		(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), 
		GETDATE(), 
		NULL, NULL, 
		1
		)
	END


	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Lookup_T] WHERE Type = 'SewerCameraHeaders' AND VALUE = 'location' AND Description = 'Main')
	BEGIN 
		INSERT [dbo].Lookup_T(Type, Value, Text, Description, SortOrder, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
		VALUES (
		'SewerCameraHeaders', 
		'location',
		'Location',
		'Main',
		1,
		(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), 
		GETDATE(), 
		NULL, NULL, 
		1
		)
	END

	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Lookup_T] WHERE Type = 'SewerCameraHeaders' AND VALUE = 'feet' AND Description = 'Main')
	BEGIN 
		INSERT [dbo].Lookup_T(Type, Value, Text, Description, SortOrder, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
		VALUES (
		'SewerCameraHeaders', 
		'feet',
		'Feet',
		'Main',
		1,
		(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), 
		GETDATE(), 
		NULL, NULL, 
		1
		)
	END


	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Lookup_T] WHERE Type = 'SewerCameraHeaders' AND VALUE = 'location' AND Description = 'Lateral')
	BEGIN 
		INSERT [dbo].Lookup_T(Type, Value, Text, Description, SortOrder, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
		VALUES (
		'SewerCameraHeaders', 
		'location',
		'Location',
		'Lateral',
		1,
		(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), 
		GETDATE(), 
		NULL, NULL, 
		1
		)
	END

	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Lookup_T] WHERE Type = 'SewerCameraHeaders' AND VALUE = 'feet' AND Description = 'Lateral')
	BEGIN 
		INSERT [dbo].Lookup_T(Type, Value, Text, Description, SortOrder, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
		VALUES (
		'SewerCameraHeaders', 
		'feet',
		'Feet',
		'Lateral',
		1,
		(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), 
		GETDATE(), 
		NULL, NULL, 
		1
		)
	END
END