BEGIN 
		IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[User_T]
					WHERE Username = 'Admin.Mears')
		BEGIN 
			INSERT [dbo].[User_T] (Username, FirstName, LastName, Email, PasswordUpdatedOn, IsLockedOut, LockedOutOn, 
			LastLoginDate, LoginFailedDate, AccessFailedCount, IsNewAccount, AddedBy, AddedDate, ChangedBy, 
			ChangedDate, Active, ForgotPassword)
			VALUES ('Admin.Mears', 'Admin', 'Mears', 'admin@mears.com', GETDATE(), 0, NULL, GETDATE(), NULL, 0, 1, 
			(SELECT TOP 1 ID FROM User_T WHERE Username = 'CustomerPortalSVC'), GETDATE(), NULL, NULL, 1, 0)
		END
		----------------------------------------------------------------------------------------------------------------------------------
		IF NOT EXISTS(SELECT TOP 1 * FROM UserPasswordHistory_T 
		WHERE UserID = (SELECT TOP 1 ID FROM User_T WHERE Username = 'Admin.Mears'))
		BEGIN 
			INSERT UserPasswordHistory_T(UserID, PasswordHash, PasswordSalt,AddedBy, AddedDate,ChangedBy, ChangedDate, Active)
			VALUES((SELECT TOP 1 ID FROM User_T WHERE Username = 'Admin.Mears'), 
			0x4F80B452DAF21FB44601671B8D02234AA644C445EFE0F7BB8AAA82077AD52B123BA09E6A13EE817FCB355D79D6B4AD1870004ADD72080881EE5A6DB9D7F14250,
			0xA6B6A8E7205AD01DFDDC0105F2309F9722A6C774C6FA6FA81D96107997FA142EE411A243F2DFD18994B5B22DAFBEDB24222C63F2DE1229748194AC25BB835DB66AA6FF9109EDD82FFE10366750B42BBEE72327A5912B4B86E63BE68A35A830E49595FB88A31CE1437AC61D47BD3671DE4FC474159E894A80FE2644E51B35CED7,
			(SELECT TOP 1 ID FROM User_T WHERE Username = 'CustomerPortalSVC'),
			GETDATE(), NULL, NULL, 1)
		END
		-----------------------------------------------------------------------------------------------------------------------------------
		IF NOT EXISTS(SELECT TOP 1 * FROM UserRoleRegionMapping_T 
		WHERE UserID = (SELECT TOP 1 ID FROM User_T WHERE Username = 'Admin.Mears'))
		BEGIN 
			INSERT UserRoleRegionMapping_T(UserID, TypeRoleID, RegionID, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
			VALUES((SELECT TOP 1 ID FROM User_T WHERE Username = 'Admin.Mears'), (SELECT TOP 1 ID FROM [dbo].[TypeRoleMapping_T] 
					WHERE [TYPEID] = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'UserType' AND Value = 'Mears')
					AND [RoleID] = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'UserRole' AND Value = 'Admin')),
					(SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'ContractRegion' AND Value = 'KC'),
					(SELECT TOP 1 ID FROM User_T WHERE Username = 'CustomerPortalSVC'),
					GETDATE(), NULL, NULL, 1)
		END
END

