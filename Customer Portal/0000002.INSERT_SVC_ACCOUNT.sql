BEGIN 
		IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[User_T]
					WHERE Username = 'CustomerPortalSVC')
		BEGIN 
			INSERT [dbo].[User_T] (Username, FirstName, LastName, Email, PasswordUpdatedOn, IsLockedOut, LockedOutOn, 
			LastLoginDate, LoginFailedDate, AccessFailedCount, IsNewAccount, AddedBy, AddedDate, ChangedBy, 
			ChangedDate, Active, ForgotPassword)
			 values('CustomerPortalSVC', 'CustomerPortal', 'SVC', 'test@mears.com', GETDATE(), 0, NULL, GETDATE(), NULL, 0, 1, 
			1, GETDATE(), NULL, NULL, 1, 0)
		END
END