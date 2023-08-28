SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

	IF NOT EXISTS(SELECT 1 FROM sys.columns 
          WHERE Name = N'COMMENTS'
          AND Object_ID = Object_ID(N'CL_T_AND_E_DATA_T'))
BEGIN
        ALTER TABLE dbo.CL_T_AND_E_DATA_T
		ADD  COMMENTS NVARCHAR(100)  NULL
END;


GO