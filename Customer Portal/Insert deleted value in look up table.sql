
BEGIN 
	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[Lookup_T] WHERE Type = 'DFRStatus' AND VALUE = 'Deleted')
		
		BEGIN 
			INSERT [dbo].Lookup_T(Type, Value, Text, Description, SortOrder, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
			VALUES (
			'DFRStatus', 
			'Deleted',
			'Deleted',
			'DFR Status',
			1,
			(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), 
			GETDATE(), 
			NULL, NULL, 
			1
			)
		END

END