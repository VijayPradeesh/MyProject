BEGIN

	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[ContractRegionMapping_T]
					WHERE Contract = 'SPIRE 21-23 A'
					AND RegionID = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Region' AND Value = 'KC'))
	BEGIN 
	INSERT [dbo].[ContractRegionMapping_T] (Contract, RegionID, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
	VALUES ('SPIRE 21-23 A', 
	(SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Region' AND Value = 'KC'), 
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), GETDATE(), 
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), GETDATE(), 1)
	END
	-----------------------------------------------------------------------------------------------------------------------------------------------
	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[ContractRegionMapping_T]
					WHERE Contract = 'SPIRE 21-23 B'
					AND RegionID = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Region' AND Value = 'KC'))
	BEGIN 
	INSERT [dbo].[ContractRegionMapping_T] (Contract, RegionID, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
	VALUES ('SPIRE 21-23 B', 
	(SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Region' AND Value = 'KC'), 
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), GETDATE(), 
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), GETDATE(), 1)
	END
	-----------------------------------------------------------------------------------------------------------------------------------------------
	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[ContractRegionMapping_T]
					WHERE Contract = 'SPIRE 25TH AND BELLEVIEW'
					AND RegionID = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Region' AND Value = 'KC'))
	BEGIN 
	INSERT [dbo].[ContractRegionMapping_T] (Contract, RegionID, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
	VALUES ('SPIRE 25TH AND BELLEVIEW', 
	(SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Region' AND Value = 'KC'), 
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), GETDATE(), 
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), GETDATE(), 1)
	END
	-------------------------------------------------------------------------------------------------------------------------------------------------
	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[ContractRegionMapping_T]
					WHERE Contract = 'FEEDER PHASE 7 AND 8'
					AND RegionID = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Region' AND Value = 'KC'))
	BEGIN 
	INSERT [dbo].[ContractRegionMapping_T] (Contract, RegionID, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
	VALUES ('FEEDER PHASE 7 AND 8', 
	(SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Region' AND Value = 'KC'), 
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), GETDATE(), 
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), GETDATE(), 1)
	END
	--------------------------------------------------------------------------------------------------------------------------------------------------
	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[ContractRegionMapping_T]
					WHERE Contract = 'SPIRE 10TH AND MESSANIE'
					AND RegionID = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Region' AND Value = 'KC'))
	BEGIN 
	INSERT [dbo].[ContractRegionMapping_T] (Contract, RegionID, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
	VALUES ('SPIRE 10TH AND MESSANIE', 
	(SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Region' AND Value = 'KC'), 
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), GETDATE(), 
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), GETDATE(), 1)
	END
	---------------------------------------------------------------------------------------------------------------------------------------------------
	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[ContractRegionMapping_T]
					WHERE Contract = 'SPIRE 33RD AND HOLMES'
					AND RegionID = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Region' AND Value = 'KC'))
	BEGIN 
	INSERT [dbo].[ContractRegionMapping_T] (Contract, RegionID, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
	VALUES ('SPIRE 33RD AND HOLMES', 
	(SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Region' AND Value = 'KC'), 
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), GETDATE(), 
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), GETDATE(), 1)
	END
	----------------------------------------------------------------------------------------------------------------------------------------------------
	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[ContractRegionMapping_T]
					WHERE Contract = 'SPIRE 45TH STREET PROJECT'
					AND RegionID = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Region' AND Value = 'KC'))
	BEGIN 
	INSERT [dbo].[ContractRegionMapping_T] (Contract, RegionID, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
	VALUES ('SPIRE 45TH STREET PROJECT', 
	(SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Region' AND Value = 'KC'), 
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), GETDATE(), 
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), GETDATE(), 1)
	END

	---------------------------------------------------------------------------------------------------------------------------------------------------
	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[ContractRegionMapping_T]
					WHERE Contract = 'SPIRE BLANKET 2'
					AND RegionID = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Region' AND Value = 'KC'))
	BEGIN 
	INSERT [dbo].[ContractRegionMapping_T] (Contract, RegionID, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
	VALUES ('SPIRE BLANKET 2', 
	(SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Region' AND Value = 'KC'), 
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), GETDATE(), 
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), GETDATE(), 1)
	END
	----------------------------------------------------------------------------------------------------------------------------------------------------
	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[ContractRegionMapping_T]
					WHERE Contract = 'SPIRE INDEPENDENCE PROJECT'
					AND RegionID = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Region' AND Value = 'KC'))
	BEGIN 
	INSERT [dbo].[ContractRegionMapping_T] (Contract, RegionID, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
	VALUES ('SPIRE INDEPENDENCE PROJECT', 
	(SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Region' AND Value = 'KC'), 
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), GETDATE(), 
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), GETDATE(), 1)
	END

	---------------------------------------------------------------------------------------------------------------------------------------------------
	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[ContractRegionMapping_T]
					WHERE Contract = 'SPIRE INDEPENDENCE PROJECTS'
					AND RegionID = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Region' AND Value = 'KC'))
	BEGIN 
	INSERT [dbo].[ContractRegionMapping_T] (Contract, RegionID, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
	VALUES ('SPIRE INDEPENDENCE PROJECTS', 
	(SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Region' AND Value = 'KC'), 
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), GETDATE(), 
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), GETDATE(), 1)
	END
	---------------------------------------------------------------------------------------------------------------------------------------------------
	IF NOT EXISTS(SELECT TOP 1 * FROM [dbo].[ContractRegionMapping_T]
					WHERE Contract = 'SPIRE KC FEEDER 2020'
					AND RegionID = (SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Region' AND Value = 'KC'))
	BEGIN 
	INSERT [dbo].[ContractRegionMapping_T] (Contract, RegionID, AddedBy, AddedDate, ChangedBy, ChangedDate, Active)
	VALUES ('SPIRE KC FEEDER 2020', 
	(SELECT TOP 1 ID FROM Lookup_T WHERE Type = 'Region' AND Value = 'KC'), 
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), GETDATE(), 
	(SELECT TOP 1 ID FROM User_T WHERE USERNAME = 'CustomerPortalSVC'), GETDATE(), 1)
	END
	----------------------------------------------------------------------------------------------------------------------------------------------------
END