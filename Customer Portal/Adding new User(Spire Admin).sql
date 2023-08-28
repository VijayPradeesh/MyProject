BEGIN 
	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[TypeRoleMapping_T] 
					WHERE [TYPEID] = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'UserType' AND Value = 'Spire')
					AND [RoleID] = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'UserRole' AND Value = 'Admin'))
	BEGIN 

	INSERT [dbo].[TypeRoleMapping_T] 
	(TypeID, RoleID, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
	VALUES ((SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'UserType' AND Value = 'Spire'), 
	(SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'UserRole' AND Value = 'Admin'), 
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), GETDATE(), 
	NULL, NULL, 1)

	END
END