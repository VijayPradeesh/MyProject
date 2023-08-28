-------------------------------------------------------------------------------------------
---------------------------Customer Portal Phase-4 scripts---------------------------------
--------------------------------------------------------------------------------------------

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF NOT EXISTS (SELECT 1 FROM sys.columns 
          WHERE Name = N'Signature'
          AND Object_ID = Object_ID(N'User_T'))
BEGIN
		--- Adding a new column "Signature"--------
        ALTER TABLE dbo.User_T
		ADD  Signature varbinary(max)  NULL 
END;

IF EXISTS (SELECT 1 FROM sys.columns 
          WHERE Name = N'Username'
          AND Object_ID = Object_ID(N'User_T'))
BEGIN
		----- Changing nvarchar(30) to nvarchar(50)------
		ALTER TABLE [dbo].[User_T]
		ALTER COLUMN [Username] nvarchar(50) not null
END