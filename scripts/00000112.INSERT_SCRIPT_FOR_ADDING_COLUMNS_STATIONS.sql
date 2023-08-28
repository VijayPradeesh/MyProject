SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


	IF NOT EXISTS(SELECT 1 FROM sys.columns 
          WHERE Name = N'StartStation'
          AND Object_ID = Object_ID(N'CL_PAYITEM_RENTAL_EQUIPMENTS_T'))
BEGIN
        ALTER TABLE dbo.CL_PAYITEM_RENTAL_EQUIPMENTS_T 
		ADD StartStation nvarchar(30) null 
END;


		IF NOT EXISTS(SELECT 1 FROM sys.columns 
          WHERE Name = N'EndStation'
          AND Object_ID = Object_ID(N'CL_PAYITEM_RENTAL_EQUIPMENTS_T'))
BEGIN
        ALTER TABLE dbo.CL_PAYITEM_RENTAL_EQUIPMENTS_T 
		ADD EndStation nvarchar(30) null 
END;

	IF NOT EXISTS(SELECT 1 FROM sys.columns 
          WHERE Name = N'StationFlag'
          AND Object_ID = Object_ID(N'CL_PAYITEM_RENTAL_EQUIPMENTS_T'))
BEGIN
        ALTER TABLE dbo.CL_PAYITEM_RENTAL_EQUIPMENTS_T 
		ADD StationFlag bit null 
END;

GO