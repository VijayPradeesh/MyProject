BEGIN
	IF  EXISTS(SELECT TOP 1 * FROM Lookup_T WHERE Type = 'UserRole' and Value = 'Supervisor')
	BEGIN
		UPDATE Lookup_T
		SET Active = 0
		WHERE ID = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'UserRole' and Value = 'Supervisor')
	END

	IF NOT EXISTS (SELECT TOP 1 * FROM Lookup_T WHERE Type = 'Production' and Value = 'payitem')
	BEGIN
		INSERT Lookup_T([Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) 
		VALUES (N'Production', N'payitem', N'PayItem', N'Production header', 1, 1, CAST(N'2022-11-25T11:12:52.693' AS DateTime), NULL, NULL, 1)
	END

	IF NOT EXISTS (SELECT TOP 1 * FROM Lookup_T WHERE Type = 'Production' and Value = 'description')
	BEGIN
		INSERT Lookup_T([Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) 
		VALUES (N'Production', N'description', N'Description', N'Production header', 1, 1, CAST(N'2022-11-25T11:12:52.693' AS DateTime), NULL, NULL, 1)
	END

	IF NOT EXISTS (SELECT TOP 1 * FROM Lookup_T WHERE Type = 'Production' and Value = 'quantity')
	BEGIN
		INSERT Lookup_T([Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) 
		VALUES (N'Production', N'quantity', N'Quantity', N'Production header', 1, 1, CAST(N'2022-11-25T11:12:52.693' AS DateTime), NULL, NULL, 1)
	END

	IF NOT EXISTS (SELECT TOP 1 * FROM Lookup_T WHERE Type = 'Production' and Value = 'wo')
	BEGIN
		INSERT Lookup_T([Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) 
		VALUES (N'Production', N'wo', N'WO#', N'Production header', 1, 1, CAST(N'2022-11-25T11:12:52.693' AS DateTime), NULL, NULL, 1)
	END

	IF NOT EXISTS (SELECT TOP 1 * FROM Lookup_T WHERE Type = 'Production' and Value = 'location')
	BEGIN
		INSERT Lookup_T([Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) 
		VALUES (N'Production', N'location', N'Location', N'Production header', 1, 1, CAST(N'2022-11-25T11:12:52.693' AS DateTime), NULL, NULL, 1)
	END

	IF NOT EXISTS (SELECT TOP 1 * FROM Lookup_T WHERE Type = 'T&M' and Value = 'payitem')
	BEGIN
		INSERT Lookup_T([Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) 
		VALUES (N'T&M', N'payitem', N'Pay Item', N'T&M header', 1, 1, CAST(N'2022-11-25T11:12:52.693' AS DateTime), NULL, NULL, 1)
	END

	IF NOT EXISTS (SELECT TOP 1 * FROM Lookup_T WHERE Type = 'T&M' and Value = 'description')
	BEGIN
		INSERT Lookup_T([Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) 
		VALUES (N'T&M', N'description', N'Description', N'T&M header', 1, 1, CAST(N'2022-11-25T11:12:52.693' AS DateTime), NULL, NULL, 1)
	END

	IF NOT EXISTS (SELECT TOP 1 * FROM Lookup_T WHERE Type = 'T&M' and Value = 'quantity')
	BEGIN
		INSERT Lookup_T([Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) 
		VALUES (N'T&M', N'quantity', N'Quantity', N'T&M header', 1, 1, CAST(N'2022-11-25T11:12:52.693' AS DateTime), NULL, NULL, 1)
	END


	IF NOT EXISTS (SELECT TOP 1 * FROM Lookup_T WHERE Type = 'T&M' and Value = 'wo')
	BEGIN
		INSERT Lookup_T([Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) 
		VALUES (N'T&M', N'wo', N'WO#', N'T&M header', 1, 1, CAST(N'2022-11-25T11:12:52.693' AS DateTime), NULL, NULL, 1)
	END

	IF NOT EXISTS (SELECT TOP 1 * FROM Lookup_T WHERE Type = 'T&M' and Value = 'location')
	BEGIN
		INSERT Lookup_T([Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) 
		VALUES (N'T&M', N'location', N'Location', N'T&M header', 1, 1, CAST(N'2022-11-25T11:12:52.693' AS DateTime), NULL, NULL, 1)
	END

	IF NOT EXISTS (SELECT TOP 1 * FROM Lookup_T WHERE Type = 'Labour' and Value = 'employee')
	BEGIN
		INSERT Lookup_T([Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) 
		VALUES (N'Labour', N'employee', N'Employee', N'Labour header', 1, 1, CAST(N'2022-11-25T11:12:52.693' AS DateTime), NULL, NULL, 1)
	END

	IF NOT EXISTS (SELECT TOP 1 * FROM Lookup_T WHERE Type = 'Labour' and Value = 'ot')
	BEGIN
		INSERT Lookup_T([Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) 
		VALUES (N'Labour', N'ot', N'OT', N'Labour header', 1, 1, CAST(N'2022-11-25T11:12:52.693' AS DateTime), NULL, NULL, 1)
	END

	IF NOT EXISTS (SELECT TOP 1 * FROM Lookup_T WHERE Type = 'Labour' and Value = 'dt')
	BEGIN
		INSERT Lookup_T([Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) 
		VALUES (N'Labour', N'dt', N'DT', N'Labour header', 1, 1, CAST(N'2022-11-25T11:12:52.693' AS DateTime), NULL, NULL, 1)
	END

	IF NOT EXISTS (SELECT TOP 1 * FROM Lookup_T WHERE Type = 'Labour' and Value = 'st')
	BEGIN
		INSERT Lookup_T([Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) 
		VALUES (N'Labour', N'st', N'ST', N'Labour header', 1, 1, CAST(N'2022-11-25T11:12:52.693' AS DateTime), NULL, NULL, 1)
	END

	IF NOT EXISTS (SELECT TOP 1 * FROM Lookup_T WHERE Type = 'Equipment' and Value = 'equipment')
	BEGIN
		INSERT Lookup_T([Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) 
		VALUES (N'Equipment', N'equipment', N'Equipment', N'Labour header', 1, 1, CAST(N'2022-11-25T11:12:52.693' AS DateTime), NULL, NULL, 1)
	END

	IF NOT EXISTS (SELECT TOP 1 * FROM Lookup_T WHERE Type = 'Equipment' and Value = 'description')
	BEGIN
		INSERT Lookup_T([Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) 
		VALUES (N'Equipment', N'description', N'Description', N'Labour header', 1, 1, CAST(N'2022-11-25T11:12:52.693' AS DateTime), NULL, NULL, 1)
	END
	
	IF NOT EXISTS (SELECT TOP 1 * FROM Lookup_T WHERE Type = 'Equipment' and Value = 'hours')
	BEGIN
		INSERT Lookup_T([Type], [Value], [Text], [Description], [SortOrder], [AddedBy], [AddedDate], [ChangedBy], [ChangedDate], [Active]) 
		VALUES (N'Equipment', N'hours', N'Hours', N'Labour header', 1, 1, CAST(N'2022-11-25T11:12:52.693' AS DateTime), NULL, NULL, 1)
	END
END