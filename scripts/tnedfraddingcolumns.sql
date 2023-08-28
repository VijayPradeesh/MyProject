
  SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

	IF NOT EXISTS(SELECT 1 FROM sys.columns 
          WHERE Name = N'ADDRESS'
          AND Object_ID = Object_ID(N'CL_T_AND_E_DATA_T'))
BEGIN
        ALTER TABLE dbo.CL_T_AND_E_DATA_T
		ADD ADDRESS nvarchar(50) null 
END;
	IF NOT EXISTS(SELECT 1 FROM sys.columns 
          WHERE Name = N'CITY'
          AND Object_ID = Object_ID(N'CL_T_AND_E_DATA_T'))
BEGIN
        ALTER TABLE dbo.CL_T_AND_E_DATA_T
		ADD CITY nvarchar(20) null 
END;


	IF NOT EXISTS(SELECT 1 FROM sys.columns 
          WHERE Name = N'STATE'
          AND Object_ID = Object_ID(N'CL_T_AND_E_DATA_T'))
BEGIN
        ALTER TABLE dbo.CL_T_AND_E_DATA_T
		ADD STATE nvarchar(20) null 
END;

	IF NOT EXISTS(SELECT 1 FROM sys.columns 
          WHERE Name = N'BREAK_TIME'
          AND Object_ID = Object_ID(N'CL_T_AND_E_DATA_T'))
BEGIN
        ALTER TABLE dbo.CL_T_AND_E_DATA_T
		ADD BREAK_TIME INT null 
END;


GO