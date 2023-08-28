SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

	IF NOT EXISTS(SELECT 1 FROM sys.columns 
          WHERE Name = N'WbsDescription'
          AND Object_ID = Object_ID(N'JobRevenue_T'))
BEGIN
        ALTER TABLE dbo.JobRevenue_T
		ADD  WbsDescription nvarchar(500)  NULL
END;


GO