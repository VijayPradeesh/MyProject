SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

	IF NOT EXISTS(SELECT 1 FROM sys.columns 
          WHERE Name = N'JOB_PAYITEM_ID'
          AND Object_ID = Object_ID(N'CL_BHNE_ADDITIONAL_INFO_T'))
BEGIN
        ALTER TABLE dbo.CL_BHNE_ADDITIONAL_INFO_T
		ADD  JOB_PAYITEM_ID NVARCHAR(20)  NULL
END;


GO