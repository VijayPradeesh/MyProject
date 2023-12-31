
/****** Object:  StoredProcedure [dbo].[_PBI_SSRS_EquipmentHoursByContract]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO






CREATE PROCEDURE [dbo].[_PBI_SSRS_EquipmentHoursByContract] @Contract varchar(max) = 'NA'
,                                                           @Weekend varchar(20)   = 'NA'


as
	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	SELECT LTRIM(RTRIM(Equipment_Code)) as EquipCode
	,      Owned_Flag                   into #tmpEquip
	from [SIGMA].[WebImport].[dbo].[EC_EQUIPMENT_MASTER_MC]


	--Declare @Weekend date
	--Declare @Contract varchar(100)

	--set @Weekend = '11/4/17'
	--set @Contract = 'DTE BLNKT15-17, CGOH NP 2016-20'

	IF @Contract = 'NA'
		AND @Weekend = 'NA'


	BEGIN

		SELECT DISTINCT CL_JOB_T.JOB_ID                                                        
		,               CL_JOB_T.WI_JOB_ID                                                     
		,               CL_JOB_T.JOB_START_DATE                                                
		,               CL_JOB_T.JOB_STATUS_ID                                                 
		,               WI_FLEET_MASTER_T.EQUIPMENT_CODE                                       
		,               WI_FLEET_MASTER_T.EQUIPMENT_DESCRIPTION                                
		,               WI_FLEET_MASTER_T.METER_TYPE                                           
		,               CL_CONTRACT_FLEET_T.ISACTIVE                                           
		,               WI_JOB_MASTER_T.SUPERINTENDENT                                         
		,               WI_JOB_MASTER_T.COMPANY_CODE                                           
		,               LTRIM(RTRIM(G.EMPLOYEE_NAME))                                           as SuperName
		,               LTRIM(RTRIM(WI_JOB_MASTER_T.JOB_NUMBER))                                   JOB_NUMBER
		,               UPPER(REPLACE(dbo.CL_USER.USER_NAME, '.', ' '))                         AS Foreman_Name
		,               WI_EMPLOYEE_MASTER_T.EMPLOYEE_ID                                       
		,               je.WBS_CODE                                                            
		,               je.HOURS                                                               
		,               CL_CONTRACT_FLEET_T.WEEKEND_MILES                                      
		,               CASE (DATEPART(weekday, CL_JOB_T.JOB_START_DATE)) WHEN 1 THEN 'Sun'
		                                                                  WHEN 2 THEN 'Mon'
		                                                                  WHEN 3 THEN 'Tue'
		                                                                  WHEN 4 THEN 'Wed'
		                                                                  WHEN 5 THEN 'Thur'
		                                                                  WHEN 6 THEN 'Fri'
		                                                                  WHEN 7 THEN 'Sat' END AS 'dow'
		,               je.EQUIPMENT_CHARGE                                                    
		,               je.TRANSFER_TO_COMPANY                                                 
		,               je.LAST_SERVICED_DATE                                                  
		,               LTRIM(RTRIM(dbo.WI_CONTRACT_MASTER_T.CONTRACT_NUMBER))                     CONTRACT_NUMBER
		,               WI_FLEET_MASTER_T.RATE_PER_HOUR                                        
		,
		--B.Status_Description as EquipStatus,
		                X.JOB_STATUS_NAME                                                       as JobStatus
		,
		--B.Status_Type as [ActiveRetired],
		--C.Equipment_Type_Description EquipType ,
		                A.Owned_Flag                                                           
		,
		--A.Location,
		--A.Purchase_Date,
		--A.Purchase_Cost,
		                WI_JOB_MASTER_T.CUSTOMER_CODE                                          

		FROM       dbo.CL_JOB_T                  
		INNER JOIN dbo.WI_JOB_MASTER_T            ON CL_JOB_T.WI_JOB_ID = WI_JOB_MASTER_T.WI_JOB_ID
		INNER JOIN dbo.CL_USER                    ON CL_JOB_T.USER_ID = CL_USER.USER_ID
		INNER JOIN dbo.WI_EMPLOYEE_MASTER_T       ON CL_USER.WI_EMPLOYEE_ID = WI_EMPLOYEE_MASTER_T.WI_EMPLOYEE_ID
		INNER JOIN dbo.CL_CONTRACT_FLEET_T        ON CL_USER.USER_ID = CL_CONTRACT_FLEET_T.USER_ID
		INNER JOIN dbo.WI_FLEET_MASTER_T          ON CL_CONTRACT_FLEET_T.WI_FLEET_ID = WI_FLEET_MASTER_T.WI_FLEET_ID
		INNER JOIN dbo.CL_JOB_EQUIPMENT_T   AS je ON je.JOB_ID = CL_JOB_T.JOB_ID
				AND je.CONTRACT_FLEET_ID = CL_CONTRACT_FLEET_T.CONTRACT_FLEET_ID
		INNER JOIN dbo.WI_CONTRACT_MASTER_T       ON dbo.CL_CONTRACT_FLEET_T.WI_CONTRACT_ID = dbo.WI_CONTRACT_MASTER_T.WI_CONTRACT_ID
				and dbo.WI_CONTRACT_MASTER_T.DELETED=-1
		LEFT JOIN  (SELECT DISTINCT Employee_Name
			,                       Employee_Id
			FROM [WI_EMPLOYEE_MASTER_T])       G  ON LTRIM(RTRIM(WI_JOB_MASTER_T.SUPERINTENDENT)) = LTRIM(RTRIM(G.EMPLOYEE_ID))
		INNER JOIN #tmpEquip                   A  On A.EquipCode = LTRIM(RTRIM(WI_FLEET_MASTER_T.Equipment_Code))
		LEFT JOIN  CL_JOB_STATUS_T             X  ON CL_JOB_T.JOB_STATUS_ID = X.JOB_STATUS_ID

		Where /*(WI_JOB_MASTER_T.CONTRACT_NUMBER IN
                      (SELECT items
                       FROM      dbo.Split(@Contract, ','))) AND 
				 (CONVERT(date,CL_JOB_T.JOB_START_DATE, 110) BETWEEN 
                         DATEADD(dd, 1 - DATEPART(dw, @Weekend), @Weekend) AND @Weekend) 
						 --and CL_CONTRACT_FLEET_T.ISACTIVE = 'true' 
						 and */ dbo.CL_JOB_T.JOB_STATUS_ID in (2,7)
			AND je.ISACTIVE = 1
			AND je.Hours > 0
			AND JOB_START_DATE >= '01/01/2018'

	END

	ELSE
	BEGIN
		SELECT DISTINCT CL_JOB_T.JOB_ID                                                        
		,               CL_JOB_T.WI_JOB_ID                                                     
		,               CL_JOB_T.JOB_START_DATE                                                
		,               CL_JOB_T.JOB_STATUS_ID                                                 
		,               WI_FLEET_MASTER_T.EQUIPMENT_CODE                                       
		,               WI_FLEET_MASTER_T.EQUIPMENT_DESCRIPTION                                
		,               WI_FLEET_MASTER_T.METER_TYPE                                           
		,               CL_CONTRACT_FLEET_T.ISACTIVE                                           
		,               WI_JOB_MASTER_T.SUPERINTENDENT                                         
		,               WI_JOB_MASTER_T.COMPANY_CODE                                           
		,               LTRIM(RTRIM(G.EMPLOYEE_NAME))                                           as SuperName
		,               LTRIM(RTRIM(WI_JOB_MASTER_T.JOB_NUMBER))                                   JOB_NUMBER
		,               UPPER(REPLACE(dbo.CL_USER.USER_NAME, '.', ' '))                         AS Foreman_Name
		,               WI_EMPLOYEE_MASTER_T.EMPLOYEE_ID                                       
		,               je.WBS_CODE                                                            
		,               je.HOURS                                                               
		,               CL_CONTRACT_FLEET_T.WEEKEND_MILES                                      
		,               CASE (DATEPART(weekday, CL_JOB_T.JOB_START_DATE)) WHEN 1 THEN 'Sun'
		                                                                  WHEN 2 THEN 'Mon'
		                                                                  WHEN 3 THEN 'Tue'
		                                                                  WHEN 4 THEN 'Wed'
		                                                                  WHEN 5 THEN 'Thur'
		                                                                  WHEN 6 THEN 'Fri'
		                                                                  WHEN 7 THEN 'Sat' END AS 'dow'
		,               je.EQUIPMENT_CHARGE                                                    
		,               je.TRANSFER_TO_COMPANY                                                 
		,               X.JOB_STATUS_NAME                                                       as JobStatus
		,               je.LAST_SERVICED_DATE                                                  
		,               LTRIM(RTRIM(dbo.WI_CONTRACT_MASTER_T.CONTRACT_NUMBER))                     CONTRACT_NUMBER
		,               WI_FLEET_MASTER_T.RATE_PER_HOUR                                        


		FROM       dbo.CL_JOB_T                  
		INNER JOIN dbo.WI_JOB_MASTER_T            ON CL_JOB_T.WI_JOB_ID = WI_JOB_MASTER_T.WI_JOB_ID
		INNER JOIN dbo.CL_USER                    ON CL_JOB_T.USER_ID = CL_USER.USER_ID
		INNER JOIN dbo.WI_EMPLOYEE_MASTER_T       ON CL_USER.WI_EMPLOYEE_ID = WI_EMPLOYEE_MASTER_T.WI_EMPLOYEE_ID
		INNER JOIN dbo.CL_CONTRACT_FLEET_T        ON CL_USER.USER_ID = CL_CONTRACT_FLEET_T.USER_ID
		INNER JOIN dbo.WI_FLEET_MASTER_T          ON CL_CONTRACT_FLEET_T.WI_FLEET_ID = WI_FLEET_MASTER_T.WI_FLEET_ID
		INNER JOIN dbo.CL_JOB_EQUIPMENT_T   AS je ON je.JOB_ID = CL_JOB_T.JOB_ID
				AND je.CONTRACT_FLEET_ID = CL_CONTRACT_FLEET_T.CONTRACT_FLEET_ID
				AND je.HOURS > 0
		INNER JOIN dbo.WI_CONTRACT_MASTER_T       ON dbo.CL_CONTRACT_FLEET_T.WI_CONTRACT_ID = dbo.WI_CONTRACT_MASTER_T.WI_CONTRACT_ID
				and dbo.WI_CONTRACT_MASTER_T.DELETED=-1
		LEFT JOIN  (SELECT DISTINCT Employee_Name
			,                       Employee_Id
			FROM [WI_EMPLOYEE_MASTER_T])       G  ON LTRIM(RTRIM(WI_JOB_MASTER_T.SUPERINTENDENT)) = LTRIM(RTRIM(G.EMPLOYEE_ID))
		LEFT JOIN  CL_JOB_STATUS_T             X  ON CL_JOB_T.JOB_STATUS_ID = X.JOB_STATUS_ID
		Where (WI_JOB_MASTER_T.CONTRACT_NUMBER IN
			(SELECT items
			FROM dbo.Split(@Contract, ',')))
			AND (CONVERT(date,CL_JOB_T.JOB_START_DATE, 110) BETWEEN
			DATEADD(dd, 1 - DATEPART(dw, @Weekend), @Weekend) AND @Weekend)
			--and CL_CONTRACT_FLEET_T.ISACTIVE = 'true'
			and dbo.CL_JOB_T.JOB_STATUS_ID in (2,7)

	END




GO
/****** Object:  StoredProcedure [dbo].[_PBI_SSRS_EquipmentHoursByContractandDivision]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO






CREATE PROCEDURE [dbo].[_PBI_SSRS_EquipmentHoursByContractandDivision] @Contract varchar(max) = 'NA'
,                                                                      @Weekend varchar(20)   = 'NA'


as
	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	SELECT LTRIM(RTRIM(Equipment_Code)) as EquipCode
	,      Owned_Flag                   into #tmpEquip
	from [SIGMA].[WebImport].[dbo].[EC_EQUIPMENT_MASTER_MC]


	--Declare @Weekend date
	--Declare @Contract varchar(100)

	--set @Weekend = '11/4/17'
	--set @Contract = 'DTE BLNKT15-17, CGOH NP 2016-20'

	IF @Contract = 'NA'
		AND @Weekend = 'NA'


	BEGIN

		SELECT DISTINCT CL_JOB_T.JOB_ID                                                        
		,               CL_JOB_T.WI_JOB_ID                                                     
		,               CL_JOB_T.JOB_START_DATE                                                
		,               CL_JOB_T.JOB_STATUS_ID                                                 
		,               WI_FLEET_MASTER_T.EQUIPMENT_CODE                                       
		,               WI_FLEET_MASTER_T.EQUIPMENT_DESCRIPTION                                
		,               WI_FLEET_MASTER_T.METER_TYPE                                           
		,               CL_CONTRACT_FLEET_T.ISACTIVE                                           
		,               WI_JOB_MASTER_T.SUPERINTENDENT                                         
		,               WI_JOB_MASTER_T.COMPANY_CODE                                           
		,               LTRIM(RTRIM(G.EMPLOYEE_NAME))                                           as SuperName
		,               LTRIM(RTRIM(WI_JOB_MASTER_T.JOB_NUMBER))                                   JOB_NUMBER
		,               WI_JOB_MASTER_T.DIVISION                                                AS Division
		,               UPPER(REPLACE(dbo.CL_USER.USER_NAME, '.', ' '))                         AS Foreman_Name
		,               WI_EMPLOYEE_MASTER_T.EMPLOYEE_ID                                       
		,               je.WBS_CODE                                                            
		,               je.HOURS                                                               
		,               CL_CONTRACT_FLEET_T.WEEKEND_MILES                                      
		,               CASE (DATEPART(weekday, CL_JOB_T.JOB_START_DATE)) WHEN 1 THEN 'Sun'
		                                                                  WHEN 2 THEN 'Mon'
		                                                                  WHEN 3 THEN 'Tue'
		                                                                  WHEN 4 THEN 'Wed'
		                                                                  WHEN 5 THEN 'Thur'
		                                                                  WHEN 6 THEN 'Fri'
		                                                                  WHEN 7 THEN 'Sat' END AS 'dow'
		,               je.EQUIPMENT_CHARGE                                                    
		,               je.TRANSFER_TO_COMPANY                                                 
		,               je.LAST_SERVICED_DATE                                                  
		,               LTRIM(RTRIM(dbo.WI_CONTRACT_MASTER_T.CONTRACT_NUMBER))                     CONTRACT_NUMBER
		,               WI_FLEET_MASTER_T.RATE_PER_HOUR                                        
		,
		--B.Status_Description as EquipStatus,
		                X.JOB_STATUS_NAME                                                       as JobStatus
		,
		--B.Status_Type as [ActiveRetired],
		--C.Equipment_Type_Description EquipType ,
		                A.Owned_Flag                                                           
		,
		--A.Location,
		--A.Purchase_Date,
		--A.Purchase_Cost,
		                WI_JOB_MASTER_T.CUSTOMER_CODE                                          

		FROM       dbo.CL_JOB_T                  
		INNER JOIN dbo.WI_JOB_MASTER_T            ON CL_JOB_T.WI_JOB_ID = WI_JOB_MASTER_T.WI_JOB_ID
		INNER JOIN dbo.CL_USER                    ON CL_JOB_T.USER_ID = CL_USER.USER_ID
		INNER JOIN dbo.WI_EMPLOYEE_MASTER_T       ON CL_USER.WI_EMPLOYEE_ID = WI_EMPLOYEE_MASTER_T.WI_EMPLOYEE_ID
		INNER JOIN dbo.CL_CONTRACT_FLEET_T        ON CL_USER.USER_ID = CL_CONTRACT_FLEET_T.USER_ID
		INNER JOIN dbo.WI_FLEET_MASTER_T          ON CL_CONTRACT_FLEET_T.WI_FLEET_ID = WI_FLEET_MASTER_T.WI_FLEET_ID
		INNER JOIN dbo.CL_JOB_EQUIPMENT_T   AS je ON je.JOB_ID = CL_JOB_T.JOB_ID
				AND je.CONTRACT_FLEET_ID = CL_CONTRACT_FLEET_T.CONTRACT_FLEET_ID
		INNER JOIN dbo.WI_CONTRACT_MASTER_T       ON dbo.CL_CONTRACT_FLEET_T.WI_CONTRACT_ID = dbo.WI_CONTRACT_MASTER_T.WI_CONTRACT_ID
				and dbo.WI_CONTRACT_MASTER_T.DELETED=-1
		LEFT JOIN  (SELECT DISTINCT Employee_Name
			,                       Employee_Id
			FROM [WI_EMPLOYEE_MASTER_T])       G  ON LTRIM(RTRIM(WI_JOB_MASTER_T.SUPERINTENDENT)) = LTRIM(RTRIM(G.EMPLOYEE_ID))
		INNER JOIN #tmpEquip                   A  On A.EquipCode = LTRIM(RTRIM(WI_FLEET_MASTER_T.Equipment_Code))
		LEFT JOIN  CL_JOB_STATUS_T             X  ON CL_JOB_T.JOB_STATUS_ID = X.JOB_STATUS_ID

		Where /*(WI_JOB_MASTER_T.CONTRACT_NUMBER IN
                      (SELECT items
                       FROM      dbo.Split(@Contract, ','))) AND 
                            (CONVERT(date,CL_JOB_T.JOB_START_DATE, 110) BETWEEN 
                         DATEADD(dd, 1 - DATEPART(dw, @Weekend), @Weekend) AND @Weekend) 
                                          --and CL_CONTRACT_FLEET_T.ISACTIVE = 'true' 
                                          and */ dbo.CL_JOB_T.JOB_STATUS_ID in (2,7)
			AND je.ISACTIVE = 1
			AND je.Hours > 0
			AND JOB_START_DATE >= '01/01/2020'

	END

	ELSE
	BEGIN
		SELECT DISTINCT CL_JOB_T.JOB_ID                                                        
		,               CL_JOB_T.WI_JOB_ID                                                     
		,               CL_JOB_T.JOB_START_DATE                                                
		,               CL_JOB_T.JOB_STATUS_ID                                                 
		,               WI_FLEET_MASTER_T.EQUIPMENT_CODE                                       
		,               WI_FLEET_MASTER_T.EQUIPMENT_DESCRIPTION                                
		,               WI_FLEET_MASTER_T.METER_TYPE                                           
		,               CL_CONTRACT_FLEET_T.ISACTIVE                                           
		,               WI_JOB_MASTER_T.SUPERINTENDENT                                         
		,               WI_JOB_MASTER_T.COMPANY_CODE                                           
		,               LTRIM(RTRIM(G.EMPLOYEE_NAME))                                           as SuperName
		,               LTRIM(RTRIM(WI_JOB_MASTER_T.JOB_NUMBER))                                   JOB_NUMBER
		,               WI_JOB_MASTER_T.DIVISION                                                AS Division
		,               UPPER(REPLACE(dbo.CL_USER.USER_NAME, '.', ' '))                         AS Foreman_Name
		,               WI_EMPLOYEE_MASTER_T.EMPLOYEE_ID                                       
		,               je.WBS_CODE                                                            
		,               je.HOURS                                                               
		,               CL_CONTRACT_FLEET_T.WEEKEND_MILES                                      
		,               CASE (DATEPART(weekday, CL_JOB_T.JOB_START_DATE)) WHEN 1 THEN 'Sun'
		                                                                  WHEN 2 THEN 'Mon'
		                                                                  WHEN 3 THEN 'Tue'
		                                                                  WHEN 4 THEN 'Wed'
		                                                                  WHEN 5 THEN 'Thur'
		                                                                  WHEN 6 THEN 'Fri'
		                                                                  WHEN 7 THEN 'Sat' END AS 'dow'
		,               je.EQUIPMENT_CHARGE                                                    
		,               je.TRANSFER_TO_COMPANY                                                 
		,               X.JOB_STATUS_NAME                                                       as JobStatus
		,               je.LAST_SERVICED_DATE                                                  
		,               LTRIM(RTRIM(dbo.WI_CONTRACT_MASTER_T.CONTRACT_NUMBER))                     CONTRACT_NUMBER
		,               WI_FLEET_MASTER_T.RATE_PER_HOUR                                        


		FROM       dbo.CL_JOB_T                  
		INNER JOIN dbo.WI_JOB_MASTER_T            ON CL_JOB_T.WI_JOB_ID = WI_JOB_MASTER_T.WI_JOB_ID
		INNER JOIN dbo.CL_USER                    ON CL_JOB_T.USER_ID = CL_USER.USER_ID
		INNER JOIN dbo.WI_EMPLOYEE_MASTER_T       ON CL_USER.WI_EMPLOYEE_ID = WI_EMPLOYEE_MASTER_T.WI_EMPLOYEE_ID
		INNER JOIN dbo.CL_CONTRACT_FLEET_T        ON CL_USER.USER_ID = CL_CONTRACT_FLEET_T.USER_ID
		INNER JOIN dbo.WI_FLEET_MASTER_T          ON CL_CONTRACT_FLEET_T.WI_FLEET_ID = WI_FLEET_MASTER_T.WI_FLEET_ID
		INNER JOIN dbo.CL_JOB_EQUIPMENT_T   AS je ON je.JOB_ID = CL_JOB_T.JOB_ID
				AND je.CONTRACT_FLEET_ID = CL_CONTRACT_FLEET_T.CONTRACT_FLEET_ID
				AND je.HOURS > 0
		INNER JOIN dbo.WI_CONTRACT_MASTER_T       ON dbo.CL_CONTRACT_FLEET_T.WI_CONTRACT_ID = dbo.WI_CONTRACT_MASTER_T.WI_CONTRACT_ID
				and dbo.WI_CONTRACT_MASTER_T.DELETED=-1
		LEFT JOIN  (SELECT DISTINCT Employee_Name
			,                       Employee_Id
			FROM [WI_EMPLOYEE_MASTER_T])       G  ON LTRIM(RTRIM(WI_JOB_MASTER_T.SUPERINTENDENT)) = LTRIM(RTRIM(G.EMPLOYEE_ID))
		LEFT JOIN  CL_JOB_STATUS_T             X  ON CL_JOB_T.JOB_STATUS_ID = X.JOB_STATUS_ID
		Where (WI_JOB_MASTER_T.CONTRACT_NUMBER IN
			(SELECT items
			FROM dbo.Split(@Contract, ',')))
			AND (CONVERT(date,CL_JOB_T.JOB_START_DATE, 110) BETWEEN
			DATEADD(dd, 1 - DATEPART(dw, @Weekend), @Weekend) AND @Weekend)
			--and CL_CONTRACT_FLEET_T.ISACTIVE = 'true'
			and dbo.CL_JOB_T.JOB_STATUS_ID in (2,7)

	END




GO
/****** Object:  StoredProcedure [dbo].[CL_2_Timesheet_By_Employee_WIP_DUKE_CORRIDOR]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[CL_2_Timesheet_By_Employee_WIP_DUKE_CORRIDOR] @WEEKBEGIN DATE
, -- = '2021-03-07 00:00.000'
                                                                      @WEEKEND DATE
, -- = '2021-03-13 00:00.000'
                                                                      @ContractID VARCHAR (MAX)
,
--INSERT @CONTRACTNUMBERS(CONTRACT) VALUES ('SPIRE 21-23 A'), ('SPIRE 21-23 B');
                                                                      @Superintendent VARCHAR(MAX)
,
--insert @Approvers(approver) values ('RALPH MONROE TULL III')
                                                                      @ForemanID VARCHAR(MAX)
,                                                                     @EMPLOYEEID varchar(max)
--insert @Foremen(foreman) values ('ALBERT RANDY CARMICHAEL') --, ('DAVID DOUGLAS ROBEY'),('JAMES STEVENSON')
AS
BEGIN
	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;


	--INSERT INTO PARAMETERS_INFO VALUES('CL_2_Timesheet_By_Employee_WIP_NEW_SPECIAL_PROJECTS',@WEEKBEGIN, @WEEKEND, @ContractID, @Superintendent, @ForemanID, @EMPLOYEEID,GETDATE())

	DECLARE @UNION_CODES AS TABLE ( UNION_CODE                   VARCHAR(50)
	,                               UNION_NAME                   VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST1 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST2 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST3 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST4 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST5 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST6 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST7 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST8 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST9 VARCHAR(200) )

	INSERT INTO @UNION_CODES
	SELECT UNION_CODE                                
	,      UNION_NAME                                
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST1)) AS LEVEL1
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST2)) AS LEVEL2
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST3)) AS LEVEL3
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST4)) AS LEVEL4
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST5)) AS LEVEL5
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST6)) AS LEVEL6
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST7)) AS LEVEL7
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST8)) AS LEVEL8
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST9)) AS LEVEL9
	FROM SIGMA.WEBIMPORT.DBO.PR_UNION_MASTER_1_MC WITH (NOLOCK)
	where Company_code = '600'

	--SELECT * FROM @UNION_CODES

	SELECT DISTINCT JM.CONTRACT_NUMBER                                                  
	,               JM.JOB_NUMBER                                                       
	,               JLT.UNION_CODE                                                          UNIONCODE
	,               UC.UNION_NAME                                                           UNIONCODE_DESC
	,               EMT3.EMPLOYEE_NAME                                                   AS FOREMANNAME
	,               EMT.EMPLOYEE_NAME                                                    AS EMPLOYEENAME
	,               EMT.EMPLOYEE_ID                                                         EMPLOYEEID
	,               EMT.COMPANY_CODE                                                        EMPLOYEE_COMPANY_CODE
	,               JLT.STANDARD_HOURS                                                      STANDARDHOURS
	,               JLT.OT_HOURS                                                            OTHOURS
	,               JLT.DT_HOURS                                                            DTHOURS
	,               JLT.OVERRIDES                                                           OVERRIDEHOURS
	,               JLT.PER_DIEM                                                            PERDEIMHOURS
	,               JLT.PER_DIEM_TYPE                                                       PERDEIMHOURSTYPE
	,               JLT.RIG_RENTALS                                                         RIGRENTALHOURS
	,               JLT.MISC_CODE                                                           MISCCODE
	,               JLT.TRAVEL_PAY                                                          TRAVELPAY
	,               JLT.WAIT_TIME_HOURS                                                     WAITTIMEHOURS
	,               JLT.SICK_LEAVE_TYPE                                                     SICKLEAVETYPE
	,               PAID_TIME_OFF                                                        AS PTO
	,               HOLIDAY_PAY                                                          AS HOLIDAY
	,               AUTO_ALLOWANCE                                                       AS TRUCKPAY
	,               JT.JOB_START_DATE                                                       ACCOUNTINGEFFECTIVEDATE
	,               JT.MODIFIED_ON                                                          APPROVEDDATE
	,               JT.JOB_START_DATE                                                       JOBDATE
	,               JT.JOB_START_DATE                                                   
	,               JLT.WBS_CODE                                                        
	,               JLT.WI_CITY_ID                                                      
	,               CCT.[USER_ID]                                                       
	,               CASE (DATEPART(WEEKDAY,JT.JOB_START_DATE)) WHEN 1 THEN 'Sun'
	                                                           WHEN 2 THEN 'Mon'
	                                                           WHEN 3 THEN 'Tue'
	                                                           WHEN 4 THEN 'Wed'
	                                                           WHEN 5 THEN 'Thur'
	                                                           WHEN 6 THEN 'Fri'
	                                                           WHEN 7 THEN 'Sat' END     AS 'DOW'
	,               EMT2.EMPLOYEE_NAME                                                   AS SUPERNAME
	,               CAST(JLT.STANDARD_HOURS AS FLOAT) +
	CAST(JLT.OT_HOURS AS FLOAT) +
	CAST(JLT.DT_HOURS AS FLOAT)                                                          AS DAILYTOTAL
	,               JLT.PAY_LEVEL                                                           PAYLEVEL
	,               CASE WHEN JLT.PAY_LEVEL = 1 THEN UC.RATE_LEVEL_DESCRIPTION_LIST1
	                     WHEN JLT.PAY_LEVEL = 2 THEN UC.RATE_LEVEL_DESCRIPTION_LIST2
	                     WHEN JLT.PAY_LEVEL = 3 THEN UC.RATE_LEVEL_DESCRIPTION_LIST3
	                     WHEN JLT.PAY_LEVEL = 4 THEN UC.RATE_LEVEL_DESCRIPTION_LIST4
	                     WHEN JLT.PAY_LEVEL = 5 THEN UC.RATE_LEVEL_DESCRIPTION_LIST5
	                     WHEN JLT.PAY_LEVEL = 6 THEN UC.RATE_LEVEL_DESCRIPTION_LIST6
	                     WHEN JLT.PAY_LEVEL = 7 THEN UC.RATE_LEVEL_DESCRIPTION_LIST7
	                     WHEN JLT.PAY_LEVEL = 8 THEN UC.RATE_LEVEL_DESCRIPTION_LIST8
	                     WHEN JLT.PAY_LEVEL = 9 THEN UC.RATE_LEVEL_DESCRIPTION_LIST9 END AS PAY_LEVEL_DESC
	FROM            [CREWLINK_2].[DBO].[CL_JOB_LABOR_T] JLT (NOLOCK) --TABLE OF ALL ENTRIES
	INNER JOIN      CL_JOB_T                            JT (NOLOCK)                         ON JLT.JOB_ID = JT.JOB_ID
	INNER JOIN      WI_JOB_MASTER_T                     JM (NOLOCK)                         ON JT.WI_JOB_ID = JM.WI_JOB_ID
	INNER JOIN      CL_CONTRACT_CREW_T                  CCT (NOLOCK)                        ON JLT.FOREMAN_CREW_ID = CCT.FOREMAN_CREW_ID --CREW MEMBERS
	INNER JOIN      CL_USER                             U                                   ON U.USER_ID = CCT.USER_ID --USER INFO FOR CREW MEMBER
	INNER JOIN      WI_EMPLOYEE_MASTER_T                EMT (NOLOCK)                        ON CCT.WI_EMPLOYEE_ID = EMT.WI_EMPLOYEE_ID --EMPLOYEE INFO FOR CREW MEMBER
	INNER JOIN      WI_EMPLOYEE_MASTER_T                EMT2 (NOLOCK)                       ON EMT2.EMPLOYEE_ID = JM.SUPERINTENDENT
	INNER JOIN      CL_USER                             U2                                  ON U2.USER_ID = JT.CREATED_BY
	INNER JOIN      WI_EMPLOYEE_MASTER_T                EMT3 (NOLOCK)                       ON EMT3.WI_EMPLOYEE_ID = U2.WI_EMPLOYEE_ID
	INNER JOIN      WI_CONTRACT_MASTER_T                CMT (NOLOCK)                        ON JM.CONTRACT_NUMBER = CMT.CONTRACT_NUMBER
	LEFT OUTER JOIN @UNION_CODES                        UC                                  ON JLT.UNION_CODE = UC.UNION_CODE
	-------------------------------------------------------------------------------------
	WHERE JT.JOB_STATUS_ID IN (1,2,4,7)
		AND CAST(JT.JOB_START_DATE AS DATE) >= @WEEKBEGIN
		AND CAST(JT.JOB_START_DATE AS DATE) <= @WEEKEND
		AND EMT2.WI_EMPLOYEE_ID IN (SELECT ITEMS
		FROM DBO.SPLIT(@Superintendent,','))
		AND U2.USER_ID IN (SELECT ITEMS
		FROM DBO.SPLIT(@ForemanID,','))
		AND EMT.EMPLOYEE_ID IN (SELECT ITEMS
		FROM DBO.SPLIT(@EMPLOYEEID,','))
		AND JM.CONTRACT_NUMBER IN (SELECT ITEMS
		FROM DBO.SPLIT(@ContractID,','))
	-------------------------------------------------------------------------------------
	ORDER BY EMPLOYEENAME
	,        JOBDATE ASC
END

GO
/****** Object:  StoredProcedure [dbo].[CL_2_Timesheet_By_Employee_WIP_KoP]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[CL_2_Timesheet_By_Employee_WIP_KoP] @WEEKBEGIN DATE
, -- = '2021-03-07 00:00.000'
                                                            @WEEKEND DATE
, -- = '2021-03-13 00:00.000'
                                                            @ContractID VARCHAR (MAX)
,
--INSERT @CONTRACTNUMBERS(CONTRACT) VALUES ('SPIRE 21-23 A'), ('SPIRE 21-23 B');
                                                            @Superintendent VARCHAR(MAX)
,
--insert @Approvers(approver) values ('RALPH MONROE TULL III')
                                                            @ForemanID VARCHAR(MAX)
,                                                           @EMPLOYEEID varchar(max)
--insert @Foremen(foreman) values ('ALBERT RANDY CARMICHAEL') --, ('DAVID DOUGLAS ROBEY'),('JAMES STEVENSON')
AS
BEGIN
	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;


	--INSERT INTO PARAMETERS_INFO VALUES('CL_2_Timesheet_By_Employee_WIP_KoP',@WEEKBEGIN, @WEEKEND, @ContractID, @Superintendent, @ForemanID, @EMPLOYEEID,GETDATE())

	DECLARE @UNION_CODES AS TABLE ( UNION_CODE                   VARCHAR(50)
	,                               UNION_NAME                   VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST1 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST2 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST3 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST4 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST5 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST6 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST7 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST8 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST9 VARCHAR(200) )

	DECLARE @EMPLOYEE_DETAILS AS TABLE ( W_I_EMPLOYEE_CODE VARCHAR(20)
	,                                    W_I_FIRST_NAME    VARCHAR(50)
	,                                    W_I_MIDDLE_NAME   VARCHAR(50)
	,                                    W_I_LAST_NAME     VARCHAR(50) )

	INSERT INTO @EMPLOYEE_DETAILS
	SELECT RTRIM(LTRIM(EMPLOYEE_CODE)) AS EMPLOYEE_CODE
	,      RTRIM(LTRIM(FIRST_NAME))    AS FIRST_NAME
	,      RTRIM(LTRIM(MIDDLE_NAME))   AS MIDDLE_NAME
	,      RTRIM(LTRIM(LAST_NAME))     AS LAST_NAME
	FROM [SIGMA].[WEBIMPORT].[DBO].[PR_EMPLOYEE_MASTER_1_MC]

	--SELECT * FROM @EMPLOYEE_DETAILS

	INSERT INTO @UNION_CODES
	SELECT UNION_CODE                                
	,      UNION_NAME                                
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST1)) AS LEVEL1
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST2)) AS LEVEL2
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST3)) AS LEVEL3
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST4)) AS LEVEL4
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST5)) AS LEVEL5
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST6)) AS LEVEL6
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST7)) AS LEVEL7
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST8)) AS LEVEL8
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST9)) AS LEVEL9
	FROM SIGMA.WEBIMPORT.DBO.PR_UNION_MASTER_1_MC WITH (NOLOCK)
	where Company_code = '500'

	--SELECT * FROM @UNION_CODES

	--SELECT ITEMS FROM DBO.SPLIT(@ContractID,',')

	SELECT DISTINCT JM.CONTRACT_NUMBER                                                  
	,               JM.JOB_NUMBER                                                       
	,               JLT.UNION_CODE                                                          UNIONCODE
	,               UC.UNION_NAME                                                           UNIONCODE_DESC
	,               EMT3.EMPLOYEE_NAME                                                   AS FOREMANNAME
	,               EMT.EMPLOYEE_NAME                                                    AS EMPLOYEENAME
	,               EMT.EMPLOYEE_ID                                                         EMPLOYEEID
	,               EMT.COMPANY_CODE                                                        EMPLOYEE_COMPANY_CODE
	,               JLT.STANDARD_HOURS                                                      STANDARDHOURS
	,               JLT.OT_HOURS                                                            OTHOURS
	,               JLT.DT_HOURS                                                            DTHOURS
	,               JLT.OVERRIDES                                                           OVERRIDEHOURS
	,               JLT.PER_DIEM                                                            PERDEIMHOURS
	,               JLT.PER_DIEM_TYPE                                                       PERDEIMHOURSTYPE
	,               JLT.RIG_RENTALS                                                         RIGRENTALHOURS
	,               JLT.MISC_CODE                                                           MISCCODE
	,               JLT.TRAVEL_PAY                                                          TRAVELPAY
	,               JLT.WAIT_TIME_HOURS                                                     WAITTIMEHOURS
	,               JLT.SICK_LEAVE_TYPE                                                     SICKLEAVETYPE
	,               PAID_TIME_OFF                                                        AS PTO
	,               HOLIDAY_PAY                                                          AS HOLIDAY
	,               AUTO_ALLOWANCE                                                       AS TRUCKPAY
	,               JT.JOB_START_DATE                                                       ACCOUNTINGEFFECTIVEDATE
	,               JT.MODIFIED_ON                                                          APPROVEDDATE
	,               JT.JOB_START_DATE                                                       JOBDATE
	,               JT.JOB_START_DATE                                                   
	,               JLT.WBS_CODE                                                        
	,               JLT.WI_CITY_ID                                                      
	,               CCT.[USER_ID]                                                       
	,               CASE (DATEPART(WEEKDAY,JT.JOB_START_DATE)) WHEN 1 THEN 'Sun'
	                                                           WHEN 2 THEN 'Mon'
	                                                           WHEN 3 THEN 'Tue'
	                                                           WHEN 4 THEN 'Wed'
	                                                           WHEN 5 THEN 'Thur'
	                                                           WHEN 6 THEN 'Fri'
	                                                           WHEN 7 THEN 'Sat' END     AS 'DOW'
	,               EMT2.EMPLOYEE_NAME                                                   AS SUPERNAME
	,               CAST(JLT.STANDARD_HOURS AS FLOAT) +
	CAST(JLT.OT_HOURS AS FLOAT) +
	CAST(JLT.DT_HOURS AS FLOAT)                                                          AS DAILYTOTAL
	,               JLT.PAY_LEVEL                                                           PAYLEVEL
	,               CASE WHEN JLT.PAY_LEVEL = 1 THEN UC.RATE_LEVEL_DESCRIPTION_LIST1
	                     WHEN JLT.PAY_LEVEL = 2 THEN UC.RATE_LEVEL_DESCRIPTION_LIST2
	                     WHEN JLT.PAY_LEVEL = 3 THEN UC.RATE_LEVEL_DESCRIPTION_LIST3
	                     WHEN JLT.PAY_LEVEL = 4 THEN UC.RATE_LEVEL_DESCRIPTION_LIST4
	                     WHEN JLT.PAY_LEVEL = 5 THEN UC.RATE_LEVEL_DESCRIPTION_LIST5
	                     WHEN JLT.PAY_LEVEL = 6 THEN UC.RATE_LEVEL_DESCRIPTION_LIST6
	                     WHEN JLT.PAY_LEVEL = 7 THEN UC.RATE_LEVEL_DESCRIPTION_LIST7
	                     WHEN JLT.PAY_LEVEL = 8 THEN UC.RATE_LEVEL_DESCRIPTION_LIST8
	                     WHEN JLT.PAY_LEVEL = 9 THEN UC.RATE_LEVEL_DESCRIPTION_LIST9 END AS PAY_LEVEL_DESC
	FROM            [CREWLINK_2].[DBO].[CL_JOB_LABOR_T] JLT (NOLOCK) --TABLE OF ALL ENTRIES
	INNER JOIN      CL_JOB_T                            JT (NOLOCK)                         ON JLT.JOB_ID = JT.JOB_ID
	INNER JOIN      WI_JOB_MASTER_T                     JM (NOLOCK)                         ON JT.WI_JOB_ID = JM.WI_JOB_ID
	INNER JOIN      CL_CONTRACT_CREW_T                  CCT (NOLOCK)                        ON JLT.FOREMAN_CREW_ID = CCT.FOREMAN_CREW_ID --CREW MEMBERS
	INNER JOIN      CL_USER                             U                                   ON U.USER_ID = CCT.USER_ID --USER INFO FOR CREW MEMBER
	INNER JOIN      WI_EMPLOYEE_MASTER_T                EMT (NOLOCK)                        ON CCT.WI_EMPLOYEE_ID = EMT.WI_EMPLOYEE_ID --EMPLOYEE INFO FOR CREW MEMBER
	INNER JOIN      WI_EMPLOYEE_MASTER_T                EMT2 (NOLOCK)                       ON EMT2.EMPLOYEE_ID = JM.SUPERINTENDENT
	INNER JOIN      CL_USER                             U2                                  ON U2.USER_ID = JT.CREATED_BY
	INNER JOIN      WI_EMPLOYEE_MASTER_T                EMT3 (NOLOCK)                       ON EMT3.WI_EMPLOYEE_ID = U2.WI_EMPLOYEE_ID
	INNER JOIN      WI_CONTRACT_MASTER_T                CMT (NOLOCK)                        ON JM.CONTRACT_NUMBER = CMT.CONTRACT_NUMBER
	LEFT OUTER JOIN @UNION_CODES                        UC                                  ON JLT.UNION_CODE = UC.UNION_CODE
	-------------------------------------------------------------------------------------
	WHERE JT.JOB_STATUS_ID IN (1,2,4,7)
		AND CAST(JT.JOB_START_DATE AS DATE) >= @WEEKBEGIN
		AND CAST(JT.JOB_START_DATE AS DATE) <= @WEEKEND
		AND U2.USER_ID IN (SELECT ITEMS
		FROM DBO.SPLIT(@ForemanID,','))
		AND EMT2.WI_EMPLOYEE_ID IN (SELECT ITEMS
		FROM DBO.SPLIT(@Superintendent,','))
		AND EMT.EMPLOYEE_ID IN (SELECT ITEMS
		FROM DBO.SPLIT(@EMPLOYEEID,','))
		AND JM.CONTRACT_NUMBER IN (SELECT ITEMS
		FROM DBO.SPLIT(@ContractID,','))
	-------------------------------------------------------------------------------------
	ORDER BY EMPLOYEENAME
	,        JOBDATE ASC
END

GO
/****** Object:  StoredProcedure [dbo].[CL_2_Timesheet_By_Employee_WIP_NEW_SPECIAL_PROJECTS]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[CL_2_Timesheet_By_Employee_WIP_NEW_SPECIAL_PROJECTS] @WEEKBEGIN DATE
, -- = '2021-03-07 00:00.000'
                                                                             @WEEKEND DATE
, -- = '2021-03-13 00:00.000'
                                                                             @ContractID VARCHAR (MAX)
,
--INSERT @CONTRACTNUMBERS(CONTRACT) VALUES ('SPIRE 21-23 A'), ('SPIRE 21-23 B');
                                                                             @Superintendent VARCHAR(MAX)
,
--insert @Approvers(approver) values ('RALPH MONROE TULL III')
                                                                             @ForemanID VARCHAR(MAX)
,                                                                            @EMPLOYEEID varchar(max)
--insert @Foremen(foreman) values ('ALBERT RANDY CARMICHAEL') --, ('DAVID DOUGLAS ROBEY'),('JAMES STEVENSON')
AS
BEGIN
	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;



	--INSERT INTO PARAMETERS_INFO VALUES('CL_2_Timesheet_By_Employee_WIP_NEW_SPECIAL_PROJECTS',@WEEKBEGIN, @WEEKEND, @ContractID, @Superintendent, @ForemanID, @EMPLOYEEID,GETDATE())

	DECLARE @UNION_CODES AS TABLE ( UNION_CODE                   VARCHAR(50)
	,                               UNION_NAME                   VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST1 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST2 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST3 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST4 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST5 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST6 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST7 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST8 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST9 VARCHAR(200) )

	INSERT INTO @UNION_CODES
	SELECT UNION_CODE                                
	,      UNION_NAME                                
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST1)) AS LEVEL1
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST2)) AS LEVEL2
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST3)) AS LEVEL3
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST4)) AS LEVEL4
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST5)) AS LEVEL5
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST6)) AS LEVEL6
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST7)) AS LEVEL7
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST8)) AS LEVEL8
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST9)) AS LEVEL9
	FROM SIGMA.WEBIMPORT.DBO.PR_UNION_MASTER_1_MC WITH (NOLOCK)

	--SELECT * FROM @UNION_CODES

	SELECT DISTINCT JM.CONTRACT_NUMBER                                                  
	,               JM.JOB_NUMBER                                                       
	,               JLT.UNION_CODE                                                          UNIONCODE
	,               UC.UNION_NAME                                                           UNIONCODE_DESC
	,               EMT3.EMPLOYEE_NAME                                                   AS FOREMANNAME
	,               EMT.EMPLOYEE_NAME                                                    AS EMPLOYEENAME
	,               EMT.EMPLOYEE_ID                                                         EMPLOYEEID
	,               EMT.COMPANY_CODE                                                        EMPLOYEE_COMPANY_CODE
	,               JLT.STANDARD_HOURS                                                      STANDARDHOURS
	,               JLT.OT_HOURS                                                            OTHOURS
	,               JLT.DT_HOURS                                                            DTHOURS
	,               JLT.OVERRIDES                                                           OVERRIDEHOURS
	,               JLT.PER_DIEM                                                            PERDEIMHOURS
	,               JLT.PER_DIEM_TYPE                                                       PERDEIMHOURSTYPE
	,               JLT.RIG_RENTALS                                                         RIGRENTALHOURS
	,               JLT.MISC_CODE                                                           MISCCODE
	,               JLT.TRAVEL_PAY                                                          TRAVELPAY
	,               JLT.WAIT_TIME_HOURS                                                     WAITTIMEHOURS
	,               JLT.SICK_LEAVE_TYPE                                                     SICKLEAVETYPE
	,               PAID_TIME_OFF                                                        AS PTO
	,               HOLIDAY_PAY                                                          AS HOLIDAY
	,               AUTO_ALLOWANCE                                                       AS TRUCKPAY
	,               JT.JOB_START_DATE                                                       ACCOUNTINGEFFECTIVEDATE
	,               JT.MODIFIED_ON                                                          APPROVEDDATE
	,               JT.JOB_START_DATE                                                       JOBDATE
	,               JT.JOB_START_DATE                                                   
	,               JLT.WBS_CODE                                                        
	,               JLT.WI_CITY_ID                                                      
	,               CCT.[USER_ID]                                                       
	,               CASE (DATEPART(WEEKDAY,JT.JOB_START_DATE)) WHEN 1 THEN 'Sun'
	                                                           WHEN 2 THEN 'Mon'
	                                                           WHEN 3 THEN 'Tue'
	                                                           WHEN 4 THEN 'Wed'
	                                                           WHEN 5 THEN 'Thur'
	                                                           WHEN 6 THEN 'Fri'
	                                                           WHEN 7 THEN 'Sat' END     AS 'DOW'
	,               EMT2.EMPLOYEE_NAME                                                   AS SUPERNAME
	,               CAST(JLT.STANDARD_HOURS AS FLOAT) +
	CAST(JLT.OT_HOURS AS FLOAT) +
	CAST(JLT.DT_HOURS AS FLOAT)                                                          AS DAILYTOTAL
	,               JLT.PAY_LEVEL                                                           PAYLEVEL
	,               CASE WHEN JLT.PAY_LEVEL = 1 THEN UC.RATE_LEVEL_DESCRIPTION_LIST1
	                     WHEN JLT.PAY_LEVEL = 2 THEN UC.RATE_LEVEL_DESCRIPTION_LIST2
	                     WHEN JLT.PAY_LEVEL = 3 THEN UC.RATE_LEVEL_DESCRIPTION_LIST3
	                     WHEN JLT.PAY_LEVEL = 4 THEN UC.RATE_LEVEL_DESCRIPTION_LIST4
	                     WHEN JLT.PAY_LEVEL = 5 THEN UC.RATE_LEVEL_DESCRIPTION_LIST5
	                     WHEN JLT.PAY_LEVEL = 6 THEN UC.RATE_LEVEL_DESCRIPTION_LIST6
	                     WHEN JLT.PAY_LEVEL = 7 THEN UC.RATE_LEVEL_DESCRIPTION_LIST7
	                     WHEN JLT.PAY_LEVEL = 8 THEN UC.RATE_LEVEL_DESCRIPTION_LIST8
	                     WHEN JLT.PAY_LEVEL = 9 THEN UC.RATE_LEVEL_DESCRIPTION_LIST9 END AS PAY_LEVEL_DESC
	FROM            [CREWLINK_2].[DBO].[CL_JOB_LABOR_T] JLT (NOLOCK) --TABLE OF ALL ENTRIES
	INNER JOIN      CL_JOB_T                            JT (NOLOCK)                         ON JLT.JOB_ID = JT.JOB_ID
	INNER JOIN      WI_JOB_MASTER_T                     JM (NOLOCK)                         ON JT.WI_JOB_ID = JM.WI_JOB_ID
	INNER JOIN      CL_CONTRACT_CREW_T                  CCT (NOLOCK)                        ON JLT.FOREMAN_CREW_ID = CCT.FOREMAN_CREW_ID --CREW MEMBERS
	INNER JOIN      CL_USER                             U                                   ON U.USER_ID = CCT.USER_ID --USER INFO FOR CREW MEMBER
	INNER JOIN      WI_EMPLOYEE_MASTER_T                EMT (NOLOCK)                        ON CCT.WI_EMPLOYEE_ID = EMT.WI_EMPLOYEE_ID --EMPLOYEE INFO FOR CREW MEMBER
	INNER JOIN      WI_EMPLOYEE_MASTER_T                EMT2 (NOLOCK)                       ON EMT2.EMPLOYEE_ID = JM.SUPERINTENDENT
	INNER JOIN      CL_USER                             U2                                  ON U2.USER_ID = JT.CREATED_BY
	INNER JOIN      WI_EMPLOYEE_MASTER_T                EMT3 (NOLOCK)                       ON EMT3.WI_EMPLOYEE_ID = U2.WI_EMPLOYEE_ID
	INNER JOIN      WI_CONTRACT_MASTER_T                CMT (NOLOCK)                        ON JM.CONTRACT_NUMBER = CMT.CONTRACT_NUMBER
	LEFT OUTER JOIN @UNION_CODES                        UC                                  ON JLT.UNION_CODE = UC.UNION_CODE
	-------------------------------------------------------------------------------------
	WHERE JT.JOB_STATUS_ID IN (1,2,4,7)
		AND CAST(JT.JOB_START_DATE AS DATE) >= @WEEKBEGIN
		AND CAST(JT.JOB_START_DATE AS DATE) <= @WEEKEND
		AND EMT2.WI_EMPLOYEE_ID IN (SELECT ITEMS
		FROM DBO.SPLIT(@Superintendent,','))
		AND U2.USER_ID IN (SELECT ITEMS
		FROM DBO.SPLIT(@ForemanID,','))
		AND EMT.EMPLOYEE_ID IN (SELECT ITEMS
		FROM DBO.SPLIT(@EMPLOYEEID,','))
		AND JM.CONTRACT_NUMBER IN (SELECT ITEMS
		FROM DBO.SPLIT(@ContractID,','))
	-------------------------------------------------------------------------------------
	ORDER BY EMPLOYEENAME
	,        JOBDATE ASC
END

	exec [CL_2_Timesheet_By_Employee_WIP_NEW_SPECIAL_PROJECTS] '5/30/2021'
	,                                                          '6/12/2021'
	,                                                          'PECO ELEC MAINT 21-25'
	,                                                          '1549'
	,                                                          '3061'
	,                                                          '87220,23195'
GO
/****** Object:  StoredProcedure [dbo].[Cl2_missingequipment]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[Cl2_missingequipment]
--@CompanyCode Nvarchar(10),
--@Superintendent nvarchar(10) = '',
  @CurrentdateStart DATE
, @CurrentdateEnd DATE

--@Superintendent varchar(20)
AS

	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	--Declare @CurrentdateStart date
	--Declare @CurrentdateEnd date


	--set @CurrentdateStart = '10/16/17'
	--set @CurrentdateEnd = '10/21/17'


	IF Object_id('tempdb..#CurrentWeek') IS NOT NULL
	BEGIN
		DROP TABLE #currentweek
	END

	IF Object_id('tempdb..#PreviousWeek') IS NOT NULL
	BEGIN
		DROP TABLE #previousweek
	END

	CREATE TABLE #currentweek ( equipcode      NVARCHAR(10)
	,                           equipdesc      NVARCHAR(100)
	,                           active         NVARCHAR(1)
	,                           superintendent NVARCHAR(100)
	,                           job_number     NVARCHAR(10)
	,                           foreman        NVARCHAR(40)
	,                           OwnedFlag      NVarchar(10) )

	CREATE TABLE #previousweek ( equipcode      NVARCHAR(10)
	,                            equipdesc      NVARCHAR(100)
	,                            active         NVARCHAR(1)
	,                            superintendent NVARCHAR(100)
	,                            job_number     NVARCHAR(10)
	,                            foreman        NVARCHAR(40)
	,                            OwnedFlag      NVarchar(10) )

	INSERT INTO #currentweek ( equipcode, equipdesc, active, superintendent, job_number, foreman, OwnedFlag )
	SELECT DISTINCT
	-- CL_JOB_T.JOB_START_DATE,
	  wi_fleet_master_t.equipment_code       
	, wi_fleet_master_t.equipment_description
	, cl_contract_fleet_t.isactive           
	, Emp2.EMPLOYEE_NAME                      as superintendent
	, wi_job_master_t.job_number             
	, cl_user.user_name                       AS Foreman_Name
	, owned_flag                             

	FROM       cl_job_t                                          
	INNER JOIN wi_job_master_t                                    ON cl_job_t.wi_job_id = wi_job_master_t.wi_job_id
	INNER JOIN cl_user                                            ON cl_job_t.user_id = cl_user.user_id
	INNER JOIN wi_employee_master_t                               ON cl_user.wi_employee_id =
			wi_employee_master_t.wi_employee_id
	INNER JOIN cl_contract_fleet_t                                ON cl_user.user_id = cl_contract_fleet_t.user_id
	INNER JOIN wi_fleet_master_t                                  ON cl_contract_fleet_t.wi_fleet_id =
			wi_fleet_master_t.wi_fleet_id
	JOIN       cl_job_equipment_t                            je   ON je.[job_id] = cl_job_t.job_id
			AND je.[contract_fleet_id] =
			cl_contract_fleet_t.[contract_fleet_id]
			AND je.hours > 0
	JOIN       wi_employee_master_t                       AS Emp2 ON wi_job_master_t.superintendent =
			emp2.wi_employee_id
	JOIN       SIGMA.WebImport.dbo.EC_EQUIPMENT_MASTER_MC    em   on rtrim(ltrim(em.EQUIPMENT_CODE)) = wi_fleet_master_t.EQUIPMENT_CODE
	WHERE job_start_date BETWEEN @CurrentdateStart AND @CurrentdateEnd
		and WI_JOB_MASTER_T.CONTRACT_NUMBER in ('MGE 2015-17', 'KGS 2012',
		'KGS 2016-19',
		'KGS TOPEKA 16-19')
	--  select * from #CurrentWeek   order by EquipCode
	INSERT INTO #previousweek ( equipcode, equipdesc, active, superintendent, job_number, foreman, OwnedFlag )
	SELECT DISTINCT
	-- CL_JOB_T.JOB_START_DATE,
	  wi_fleet_master_t.equipment_code       
	, wi_fleet_master_t.equipment_description
	, cl_contract_fleet_t.isactive           
	, Emp2.EMPLOYEE_NAME                      as superintendent
	, wi_job_master_t.job_number             
	, cl_user.user_name                       AS Foreman_Name
	, owned_flag                             
	FROM       cl_job_t                                          
	INNER JOIN wi_job_master_t                                    ON cl_job_t.wi_job_id = wi_job_master_t.wi_job_id
	INNER JOIN cl_user                                            ON cl_job_t.user_id = cl_user.user_id
	INNER JOIN wi_employee_master_t                               ON cl_user.wi_employee_id =
			wi_employee_master_t.wi_employee_id
	INNER JOIN cl_contract_fleet_t                                ON cl_user.user_id = cl_contract_fleet_t.user_id
	INNER JOIN wi_fleet_master_t                                  ON cl_contract_fleet_t.wi_fleet_id =
			wi_fleet_master_t.wi_fleet_id
	JOIN       cl_job_equipment_t                            je   ON je.[job_id] = cl_job_t.job_id
			AND je.[contract_fleet_id] =
			cl_contract_fleet_t.[contract_fleet_id]
			AND je.hours > 0
	JOIN       wi_employee_master_t                       AS Emp2 ON wi_job_master_t.superintendent =
			emp2.wi_employee_id
	JOIN       SIGMA.WebImport.dbo.EC_EQUIPMENT_MASTER_MC    em   on rtrim(ltrim(em.EQUIPMENT_CODE)) = wi_fleet_master_t.EQUIPMENT_CODE
	WHERE job_start_date BETWEEN Dateadd(day, -7, @CurrentdateStart) AND
		Dateadd(day, -1, @CurrentdateStart)
		and WI_JOB_MASTER_T.CONTRACT_NUMBER in ('MGE 2015-17', 'KGS 2012',
		'KGS 2016-19',
		'KGS TOPEKA 16-19')
	--select * from #PreviousWeek  order by EquipCode
	SELECT DISTINCT equipcode
	,               equipdesc
	,               active
	,               superintendent
	,               job_number
	,               foreman
	,               ownedflag
	FROM #previousweek
	WHERE equipcode NOT IN (SELECT equipcode
		FROM #currentweek)
	ORDER BY equipcode
GO
/****** Object:  StoredProcedure [dbo].[Cl2_MissingEquipmentAll]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[Cl2_MissingEquipmentAll]
--@CompanyCode Nvarchar(10),
--@Superintendent nvarchar(10) = '',
  @CurrentdateStart DATE
, @CurrentdateEnd DATE
, @Contractid varchar(max)
--@Superintendent varchar(20)
AS

	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	--Declare @CurrentdateStart date
	--Declare @CurrentdateEnd date
	--Declare @Contractid varchar(max)
	--set @CurrentdateStart = '06/21/20'
	--set @CurrentdateEnd = '06/27/20'
	--set @Contractid = 'SPIRE BLANKET 2'

	IF Object_id('tempdb..#CurrentWeek') IS NOT NULL
	BEGIN
		DROP TABLE #currentweek
	END

	IF Object_id('tempdb..#PreviousWeek') IS NOT NULL
	BEGIN
		DROP TABLE #previousweek
	END

	CREATE TABLE #currentweek ( equipcode       NVARCHAR(10)
	,                           job_number      NVARCHAR(10)
	,                           CONTRACT_NUMBER Nvarchar(max) )

	CREATE TABLE #previousweek ( equipcode       NVARCHAR(10)
	,                            equipdesc       NVARCHAR(100)
	,                            superintendent  NVARCHAR(100)
	,                            job_number      NVARCHAR(10)
	,                            OwnedFlag       NVarchar(10)
	,                            CONTRACT_NUMBER Nvarchar(max)
	,                            transactionDate varchar(8) )

	INSERT INTO #currentweek ( equipcode, job_number, CONTRACT_NUMBER )
	SELECT distinct dbo.WI_FLEET_MASTER_T.EQUIPMENT_CODE
	,               dbo.WI_JOB_MASTER_T.JOB_NUMBER
	,               dbo.WI_JOB_MASTER_T.CONTRACT_NUMBER
	FROM       dbo.CL_JOB_T           
	INNER JOIN dbo.WI_JOB_MASTER_T     ON dbo.CL_JOB_T.WI_JOB_ID = dbo.WI_JOB_MASTER_T.WI_JOB_ID
	INNER JOIN dbo.CL_JOB_EQUIPMENT_T  ON dbo.CL_JOB_T.JOB_ID = dbo.CL_JOB_EQUIPMENT_T.JOB_ID
	INNER JOIN dbo.CL_CONTRACT_FLEET_T ON dbo.CL_JOB_EQUIPMENT_T.CONTRACT_FLEET_ID = dbo.CL_CONTRACT_FLEET_T.CONTRACT_FLEET_ID
	INNER JOIN dbo.WI_FLEET_MASTER_T   ON dbo.CL_CONTRACT_FLEET_T.WI_FLEET_ID = dbo.WI_FLEET_MASTER_T.WI_FLEET_ID
	WHERE (dbo.WI_JOB_MASTER_T.STATUS = 'A')
		and job_start_date BETWEEN @CurrentdateStart AND @CurrentdateEnd
		and (WI_JOB_MASTER_T.CONTRACT_NUMBER IN
		(SELECT items
		FROM dbo.Split(@Contractid, ',')))

	--select * from #CurrentWeek   order by EquipCode

	INSERT INTO #previousweek ( equipcode, equipdesc, superintendent, job_number, OwnedFlag, CONTRACT_NUMBER, transactionDate )
	----SELECT DISTINCT
	SELECT DISTINCT dbo.EC_REVENUE_HISTORY_MC.Equipment_Code
	,               dbo.WI_FLEET_MASTER_T.EQUIPMENT_DESCRIPTION
	,               dbo.WI_EMPLOYEE_MASTER_T.EMPLOYEE_NAME
	,               dbo.EC_REVENUE_HISTORY_MC.Job_Number
	,               owned_flag
	,               dbo.WI_JOB_MASTER_T.CONTRACT_NUMBER
	,               dbo.EC_REVENUE_HISTORY_MC.Transaction_Date
	FROM       dbo.EC_REVENUE_HISTORY_MC                    
	INNER JOIN dbo.WI_JOB_MASTER_T                           ON dbo.EC_REVENUE_HISTORY_MC.Job_Number = dbo.WI_JOB_MASTER_T.JOB_NUMBER
	INNER JOIN dbo.WI_FLEET_MASTER_T                         ON dbo.EC_REVENUE_HISTORY_MC.Equipment_Code = dbo.WI_FLEET_MASTER_T.EQUIPMENT_CODE
	INNER JOIN dbo.WI_EMPLOYEE_MASTER_T                      ON dbo.WI_JOB_MASTER_T.SUPERINTENDENT = dbo.WI_EMPLOYEE_MASTER_T.EMPLOYEE_ID
	join       SIGMA.WebImport.dbo.EC_EQUIPMENT_MASTER_MC em on rtrim(ltrim(em.EQUIPMENT_CODE)) = wi_fleet_master_t.EQUIPMENT_CODE
	WHERE (dbo.WI_JOB_MASTER_T.STATUS = 'A')
		and rtrim(ltrim(transaction_date)) >= convert(varchar(10),@CurrentdateStart,112) - 7
		AND rtrim(ltrim(transaction_date)) <= convert(varchar(10),@CurrentdateEnd,112) + 1
		and (WI_JOB_MASTER_T.CONTRACT_NUMBER IN
		(SELECT items
		FROM dbo.Split(@Contractid, ',')))
	--select * from #PreviousWeek  order by EquipCode
	IF getdate() > @CurrentdateEnd
	Begin
		SELECT DISTINCT equipcode
		,               equipdesc
		,               superintendent
		,
		--job_number, --commented out by berhanu to avoid showing duplicate fleet on report
		                ownedflag
		,               CONTRACT_NUMBER
		FROM #previousweek
		WHERE equipcode NOT IN (SELECT equipcode
			FROM #currentweek)
			and transactionDate = convert(varchar(10),@CurrentdateEnd,112)
		ORDER BY equipcode
	End
	Else
	Begin
		SELECT DISTINCT equipcode
		,               equipdesc
		,               superintendent
		,
		--job_number, --commented out by berhanu to avoid showing duplicate fleet on report
		                ownedflag
		,               CONTRACT_NUMBER
		FROM #previousweek
		WHERE equipcode NOT IN (SELECT equipcode
			FROM #currentweek)
		ORDER BY equipcode
	End

GO
/****** Object:  StoredProcedure [dbo].[GET_ACTIVE_PHASE_CODES_SP]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




CREATE PROCEDURE [dbo].[GET_ACTIVE_PHASE_CODES_SP] @JobNumber NVARCHAR(10)
,                                                 @CompanyCode NVARCHAR(80)
AS
BEGIN
	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	SELECT DISTINCT LTRIM(RTRIM(a.Phase_Code)) AS Phase_Code

	FROM SIGMA.webimport.dbo.JC_Phase_Master_MC AS a

	WHERE a.Job_Number = @JobNumber
		AND a.Company_code = @CompanyCode
		AND Status_Code = 'A'
END


GO
/****** Object:  StoredProcedure [dbo].[GET_COL_GAS_CONTRACT_NUMBER_SP]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




CREATE PROCEDURE [dbo].[GET_COL_GAS_CONTRACT_NUMBER_SP] @JobNumber varchar(50)
AS
BEGIN

	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	Select a.Company_Code      as CompanyCode
	,      a.Job_Number        as JobNumber
	,      a.User_Def_Sequence as UserDefinedField
	,      b.prompt            as Prompt
	,      a.Alpha_Field       as ContractNumber
	,      a.Date_Field        as Date
	,      a.Amount_Field      as Amount
	From       SIGMA.webimport.dbo.JC_JOB_USER_FIELDS_DET_MC AS a WITH (NOLOCK)
	INNER JOIN SIGMA.webimport.dbo.PA_USER_FIELDS_SETUP_U_MC AS b with (NOLOCK) ON a.User_Def_Sequence = b.[Sequence]
			AND b.Entry_Type = 'JOB'
	Where a.User_Def_Sequence = '000023'
		and a.Job_Number = @JobNumber
END
GO
/****** Object:  StoredProcedure [dbo].[GET_EMPLOYEE_PAY_LEVEL_BY_UNION_CODE]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




-- =============================================
-- Author:		Berhanu Mitiku
-- Create date: 01/14/2020
-- Description:	Shows all Pay levels for a union code
-- =============================================
CREATE PROCEDURE [dbo].[GET_EMPLOYEE_PAY_LEVEL_BY_UNION_CODE] @UnionCode varchar(50)
,                                                            @CompanyCode varchar(50)
AS
BEGIN
	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;


	select
	--Company_code as CompanyCode,
	--Union_code as UnionCode,
	--Craft_Description as CraftDescription,
	  rtrim(ltrim(Rate_Level_Description_List1)) as Level1
	, rtrim(ltrim(Rate_Level_Description_List2)) as Level2
	, rtrim(ltrim(Rate_Level_Description_List3)) as Level3
	, rtrim(ltrim(Rate_Level_Description_List4)) as Level4
	, rtrim(ltrim(Rate_Level_Description_List5)) as Level5
	, rtrim(ltrim(Rate_Level_Description_List6)) as Level6
	, rtrim(ltrim(Rate_Level_Description_List7)) as Level7
	, rtrim(ltrim(Rate_Level_Description_List8)) as Level8
	, rtrim(ltrim(Rate_Level_Description_List9)) as Level9
	from sigma.webimport.dbo.PR_UNION_MASTER_1_MC
	WHERE rtrim(ltrim(Union_Code)) in
		(@UnionCode)
		AND Company_code = @CompanyCode
END

GO
/****** Object:  StoredProcedure [dbo].[GET_EMPLOYEE_PAY_LEVEL_DEFAULT_UNION_CODE]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




CREATE PROCEDURE [dbo].[GET_EMPLOYEE_PAY_LEVEL_DEFAULT_UNION_CODE] @UnionCode varchar(50)
--,@CompanyCode varchar(50)
AS
BEGIN
	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;


	select Rate_Level_Description_List1 as Level1
	,      Rate_Level_Description_List2 as Level2
	,      Rate_Level_Description_List3 as Level3
	,      Rate_Level_Description_List4 as Level4
	,      Rate_Level_Description_List5 as Level5
	,      Rate_Level_Description_List6 as Level6
	,      Rate_Level_Description_List7 as Level7
	,      Rate_Level_Description_List8 as Level8
	,      Rate_Level_Description_List9 as Level9
	from sigma.webimport.dbo.PR_UNION_MASTER_1_MC
	WHERE rtrim(ltrim(Union_Code)) in(@UnionCode)
		AND Company_code = '600'
END
GO
/****** Object:  StoredProcedure [dbo].[GET_PAY_LEVELS_FOR_PECO_UNION_CODE_SP]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




CREATE PROCEDURE [dbo].[GET_PAY_LEVELS_FOR_PECO_UNION_CODE_SP] @UnionCode varchar(50)
,                                                             @CompanyCode varchar(50)
AS
BEGIN
	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;


	select
	--Company_code as CompanyCode,
	--Union_code as UnionCode,
	--Craft_Description as CraftDescription,
	  rtrim(ltrim(Rate_Level_Description_List1)) as Level1
	, rtrim(ltrim(Rate_Level_Description_List2)) as Level2
	, rtrim(ltrim(Rate_Level_Description_List3)) as Level3
	, rtrim(ltrim(Rate_Level_Description_List4)) as Level4
	, rtrim(ltrim(Rate_Level_Description_List5)) as Level5
	, rtrim(ltrim(Rate_Level_Description_List6)) as Level6
	, rtrim(ltrim(Rate_Level_Description_List7)) as Level7
	, rtrim(ltrim(Rate_Level_Description_List8)) as Level8
	, rtrim(ltrim(Rate_Level_Description_List9)) as Level9
	from sigma.webimport.dbo.PR_UNION_MASTER_1_MC
	WHERE rtrim(ltrim(Union_Code)) in(@UnionCode)
		AND Company_code = @CompanyCode
END
GO
/****** Object:  StoredProcedure [dbo].[GET_PECO_UNION_CODES]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




CREATE PROCEDURE [dbo].[GET_PECO_UNION_CODES] @CompanyCode varchar(50)
AS
BEGIN
	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;


	select distinct ltrim(rtrim(Company_code))      as CompanyCode
	,               ltrim(rtrim(Union_code))        as UnionCode
	,               ltrim(rtrim(Union_Name))        as UnionName
	,               ltrim(rtrim(Craft_Description)) as CraftDescription
	from sigma.webimport.dbo.PR_UNION_MASTER_1_MC
	WHERE Company_code = @CompanyCode
		and ltrim(rtrim(Status)) = 'A'
END



GO
/****** Object:  StoredProcedure [dbo].[IMPORT_CR_UNIT_PRICE_ITEM_MC_SP]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[IMPORT_CR_UNIT_PRICE_ITEM_MC_SP]
	-- Add the parameters for the stored procedure here
AS
BEGIN Try
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.

	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;



	IF object_id('tempdb..#tempWebImportTestingReport') IS NOT NULL
		DROP TABLE #tempWebImportTestingReport

    CREATE TABLE #tempWebImportTestingReport
   (Import_type nvarchar(50),SOURCE_Record_Count int,
   Target_Record_Count int,Update_Record_Count int, Insert_Record_Count int)

   insert into #tempWebImportTestingReport(Import_Type) values('Unit Price Import')


	IF object_id('tempdb..#tempunitprice') IS NOT NULL
		DROP TABLE #tempunitprice
		
		--SELECT *
		--INTO #tempunitprice
		--FROM openquery([sigma], '
	 --      SELECT
		--   rtrim(ltrim(Company_Code)) as Company_Code,
		--   rtrim(ltrim(Customer_Code)) as Customer_Code, 
		--   rtrim(ltrim(Job_Number)) as Job_Number, 
		--   rtrim(ltrim(Bill_Item_Code)) as Bill_Item_Code,
  --         rtrim(ltrim(Bill_Item_Description)) as Bill_Item_Description, 
  --         rtrim(ltrim(Unit_Price)) as Unit_Price, 
  --         rtrim(ltrim(Unit_Of_Measure)) as Unit_Of_Measure		  
  -- from sigma.WebImport.dbo.CR_UNIT_PRICE_ITEM_MC where  company_code <> ''088''')
  		SELECT
		   rtrim(ltrim(Company_Code)) as Company_Code,
		   rtrim(ltrim(Customer_Code)) as Customer_Code, 
		   rtrim(ltrim(Job_Number)) as Job_Number, 
		   rtrim(ltrim(Bill_Item_Code)) as Bill_Item_Code,
           rtrim(ltrim(Bill_Item_Description)) as Bill_Item_Description, 
           rtrim(ltrim(Unit_Price)) as Unit_Price, 
           rtrim(ltrim(Unit_Of_Measure)) as Unit_Of_Measure
		INTO #tempunitprice
   from sigma.WebImport.dbo.CR_UNIT_PRICE_ITEM_MC where  company_code <> '088'

   update #tempWebImportTestingReport set SOURCE_RECORD_COUNT = (SELECT COUNT(1) FROM  #tempunitprice )

	MERGE [dbo].[CR_UNIT_PRICE_ITEM_MC] AS Target
	USING #tempunitprice AS SOURCE
		ON rtrim(ltrim(target.Company_Code)) = rtrim(ltrim(SOURCE.Company_Code))
			AND rtrim(ltrim(target.Customer_Code)) = rtrim(ltrim(SOURCE.Customer_Code))
			AND rtrim(ltrim(target.job_number)) = rtrim(ltrim(SOURCE.job_number))
			AND rtrim(ltrim(target.Bill_Item_Code)) = rtrim(ltrim(SOURCE.Bill_Item_Code))
			AND rtrim(ltrim(target.Bill_Item_Description)) = rtrim(ltrim(SOURCE.Bill_Item_Description))
	WHEN MATCHED
		THEN
			UPDATE
			SET Target.CUSTOMER_CODE= SOURCE.CUSTOMER_CODE
				,Target.Unit_Price = SOURCE.Unit_Price
				,Target.Unit_Of_Measure = SOURCE.Unit_Of_Measure
	WHEN NOT MATCHED BY TARGET
		THEN
			INSERT (
			    COMPANY_CODE,
				CUSTOMER_CODE,
				JOB_NUMBER,
				Bill_Item_Code,
				Bill_Item_Description,
				Unit_Price,
				Unit_Of_Measure
				)
			VALUES (
			  SOURCE.COMPANY_CODE,
			  SOURCE.CUSTOMER_CODE,
			  SOURCE.JOB_NUMBER,
			  SOURCE.Bill_Item_Code,
			  SOURCE.Bill_Item_Description,
			  SOURCE.Unit_Price,
			  Source.Unit_Of_Measure
			);
 INSERT INTO jobsuccessfaillog 
                  (successfail, 
                   error_severity, 
                   error_line, 
                   procedurename, 
                   error_message, 
                   timestamp) 
      VALUES     ('Success', 
                  '', 
                  '', 
                  'IMPORT_CR_UNIT_PRICE_ITEM_MC_SP', 
                  '', 
                   Getdate() ) 
  END try 
   BEGIN catch 

      INSERT INTO jobsuccessfaillog 
                  (successfail, 
                   error_severity, 
                   error_line, 
                   procedurename, 
                   error_message, 
                   timestamp) 
      VALUES     ('Fail', 
                  Error_severity(), 
                  Error_line(), 
                  'IMPORT_CR_UNIT_PRICE_ITEM_MC_SP', 
                  Error_message(), 
                   Getdate() ) 
  END catch; 

			update #tempWebImportTestingReport 
			SET TARGET_RECORD_COUNT = (SELECT COUNT(1) FROM  CR_UNIT_PRICE_ITEM_MC );

			INSERT INTO CL_WEBIMPORT_LOG_T(IMPORT_TYPE,SOURCE_RECORD_COUNT,TARGET_RECORD_COUNT,
			INSERT_RECORD_COUNT,UPDATE_RECORD_COUNT,IMPORT_DATE)

			SELECT IMPORT_TYPE,SOURCE_RECORD_COUNT,TARGET_RECORD_COUNT ,INSERT_RECORD_COUNT,
			UPDATE_RECORD_COUNT,getutcdate() FROM #tempWebImportTestingReport ;






GO
/****** Object:  StoredProcedure [dbo].[IMPORT_EC_REVENUE_HISTORY_MC_SP]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[IMPORT_EC_REVENUE_HISTORY_MC_SP]
	-- Add the parameters for the stored procedure here
AS
BEGIN TRY
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.

	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;


	IF object_id('tempdb..#temp_Rev_fleetmaster') IS NOT NULL
		DROP TABLE #temp_Rev_fleetmaster

	SELECT *
		INTO #temp_Rev_fleetmaster
		FROM openquery([SIGMA], '
		SELECT distinct rtrim(ltrim(Company_Code)) as Company_Code
			,rtrim(ltrim(Equipment_Code)) as Equipment_Code
			,rtrim(ltrim(Transaction_Date)) as Transaction_Date
			,rtrim(ltrim(Job_Number)) as Job_Number
			,rtrim(ltrim(Equipment_Company_Code_2))  as Equipment_Company_Code_2
			,rtrim(ltrim(System_Key)) as System_Key
		FROM [WebImport].[dbo].[EC_REVENUE_HISTORY_MC] 
		WHERE transaction_date > 20180128 and company_code <> ''088'' ' );

	MERGE [dbo].[EC_REVENUE_HISTORY_MC] AS Target
	USING #temp_Rev_fleetmaster AS source
		ON rtrim(ltrim(target.Equipment_Company_Code_2)) = rtrim(ltrim(source.Equipment_Company_Code_2))
			AND rtrim(ltrim(target.EQUIPMENT_CODE)) = rtrim(ltrim(source.EQUIPMENT_CODE))
			AND rtrim(ltrim(target.System_Key)) = rtrim(ltrim(source.System_Key))
			AND rtrim(ltrim(target.Transaction_Date)) = rtrim(ltrim(source.Transaction_Date))
	WHEN MATCHED
		THEN
			UPDATE
			SET  
			     Target.Company_Code = Source.Company_Code,
				 Target.EQUIPMENT_CODE = Source.EQUIPMENT_CODE,
	           	 Target.Transaction_Date = Source.Transaction_Date,
	             Target.Job_Number = Source.Job_Number,
				 Target.Equipment_Company_Code_2 = Source.Equipment_Company_Code_2,
	             Target.System_Key = Source.System_Key
				 
	WHEN NOT MATCHED BY TARGET
		THEN
			INSERT (
			    COMPANY_CODE,
				EQUIPMENT_CODE,
				Transaction_Date,
				Job_Number,
				Equipment_Company_Code_2,
				System_Key
				)
			VALUES (
				Source.Company_Code
				,Source.Equipment_Code
				,Source.Transaction_Date
				,Source.Job_Number
				,Source.Equipment_Company_Code_2
				,Source.System_Key
			);
				
		INSERT INTO jobsuccessfaillog 
                  (successfail, 
                   error_severity, 
                   error_line, 
                   procedurename, 
                   error_message, 
                   timestamp) 
		VALUES    ('Success', 
                  '', 
                  '', 
                  'IMPORT_EC_REVENUE_HISTORY_MC_SP', 
                  '', 
                  Getdate() ) 
  END try 
  BEGIN catch 

      INSERT INTO jobsuccessfaillog 
                  (successfail, 
                   error_severity, 
                   error_line, 
                   procedurename, 
                   error_message, 
                   timestamp) 
      VALUES     ('Fail', 
                  Error_severity(), 
                  Error_line(), 
                  'IMPORT_EC_REVENUE_HISTORY_MC_SP', 
                  Error_message(), 
                  Getdate() ) 
  END catch; 
		  

GO
/****** Object:  StoredProcedure [dbo].[IMPORT_JOB_UNION_CODES_SP]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

 

CREATE PROCEDURE [dbo].[IMPORT_JOB_UNION_CODES_SP]

-- exec IMPORT_JOB_UNION_CODES_SP

AS



	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;


BEGIN Try
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	IF object_id('tempdb..#tempWebImportTestingReport') IS NOT NULL
		DROP TABLE #tempWebImportTestingReport

    CREATE TABLE #tempWebImportTestingReport
			(Import_type nvarchar(50),
			SOURCE_Record_Count int,
			Target_Record_Count int,
			Update_Record_Count int, 
			Insert_Record_Count int)

   insert into #tempWebImportTestingReport(Import_Type) values('Job Union Codes Import')

	IF object_id('tempdb..#tempunioncodemaster') IS NOT NULL
		DROP TABLE #tempunioncodemaster
		
	SELECT Distinct
		rtrim(ltrim(JMT.Company_Code)) as Company_Code,
		rtrim(ltrim(JMT.Job_Number)) as Job_Number, 
		rtrim(ltrim(JMT.Contract_Number)) as Contract_Number, 
		rtrim(ltrim(Union_Code)) as Union_Code
	Into #tempunioncodemaster
	from sigma.WebImport.dbo.[JC_JOB_WAGE_CODE_MC] wage
	inner join sigma.WebImport.dbo.[JC_JOB_MASTER_MC] JMT on 
		right(wage.Job_Number, 4) = right(JMT.job_number,4)
	where
		jmt.company_code <> '088'

--select * from #tempunioncodemaster
   update #tempWebImportTestingReport 
   set 
		SOURCE_RECORD_COUNT = (SELECT COUNT(1) FROM  #tempunioncodemaster )

	MERGE [dbo].[CL_SPECIAL_PROJECTS_UNION_CODES_T] AS Target
	USING #tempunioncodemaster AS SOURCE
		ON rtrim(ltrim(target.Contract_Number)) = rtrim(ltrim(SOURCE.Contract_Number))
		AND rtrim(ltrim(target.job_number)) = rtrim(ltrim(SOURCE.job_number))
		AND rtrim(ltrim(target.UNION_CODE)) = rtrim(ltrim(SOURCE.UNION_CODE))
		--AND UPPER(RTRIM(LTRIM(target.SOURCE))) = 'WEBIMPORT'
	WHEN MATCHED
		THEN
			UPDATE
			SET Target.CONTRACT_NUMBER = SOURCE.CONTRACT_NUMBER
				,Target.JOB_NUMBER = SOURCE.JOB_NUMBER
				,TARGET.UNION_CODE = SOURCE.UNION_CODE
				,Target.LAST_UPDATE =  getUtcDate()
				,Target.CREATED_BY =  'update'
				,Target.ISACTIVE = 1
		WHEN NOT MATCHED BY TARGET
		THEN
			INSERT (
				CONTRACT_NUMBER,
				JOB_NUMBER,
				UNION_CODE,
				CREATED_ON ,
				CREATED_BY,
				ISACTIVE,
				SOURCE
				)
			VALUES (
			  SOURCE.CONTRACT_NUMBER,
			  SOURCE.JOB_NUMBER,
			  SOURCE.UNION_CODE,
			  getutcdate(),
			  'insert', 
			  1,
			  'WebImport');

			INSERT INTO jobsuccessfaillog 
                  (successfail, 
                   error_severity, 
                   error_line, 
                   procedurename, 
                   error_message, 
                   timestamp) 
			 VALUES (
				'Success', 
                  '', 
                  '', 
                  'IMPORT_JOB_UNION_CODES_SP', 
                  '', 
                   Getdate()) 
  END try 

  BEGIN catch

      INSERT INTO jobsuccessfaillog 
                  (successfail, 
                   error_severity, 
                   error_line, 
                   procedurename, 
                   error_message, 
                   timestamp) 
      VALUES     ('Fail', 
                  Error_severity(), 
                  Error_line(), 
                  'IMPORT_JOB_UNION_CODES_SP', 
                  Error_message(), 
                   Getdate() ) 
  END catch; 

	update #tempWebImportTestingReport 
	SET 
		TARGET_RECORD_COUNT = (SELECT COUNT(1) FROM  dbo.CL_SPECIAL_PROJECTS_UNION_CODES_T );

	UPDATE #tempwebimporttestingreport 
	SET    
		insert_record_count = (SELECT Count(1) 
									FROM   dbo.CL_SPECIAL_PROJECTS_UNION_CODES_T 
									WHERE  created_by = 'insert'); 

	UPDATE #tempwebimporttestingreport 
	SET    
		update_record_count = (SELECT Count(1) 
									FROM   dbo.CL_SPECIAL_PROJECTS_UNION_CODES_T 
									WHERE  created_by = 'update');

	INSERT INTO CL_WEBIMPORT_LOG_T
	(IMPORT_TYPE,SOURCE_RECORD_COUNT,TARGET_RECORD_COUNT, INSERT_RECORD_COUNT,UPDATE_RECORD_COUNT,IMPORT_DATE)
	SELECT 
		IMPORT_TYPE
		, SOURCE_RECORD_COUNT
		, TARGET_RECORD_COUNT 
		, INSERT_RECORD_COUNT
		, UPDATE_RECORD_COUNT
		, getutcdate() 
	FROM #tempWebImportTestingReport ;

 
GO
/****** Object:  StoredProcedure [dbo].[IMPORT_WI_CONTRACT_HEADER_SP]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[IMPORT_WI_CONTRACT_HEADER_SP]
	-- Add the parameters for the stored procedure here
AS


	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;


  BEGIN try 
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	IF object_id('tempdb..#tempWebImportTestingReport') IS NOT NULL
		DROP TABLE #tempWebImportTestingReport

    CREATE TABLE #tempWebImportTestingReport
   (Import_type nvarchar(50),Source_Record_Count int,
   Target_Record_Count int,Update_Record_Count int, Insert_Record_Count int)

   insert into #tempWebImportTestingReport(Import_Type) values('Company Import')


	IF object_id('tempdb..#tempcontractcustomer') IS NOT NULL
		DROP TABLE #tempcontractcustomer

	SELECT rtrim(ltrim(up.Company_Code)) AS Company_Code
			,rtrim(ltrim(up.Customer_Code)) AS Customer_Code
			,(select rtrim(ltrim(js.Contract_Number))  AS Contract_Number
			from Sigma.WebImport.dbo.JC_JOB_MASTER_MC js 
				where rtrim(ltrim(js.Job_Number)) = rtrim(ltrim(up.Job_Number))
				and rtrim(ltrim(js.Company_Code)) = rtrim(ltrim(up.Company_Code))
				and rtrim(ltrim(js.Status_Code)) = 'A') AS Contract_Number
	INTO #tempcontractcustomer
	FROM Sigma.WebImport.dbo.CR_CONTRACT_MASTER_MC up
	WHERE rtrim(ltrim(up.Job_Number)) in (select rtrim(ltrim(js2.Job_Number))
			from Sigma.WebImport.dbo.JC_JOB_MASTER_MC js2 
			where rtrim(ltrim(js2.Job_Number)) = rtrim(ltrim(up.Job_Number))
				and rtrim(ltrim(js2.Company_Code)) = rtrim(ltrim(up.Company_Code))
				and rtrim(ltrim(js2.Status_Code))  = 'A') and up.company_code <> '088' 


    IF object_id('tempdb..#tempcompanycontract') IS NOT NULL
		DROP TABLE #tempcompanycontract
				
				SELECT * 
				into #tempcompanycontract
				from #tempcontractcustomer as WebImportData
                WHERE WebImportData.Contract_Number in (select  c.Contract_Number
					from [dbo].WI_PAYITEM_MASTER_T c 
					where c.deleted < 0
					and c.CONTRACT_NUMBER = WebImportData.Contract_Number
					and c.COMPANY_CODE = WebImportData.Company_Code)
					AND WebImportData.company_code in (select rtrim(ltrim(b.companycode ))
							from [dbo].[CL_Q_BASES] b
							where b.deleted_by < 0
							  and rtrim(ltrim(b.companycode)) = WebImportData.Company_Code)
			    GROUP BY WebImportData.Company_Code, WebImportData.Customer_Code, WebImportData.Contract_Number

	update #tempWebImportTestingReport set SOURCE_RECORD_COUNT = (SELECT COUNT(DISTINCT COMPANY_CODE)
	 FROM #TEMPCOMPANYCONTRACT )

	

	/*Insert into WI_COMPANY_MASTER_T from WEBIMPORT DB */
	INSERT INTO [dbo].[WI_COMPANY_MASTER_T]
	(COMPANY_CODE,CREATE_DATE,LAST_UPDATE,CREATED,DELETED,CREATED_BY,DELETED_BY)
	SELECT DISTINCT COMPANY_CODE,getutcdate(),
			   getutcdate(),
			   0,
			  -1,
			  'insert',
			  'n/a'
			  FROM #TEMPCOMPANYCONTRACT AS SOURCE
	WHERE NOT EXISTS (SELECT 1 FROM [dbo].[WI_COMPANY_MASTER_T] AS TARGET 
	WHERE SOURCE.Company_Code = TARGET.COMPANY_CODE );

	
	 update #tempWebImportTestingReport set TARGET_RECORD_COUNT = (SELECT COUNT(DISTINCT COMPANY_CODE)
	 FROM [dbo].[WI_COMPANY_MASTER_T] )

	 update #tempWebImportTestingReport 
	 SET INSERT_RECORD_COUNT = (SELECT COUNT(1) FROM  dbo.WI_COMPANY_MASTER_T 
	 WHERE CREATED_BY='insert');

	 update #tempWebImportTestingReport 
	 SET UPDATE_RECORD_COUNT = (SELECT COUNT(1) FROM  dbo.WI_COMPANY_MASTER_T 
	 WHERE CREATED_BY='update');

	 
	INSERT INTO dbo.CL_WEBIMPORT_LOG_T(IMPORT_TYPE,SOURCE_RECORD_COUNT,TARGET_RECORD_COUNT,
	INSERT_RECORD_COUNT,UPDATE_RECORD_COUNT,IMPORT_DATE)
	SELECT IMPORT_TYPE,SOURCE_RECORD_COUNT,TARGET_RECORD_COUNT ,INSERT_RECORD_COUNT,
	UPDATE_RECORD_COUNT,getutcdate() FROM #tempWebImportTestingReport ;

	
	
	DELETE FROM #tempWebImportTestingReport ;
	/*Insert into WI_CONTRACT_MASTER_T from WEBIMPORT DB */

	insert into #tempWebImportTestingReport(Import_Type) values('Contract Import')

	update #tempWebImportTestingReport set SOURCE_RECORD_COUNT = (SELECT COUNT(DISTINCT CONTRACT_NUMBER)
	 FROM #TEMPCOMPANYCONTRACT )

	INSERT INTO [dbo].[WI_CONTRACT_MASTER_T]
	(CONTRACT_NUMBER,WI_COMPANY_ID,CREATE_DATE,LAST_UPDATE,CREATED,DELETED,CREATED_BY,DELETED_BY)
	SELECT DISTINCT SOURCE1.Contract_Number, SOURCE2.WI_COMPANY_ID,
	getutcdate(),getutcdate(), 0,-1,'insert','n/a'
	 FROM #TEMPCOMPANYCONTRACT AS SOURCE1,
	 [dbo].[WI_COMPANY_MASTER_T] AS SOURCE2
	 	WHERE 
		SOURCE1.Company_Code = SOURCE2.COMPANY_CODE AND 
	NOT EXISTS ( SELECT 1 FROM [dbo].[WI_CONTRACT_MASTER_T] AS TARGET 
	WHERE SOURCE2.WI_COMPANY_ID = TARGET.WI_COMPANY_ID 
	AND SOURCE1.Contract_Number = TARGET.CONTRACT_NUMBER
	);

	update #tempWebImportTestingReport set TARGET_RECORD_COUNT = (SELECT COUNT(DISTINCT CONTRACT_NUMBER)
	 FROM [dbo].[WI_CONTRACT_MASTER_T] )

	 update #tempWebImportTestingReport 
	 SET INSERT_RECORD_COUNT = (SELECT COUNT(DISTINCT CONTRACT_NUMBER) FROM  dbo.WI_CONTRACT_MASTER_T 
	 WHERE CREATED_BY='insert');

	 update #tempWebImportTestingReport 
	 SET UPDATE_RECORD_COUNT = (SELECT COUNT(CONTRACT_NUMBER) FROM  dbo.WI_CONTRACT_MASTER_T 
	 WHERE CREATED_BY='update');

	 INSERT INTO dbo.CL_WEBIMPORT_LOG_T(IMPORT_TYPE,SOURCE_RECORD_COUNT,TARGET_RECORD_COUNT,
	INSERT_RECORD_COUNT,UPDATE_RECORD_COUNT,IMPORT_DATE)
	SELECT IMPORT_TYPE,SOURCE_RECORD_COUNT,TARGET_RECORD_COUNT ,INSERT_RECORD_COUNT,
	UPDATE_RECORD_COUNT,getutcdate() FROM #tempWebImportTestingReport ;

	/*SELECT * FROM WI_CONTRACT_MASTER_T ORDER BY WI_COMPANY_ID */

	/**CUSTOMER MASTER IMPORT */
	
	DELETE FROM #tempWebImportTestingReport ;


	/*Insert into WI_CUSTOMER_MASTER_T from WEBIMPORT DB */
	insert into #tempWebImportTestingReport(Import_Type) values('Customer Import')

	update #tempWebImportTestingReport set SOURCE_RECORD_COUNT = (SELECT COUNT(DISTINCT CUSTOMER_CODE)
	 FROM #TEMPCOMPANYCONTRACT )

	

	INSERT INTO [dbo].[WI_CUSTOMER_MASTER_T]
	(WI_COMPANY_ID,WI_CONTRACT_ID,CUSTOMER_CODE,NAME,CREATE_DATE,LAST_UPDATE,CREATED,DELETED,CREATED_BY,DELETED_BY)
	SELECT DISTINCT SOURCE2.WI_COMPANY_ID, SOURCE2.WI_CONTRACT_ID,
	SOURCE1.CUSTOMER_CODE,SOURCE1.CUSTOMER_CODE,
	getutcdate(),getutcdate(), 0,-1,'insert','n/a'
	 FROM #TEMPCOMPANYCONTRACT AS SOURCE1,
	[dbo].[WI_CONTRACT_MASTER_T] AS SOURCE2,
	[dbo].[WI_COMPANY_MASTER_T] AS SOURCE3
	WHERE SOURCE1.COMPANY_CODE = SOURCE3.COMPANY_CODE AND 
	SOURCE3.WI_COMPANY_ID = SOURCE2.WI_COMPANY_ID AND
	SOURCE1.CONTRACT_NUMBER = SOURCE2.CONTRACT_NUMBER AND
	NOT EXISTS ( SELECT 1 FROM [dbo].[WI_CUSTOMER_MASTER_T] AS TARGET 
	WHERE SOURCE2.WI_COMPANY_ID = TARGET.WI_COMPANY_ID 
	AND SOURCE2.WI_CONTRACT_ID = TARGET.WI_CONTRACT_ID
	AND SOURCE1.Customer_Code = TARGET.CUSTOMER_CODE
	);

	 INSERT INTO jobsuccessfaillog 
                  (successfail, 
                   error_severity, 
                   error_line, 
                   procedurename, 
                   error_message, 
                   timestamp) 
      VALUES     ('Success', 
                  '', 
                  '', 
                  'IMPORT_WI_CONTRACT_HEADER_SP', 
                  '', 
                  Getdate() ) 
  END try 
   BEGIN catch 

      INSERT INTO jobsuccessfaillog 
                  (successfail, 
                   error_severity, 
                   error_line, 
                   procedurename, 
                   error_message, 
                   timestamp) 
      VALUES     ('Fail', 
                  Error_severity(), 
                  Error_line(), 
                  'IMPORT_WI_CONTRACT_HEADER_SP', 
                  Error_message(), 
                  Getdate() ) 
  END catch; 

	update #tempWebImportTestingReport set TARGET_RECORD_COUNT = (SELECT COUNT(DISTINCT CUSTOMER_CODE)
	 FROM [dbo].[WI_CUSTOMER_MASTER_T] )

	 update #tempWebImportTestingReport 
	 SET INSERT_RECORD_COUNT = (SELECT COUNT(DISTINCT CUSTOMER_CODE) FROM  dbo.WI_CUSTOMER_MASTER_T 
	 WHERE CREATED_BY='insert');

	 update #tempWebImportTestingReport 
	 SET UPDATE_RECORD_COUNT = (SELECT COUNT(DISTINCT CUSTOMER_CODE) FROM  dbo.WI_CUSTOMER_MASTER_T 
	 WHERE CREATED_BY='update');

	INSERT INTO dbo.CL_WEBIMPORT_LOG_T(IMPORT_TYPE,SOURCE_RECORD_COUNT,TARGET_RECORD_COUNT,
	INSERT_RECORD_COUNT,UPDATE_RECORD_COUNT,IMPORT_DATE)
	SELECT IMPORT_TYPE,SOURCE_RECORD_COUNT,TARGET_RECORD_COUNT ,INSERT_RECORD_COUNT,
	UPDATE_RECORD_COUNT,getutcdate() FROM #tempWebImportTestingReport ;
		




GO
/****** Object:  StoredProcedure [dbo].[IMPORT_WI_DEPARTMENT_SP]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[IMPORT_WI_DEPARTMENT_SP]
	-- Add the parameters for the stored procedure here
AS
BEGIN Try
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.

	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;



	IF object_id('tempdb..#tempWebImportTestingReport') IS NOT NULL
		DROP TABLE #tempWebImportTestingReport

    CREATE TABLE #tempWebImportTestingReport
   (Import_type nvarchar(50),SOURCE_Record_Count int,
   Target_Record_Count int,Update_Record_Count int, Insert_Record_Count int)

   insert into #tempWebImportTestingReport(Import_Type) values('Department Import')


	IF object_id('tempdb..#tempdepartmentmaster') IS NOT NULL
		DROP TABLE #tempdepartmentmaster
						
	  SELECT RTRIM(LTRIM([Company_Code])) AS COMPANY_CODE
		  ,RTRIM(LTRIM([Department_Code])) AS DEPARTMENT_CODE 
		  ,RTRIM(LTRIM([Description])) AS DESCRIPTION
		  ,RTRIM(LTRIM([Department_GL_List1])) AS Department_GL_List1
		  ,RTRIM(LTRIM([Department_GL_List2])) AS Department_GL_List2
		  ,RTRIM(LTRIM([Department_GL_List3])) AS Department_GL_List3
		  ,RTRIM(LTRIM([Department_GL_List4])) AS Department_GL_List4
		  ,RTRIM(LTRIM([Department_GL_List5])) AS Department_GL_List5
		  ,RTRIM(LTRIM([Department_GL_List6])) AS Department_GL_List6
		  ,RTRIM(LTRIM([Department_GL_List7])) AS Department_GL_List7
		  ,RTRIM(LTRIM([Department_GL_List8])) AS Department_GL_List8
		  ,RTRIM(LTRIM([Department_GL_List9])) AS Department_GL_List9
		  ,RTRIM(LTRIM([Department_GL_List10])) AS Department_GL_List10
		  ,RTRIM(LTRIM([Department_GL_List11])) AS Department_GL_List11
		  ,RTRIM(LTRIM([Department_GL_List12])) AS Department_GL_List12
		  ,RTRIM(LTRIM([Department_GL_List13])) AS Department_GL_List13
		  ,RTRIM(LTRIM([LI_GL_Expense])) AS LI_GL_Expense
		  ,RTRIM(LTRIM([Direct_Cost_Flag])) AS Direct_Cost_Flag
		  ,RTRIM(LTRIM([Other_Earn_1])) AS Other_Earn_1
		  ,RTRIM(LTRIM([Other_Earn_2])) AS Other_Earn_2
		  ,RTRIM(LTRIM([Other_Earn_3])) AS Other_Earn_3
		  ,RTRIM(LTRIM([Vacation_Direct_Cost_Flag])) AS Vacation_Direct_Cost_Flag
		  ,RTRIM(LTRIM([Holiday_Direct_Cost_Flag])) AS Holiday_Direct_Cost_Flag
		  ,RTRIM(LTRIM([Sick_Expense_Direct_Flag])) AS Sick_Expense_Direct_Flag
		  ,RTRIM(LTRIM([Meal_Expense_Direct_Flag])) AS Meal_Expense_Direct_Flag
		  ,RTRIM(LTRIM([OH_Payable_GL])) AS OH_Payable_GL
		  ,RTRIM(LTRIM([OH_GL_Account])) AS OH_GL_Account
		  ,RTRIM(LTRIM([Fringe_GL_Expense_List])) AS Fringe_GL_Expense_List
		  ,RTRIM(LTRIM([Work_SDI_GL_Account])) AS Work_SDI_GL_Account
		  ,RTRIM(LTRIM([Retro_GL_Account])) AS Retro_GL_Account
		  ,RTRIM(LTRIM([Retro_Direct_Flag])) AS Retro_Direct_Flag
		  ,RTRIM(LTRIM([Burden_Payable_GL])) AS Burden_Payable_GL
		  ,RTRIM(LTRIM([Burden_Expense_GL])) AS Burden_Expense_GL
		  ,RTRIM(LTRIM([Equipment_Expense_GL])) AS Equipment_Expense_GL
		  ,RTRIM(LTRIM([Equipment_Expense_Flag])) AS Equipment_Expense_Flag
		  ,RTRIM(LTRIM([County_Unemploy_GL_Expense])) AS County_Unemploy_GL_Expense
		  ,RTRIM(LTRIM([Local_Unemployment_Expense_GL])) AS Local_Unemployment_Expense_GL
		  ,RTRIM(LTRIM([County_Disability_GL_Expense])) AS County_Disability_GL_Expense
		  ,RTRIM(LTRIM([Local_Disability_GL_Expense])) AS Local_Disability_GL_Expense
		  ,RTRIM(LTRIM([Worker_Comp_Expense_GL])) AS worker_Comp_Expense_GL
		  ,RTRIM(LTRIM([Default_Worker_Comp_Code])) AS Default_Worker_Comp_Code
		  ,RTRIM(LTRIM([JX_GL_Debit_Account])) AS JX_GL_Debit_Account
		  ,RTRIM(LTRIM([JX_GL_Credit_Account])) AS JX_GL_Credit_Account
		  ,RTRIM(LTRIM([Vacation_Accrual_Debit])) AS Vacation_Accrual_Debit
		  ,RTRIM(LTRIM([Vacation_Accrual_Credit])) AS Vacation_Accrual_Credit
		  ,RTRIM(LTRIM([Holiday_Accrual_Debit])) AS Holiday_Accrual_Debit
		  ,RTRIM(LTRIM([Holiday_Accrual_Credit])) AS Holiday_Accrual_Credit
		  ,RTRIM(LTRIM([Sick_Pay_Accrual_Debit])) AS Sick_Pay_Accrual_Debit
		  ,RTRIM(LTRIM([Sick_Pay_Accrual_Credit])) AS Sick_Pay_Accrual_Credit
		INTO #tempdepartmentmaster
		from Sigma.WebImport.dbo.PR_DEPARTMENT_MC where company_code <> '088'
  

   update #tempWebImportTestingReport set
    SOURCE_RECORD_COUNT = (SELECT COUNT(1) FROM  #tempdepartmentmaster )
   
	MERGE [dbo].[WI_DEPARTMENT_MASTER_T] AS Target
	USING #tempdepartmentmaster AS SOURCE
		ON rtrim(ltrim(target.Company_Code)) = rtrim(ltrim(SOURCE.Company_Code))
			AND rtrim(ltrim(target.department_code)) = rtrim(ltrim(SOURCE.department_code))
	WHEN MATCHED
		THEN
			UPDATE
			SET 
			      TARGET.Description = SOURCE.Description,
				  TARGET.Department_GL_List1 = SOURCE.Department_GL_List1,
				  TARGET.Department_GL_List2 = SOURCE.Department_GL_List2,
				  TARGET.Department_GL_List3 = SOURCE.Department_GL_List3,
				  TARGET.Department_GL_List4 = SOURCE.Department_GL_List4,
				  TARGET.Department_GL_List5 = SOURCE.Department_GL_List5,
				  TARGET.Department_GL_List6 = SOURCE.Department_GL_List6,
				  TARGET.Department_GL_List7 = SOURCE.Department_GL_List7,
				  TARGET.Department_GL_List8 = SOURCE.Department_GL_List8,
				  TARGET.Department_GL_List9 = SOURCE.Department_GL_List9,
				  TARGET.Department_GL_List10 = SOURCE.Department_GL_List10,
				  TARGET.Department_GL_List11 = SOURCE.Department_GL_List11,
				  TARGET.Department_GL_List12 = SOURCE.Department_GL_List12,
				  TARGET.Department_GL_List13 = SOURCE.Department_GL_List13,
				  TARGET.LI_GL_Expense = SOURCE.LI_GL_Expense,
				  TARGET.Direct_Cost_Flag = SOURCE.Direct_Cost_Flag,
				  TARGET.Other_Earn_1 = SOURCE.Other_Earn_1,
				  TARGET.Other_Earn_2 = SOURCE.Other_Earn_2,
				  TARGET.Other_Earn_3 = SOURCE.Other_Earn_3,
				  TARGET.Vacation_Direct_Cost_Flag = SOURCE.Vacation_Direct_Cost_Flag,
				  TARGET.Holiday_Direct_Cost_Flag = SOURCE.Holiday_Direct_Cost_Flag,
				  TARGET.Sick_Expense_Direct_Flag = SOURCE.Sick_Expense_Direct_Flag,
				  TARGET.Meal_Expense_Direct_Flag = SOURCE.Meal_Expense_Direct_Flag,
				  TARGET.OH_Payable_GL = SOURCE.OH_Payable_GL,
				  TARGET.OH_GL_Account = SOURCE.OH_GL_Account,
				  TARGET.Fringe_GL_Expense_List = SOURCE.Fringe_GL_Expense_List,
				  TARGET.Work_SDI_GL_Account = SOURCE.Work_SDI_GL_Account,
				  TARGET.Retro_GL_Account = SOURCE.Retro_GL_Account,
				  TARGET.Retro_Direct_Flag = SOURCE.Retro_Direct_Flag,
				  TARGET.Burden_Payable_GL = SOURCE.Burden_Payable_GL,
				  TARGET.Burden_Expense_GL = SOURCE.Burden_Expense_GL,
				  TARGET.Equipment_Expense_GL = SOURCE.Equipment_Expense_GL,
				  TARGET.Equipment_Expense_Flag = SOURCE.Equipment_Expense_Flag,
				  TARGET.County_Unemploy_GL_Expense = SOURCE.County_Unemploy_GL_Expense,
				  TARGET.Local_Unemployment_Expense_GL = SOURCE.Local_Unemployment_Expense_GL,
				  TARGET.County_Disability_GL_Expense = SOURCE.County_Disability_GL_Expense,
				  TARGET.Local_Disability_GL_Expense = SOURCE.Local_Disability_GL_Expense,
				  TARGET.Worker_Comp_Expense_GL = SOURCE.Worker_Comp_Expense_GL,
				  TARGET.Default_Worker_Comp_Code = SOURCE.Default_Worker_Comp_Code,
				  TARGET.JX_GL_Debit_Account = SOURCE.JX_GL_Debit_Account,
				  TARGET.JX_GL_Credit_Account = SOURCE.JX_GL_Credit_Account,
				  TARGET.Vacation_Accrual_Debit = SOURCE.Vacation_Accrual_Debit,
				  TARGET.Vacation_Accrual_Credit = SOURCE.Vacation_Accrual_Credit,
				  TARGET.Holiday_Accrual_Debit = SOURCE.Holiday_Accrual_Debit,
				  TARGET.Holiday_Accrual_Credit = SOURCE.Holiday_Accrual_Credit,
				  TARGET.Sick_Pay_Accrual_Debit = SOURCE.Sick_Pay_Accrual_Debit,
				  TARGET.Sick_Pay_Accrual_Credit = SOURCE.Sick_Pay_Accrual_Credit,
				  TARGET.LAST_UPDATE =  getUtcDate(),
				  TARGET.CREATED_BY = 'update'
			WHEN NOT MATCHED BY TARGET
		THEN
			INSERT (
				   Company_Code
				  ,Department_Code
				  ,Description
				  ,Department_GL_List1
				  ,Department_GL_List2
				  ,Department_GL_List3
				  ,Department_GL_List4
				  ,Department_GL_List5
				  ,Department_GL_List6
				  ,Department_GL_List7
				  ,Department_GL_List8
				  ,Department_GL_List9
				  ,Department_GL_List10
				  ,Department_GL_List11
				  ,Department_GL_List12
				  ,Department_GL_List13
				  ,LI_GL_Expense
				  ,Direct_Cost_Flag
				  ,Other_Earn_1
				  ,Other_Earn_2
				  ,Other_Earn_3
				  ,Vacation_Direct_Cost_Flag
				  ,Holiday_Direct_Cost_Flag
				  ,Sick_Expense_Direct_Flag
				  ,Meal_Expense_Direct_Flag
				  ,OH_Payable_GL
				  ,OH_GL_Account
				  ,Fringe_GL_Expense_List
				  ,Work_SDI_GL_Account
				  ,Retro_GL_Account
				  ,Retro_Direct_Flag
				  ,Burden_Payable_GL
				  ,Burden_Expense_GL
				  ,Equipment_Expense_GL
				  ,Equipment_Expense_Flag
				  ,County_Unemploy_GL_Expense
				  ,Local_Unemployment_Expense_GL
				  ,County_Disability_GL_Expense
				  ,Local_Disability_GL_Expense
				  ,Worker_Comp_Expense_GL
				  ,Default_Worker_Comp_Code
				  ,JX_GL_Debit_Account
				  ,JX_GL_Credit_Account
				  ,Vacation_Accrual_Debit
				  ,Vacation_Accrual_Credit
				  ,Holiday_Accrual_Debit
				  ,Holiday_Accrual_Credit
				  ,Sick_Pay_Accrual_Debit
				  ,Sick_Pay_Accrual_Credit,
				  	CREATE_DATE ,
					LAST_UPDATE ,
					CREATED ,
					DELETED ,
					CREATED_BY ,
					DELETED_BY			
				)
			VALUES (
			   SOURCE.Company_Code
			  ,SOURCE.Department_Code
			  ,SOURCE.Description
			  ,SOURCE.Department_GL_List1
			  ,SOURCE.Department_GL_List2
			  ,SOURCE.Department_GL_List3
			  ,SOURCE.Department_GL_List4
			  ,SOURCE.Department_GL_List5
			  ,SOURCE.Department_GL_List6
			  ,SOURCE.Department_GL_List7
			  ,SOURCE.Department_GL_List8
			  ,SOURCE.Department_GL_List9
			  ,SOURCE.Department_GL_List10
			  ,SOURCE.Department_GL_List11
			  ,SOURCE.Department_GL_List12
			  ,SOURCE.Department_GL_List13
			  ,SOURCE.LI_GL_Expense
			  ,SOURCE.Direct_Cost_Flag
			  ,SOURCE.Other_Earn_1
			  ,SOURCE.Other_Earn_2
			  ,SOURCE.Other_Earn_3
			  ,SOURCE.Vacation_Direct_Cost_Flag
			  ,SOURCE.Holiday_Direct_Cost_Flag
			  ,SOURCE.Sick_Expense_Direct_Flag
			  ,SOURCE.Meal_Expense_Direct_Flag
			  ,SOURCE.OH_Payable_GL
			  ,SOURCE.OH_GL_Account
			  ,SOURCE.Fringe_GL_Expense_List
			  ,SOURCE.Work_SDI_GL_Account
			  ,SOURCE.Retro_GL_Account
			  ,SOURCE.Retro_Direct_Flag
			  ,SOURCE.Burden_Payable_GL
			  ,SOURCE.Burden_Expense_GL
			  ,SOURCE.Equipment_Expense_GL
			  ,SOURCE.Equipment_Expense_Flag
			  ,SOURCE.County_Unemploy_GL_Expense
			  ,SOURCE.Local_Unemployment_Expense_GL
			  ,SOURCE.County_Disability_GL_Expense
			  ,SOURCE.Local_Disability_GL_Expense
			  ,SOURCE.Worker_Comp_Expense_GL
			  ,SOURCE.Default_Worker_Comp_Code
			  ,SOURCE.JX_GL_Debit_Account
			  ,SOURCE.JX_GL_Credit_Account
			  ,SOURCE.Vacation_Accrual_Debit
			  ,SOURCE.Vacation_Accrual_Credit
			  ,SOURCE.Holiday_Accrual_Debit
			  ,SOURCE.Holiday_Accrual_Credit
			  ,SOURCE.Sick_Pay_Accrual_Debit
			  ,SOURCE.Sick_Pay_Accrual_Credit,
			  getutcdate(),
			  getutcdate(), 
			  0,
			  -1,
			  'insert',
			  'n/a'
			  
			);

			 INSERT INTO jobsuccessfaillog 
                  (successfail, 
                   error_severity, 
                   error_line, 
                   procedurename, 
                   error_message, 
                   timestamp) 
      VALUES     ('Success', 
                  '', 
                  '', 
                  'IMPORT_WI_DEPARTMENT_SP', 
                  '', 
                   Getdate() ) 
  END try 
   BEGIN catch 

      INSERT INTO jobsuccessfaillog 
                  (successfail, 
                   error_severity, 
                   error_line, 
                   procedurename, 
                   error_message, 
                   timestamp) 
      VALUES     ('Fail', 
                  Error_severity(), 
                  Error_line(), 
                  'IMPORT_WI_DEPARTMENT_SP', 
                  Error_message(), 
                   Getdate() ) 
  END catch; 
			update #tempWebImportTestingReport 
			SET TARGET_RECORD_COUNT = (SELECT COUNT(1) FROM  WI_DEPARTMENT_MASTER_T );

			update #tempWebImportTestingReport 
			SET INSERT_RECORD_COUNT = (SELECT COUNT(1) FROM  WI_DEPARTMENT_MASTER_T 
			 WHERE CREATED_BY='insert');

			update #tempWebImportTestingReport 
			SET UPDATE_RECORD_COUNT = (SELECT COUNT(1) FROM  WI_DEPARTMENT_MASTER_T 
			 WHERE CREATED_BY='update');

			INSERT INTO CL_WEBIMPORT_LOG_T(IMPORT_TYPE,SOURCE_RECORD_COUNT,TARGET_RECORD_COUNT,
			INSERT_RECORD_COUNT,UPDATE_RECORD_COUNT,IMPORT_DATE)
			SELECT IMPORT_TYPE,SOURCE_RECORD_COUNT,TARGET_RECORD_COUNT ,INSERT_RECORD_COUNT,
			UPDATE_RECORD_COUNT,getutcdate() FROM #tempWebImportTestingReport ;
			



GO
/****** Object:  StoredProcedure [dbo].[IMPORT_WI_EMPLOYEE_MASTER_SP]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

 
CREATE PROCEDURE [dbo].[IMPORT_WI_EMPLOYEE_MASTER_SP] 
-- Add the parameters for the stored procedure here 
AS 
  BEGIN try 
      -- SET NOCOUNT ON added to prevent extra result sets from 
      -- interfering with SELECT statements. 

	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;


      IF Object_id('tempdb..#tempWebImportTestingReport') IS NOT NULL 
        DROP TABLE #tempwebimporttestingreport 

      CREATE TABLE #tempwebimporttestingreport 
        ( 
           import_type         NVARCHAR(50), 
           source_record_count INT, 
           target_record_count INT, 
           update_record_count INT, 
           insert_record_count INT 
        ) 

      INSERT INTO #tempwebimporttestingreport 
                  (import_type) 
      VALUES     ('Employee Import') 

      IF Object_id('tempdb..#temp_empmaster') IS NOT NULL 
        DROP TABLE #temp_empmaster 


	  SELECT distinct rtrim(ltrim(a.Company_Code)) as Company_Code, rtrim(ltrim(a.Employee_Code)) as Employee_Code, 
	  rtrim(ltrim(a.Employee_Name)) as Employee_Name, rtrim(ltrim(a.Street_Address)) as Street_Address, rtrim(ltrim(a.Address)) as Address, 
	  rtrim(ltrim(a.State)) as State, rtrim(ltrim(a.Zip_Code)) as Zip_Code, rtrim(ltrim(a.Title)) as Title, rtrim(ltrim(a.Employment_Status)) as Employment_Status, 
	  rtrim(ltrim(a.Department_Code)) as Department_Code, rtrim(ltrim(a.effective_date)) as Effective_Date, rtrim(ltrim(a.Pay_Rate_Code)) as Pay_Rate_Code, 
	  rtrim(ltrim(a.Union_Code)) as Union_Code, rtrim(ltrim(a.Pay_Type)) as Pay_Type, rtrim(ltrim(b.Employee_Location)) as Employee_Location 
	  INTO   #temp_empmaster 
	  FROM Sigma.[WebImport].[dbo].[PR_EMPLOYEE_MASTER_1_MC]  as a
	  INNER JOIN Sigma.[WebImport].[dbo].[PR_EMPLOYEE_MASTER_3_MC] AS b ON a.Company_Code = b.Company_Code AND a.Employee_Code = b.Employee_Code
	  --Left JOIN Sigma.[WebImport].[dbo].[x_vw_emp_user_defined_master] as c on c.Employee_Code = a.Employee_Code AND c.Prompt = 'LICENSE TYPE '
	  where a.company_code <> '088'

--select * from #temp_empmaster

      UPDATE #tempwebimporttestingreport 
      SET    source_record_count = (SELECT Count(1) 
                                    FROM   #temp_empmaster) 
 BEGIN
      MERGE [dbo].[wi_employee_master_t] AS Target 
      using #temp_empmaster AS source 
      ON Rtrim(Ltrim(target.company_code)) = Rtrim(Ltrim(source.company_code)) 
         AND Rtrim(Ltrim(target.employee_id)) = Rtrim(Ltrim(source.employee_code)) 
      WHEN matched THEN 
        UPDATE SET Target.employee_name = Source.employee_name, 
                   Target.street_address = Source.street_address, 
                   Target.address = Source.address, 
                   Target.state = Source.state, 
                   Target.zip = Source.zip_code, 
                   Target.title = Source.title, 
                   Target.status = Source.employment_status, 
                   Target.department_code = Source.department_code, 
                   Target.effective_date = Source.effective_date, 
                   Target.pay_rate_code = Source.pay_rate_code, 
                   Target.union_code = Source.union_code, 
                   Target.pay_type = Source.pay_type, 
                   Target.last_update = Getutcdate(), 
                   Target.created_by = 'update',
				   Target.employee_location = Source.employee_location
      WHEN NOT matched BY target THEN 
        INSERT ( employee_id, 
                 employee_name, 
                 company_code, 
                 street_address, 
                 address, 
                 state, 
                 zip, 
                 title, 
                 status, 
                 department_code, 
                 effective_date, 
                 pay_rate_code, 
                 union_code, 
                 pay_type, 
                 create_date, 
                 last_update, 
                 created, 
                 deleted, 
                 created_by, 
                 deleted_by,
				 employee_location) 
        VALUES ( Source.employee_code, 
                 Source.employee_name, 
                 Source.company_code, 
                 Source.street_address, 
                 Source.address, 
                 Source.state, 
                 Source.zip_code, 
                 Source.title, 
                 Source.employment_status, 
                 Source.department_code, 
                 Source.effective_date, 
                 Source.pay_rate_code, 
                 Source.union_code, 
                 Source.pay_type, 
                 Getutcdate(), 
                 Getutcdate(), 
                 0, 
                 -1, 
                 'insert', 
                 'n/a',
				 Source.employee_location); 
 END
      INSERT INTO jobsuccessfaillog 
                  (successfail, 
                   error_severity, 
                   error_line, 
                   procedurename, 
                   error_message, 
                   timestamp) 
      VALUES     ('Success', 
                  '', 
                  '', 
                  'IMPORT_WI_EMPLOYEE_MASTER_SP', 
                  '', 
                   Getdate() ) 
  END try 

  BEGIN catch 

      INSERT INTO jobsuccessfaillog 
                  (successfail, 
                   error_severity, 
                   error_line, 
                   procedurename, 
                   error_message, 
                   timestamp) 
      VALUES     ('Fail', 
                  Error_severity(), 
                  Error_line(), 
                  'IMPORT_WI_EMPLOYEE_MASTER_SP', 
                  Error_message(), 
                  Getdate() ) 
  END catch; 

    UPDATE #tempwebimporttestingreport 
    SET    target_record_count = (SELECT Count(1) 
                                  FROM   dbo.wi_employee_master_t); 

    UPDATE #tempwebimporttestingreport 
    SET    insert_record_count = (SELECT Count(1) 
                                  FROM   dbo.wi_employee_master_t 
                                  WHERE  created_by = 'insert'); 

    UPDATE #tempwebimporttestingreport 
    SET    update_record_count = (SELECT Count(1) 
                                  FROM   dbo.wi_employee_master_t 
                                  WHERE  created_by = 'update'); 

    INSERT INTO dbo.cl_webimport_log_t 
                (import_type, 
                 source_record_count, 
                 target_record_count, 
                 insert_record_count, 
                 update_record_count, 
                 import_date) 
    SELECT import_type, 
           source_record_count, 
           target_record_count, 
           insert_record_count, 
           update_record_count, 
           Getutcdate() 
    FROM   #tempwebimporttestingreport; 

 
GO
/****** Object:  StoredProcedure [dbo].[IMPORT_WI_FLEET_MASTER_SP]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[IMPORT_WI_FLEET_MASTER_SP]
	-- Add the parameters for the stored procedure here
AS
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.

	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

BEGIN Try

	IF object_id('tempdb..#tempWebImportTestingReport') IS NOT NULL
		DROP TABLE #tempWebImportTestingReport

    CREATE TABLE #tempWebImportTestingReport
   (Import_type nvarchar(50),Source_Record_Count int,
   Target_Record_Count int,Update_Record_Count int, Insert_Record_Count int)

   insert into #tempWebImportTestingReport(Import_Type) values('Fleet Import')

   
	IF object_id('tempdb..#temp_fleetmaster') IS NOT NULL
		DROP TABLE #temp_fleetmaster

	
	   SELECT rtrim(ltrim(Company_Code)) as Company_code
      ,rtrim(ltrim(Equipment_Code)) as Equipment_Code
      ,rtrim(ltrim(Equipment_Type)) as Equipment_type
      ,rtrim(ltrim(Description)) as Description
      ,rtrim(ltrim(Year))  as Year
      ,rtrim(ltrim(Equipment_Make)) as Equipment_make
      ,rtrim(ltrim(Equipment_Model)) as Equipment_model
      ,rtrim(ltrim(License_Number)) as License_number
      ,rtrim(ltrim(Meter_Type)) as Meter_Type
      ,rtrim(ltrim(Equipment_Status)) as Equipment_Status
      ,rtrim(ltrim(Division_Code)) as Division_Code
      ,Equipment_Retired   
	  ,Rate_Per_Hour
	  ,Last_Meter    
		INTO #temp_fleetmaster
   FROM Sigma.[WebImport].[dbo].[EC_EQUIPMENT_MASTER_MC] 
   WHERE EQUIPMENT_STATUS IN (SELECT EQUIPMENT_STATUS
  FROM Sigma.[WebImport].[dbo].[EC_EQUIPMENT_STATUS_MC] ) and company_code <> '088'

   update #tempWebImportTestingReport set SOURCE_RECORD_COUNT = (SELECT COUNT(1) FROM  #temp_fleetmaster )

	MERGE [dbo].[WI_FLEET_MASTER_T] AS Target
	USING #temp_fleetmaster AS source
		ON rtrim(ltrim(target.Company_Code)) = rtrim(ltrim(source.company_code))
			AND rtrim(ltrim(target.EQUIPMENT_CODE)) = rtrim(ltrim(source.EQUIPMENT_CODE))
	WHEN MATCHED
		THEN
			UPDATE
			SET  /*Target.WI_COMPANY_ID = Source.Company_ID,*/
			     Target.COMPANY_CODE = Source.COMPANY_CODE,
				 Target.EQUIPMENT_CODE = Source.EQUIPMENT_CODE,
	           	 Target.EQUIPMENT_TYPE = Source.EQUIPMENT_TYPE,
	             Target.EQUIPMENT_DESCRIPTION = Source.DESCRIPTION,
	             Target.YEAR = Source.YEAR,
				 Target.MAKE = Source.EQUIPMENT_MAKE,
	             Target.MODEL = Source.EQUIPMENT_MODEL,
	             Target.LICENSE_NUMBER = Source.LICENSE_NUMBER,
	             Target.METER_TYPE = Source.METER_TYPE,
	             Target.EQUIPMENT_STATUS = Source.EQUIPMENT_STATUS,
	             Target.DIVISION_CODE = Source.DIVISION_CODE,
	             Target.EQUIPMENT_RETIRED = Source.EQUIPMENT_RETIRED ,
				 Target.RATE_PER_HOUR = Source.RATE_PER_HOUR,
				 Target.Last_Meter = Source.Last_Meter,
				 Target.LAST_UPDATE =  getUtcDate(),
				 Target.CREATED_BY = 'update'
				 
	WHEN NOT MATCHED BY TARGET
		THEN
			INSERT (
			    COMPANY_CODE,
				/*WI_COMPANY_ID,*/
				EQUIPMENT_CODE,
				EQUIPMENT_TYPE,
				EQUIPMENT_DESCRIPTION,
				YEAR,
				MAKE,
				MODEL,
				LICENSE_NUMBER,
				METER_TYPE,
				EQUIPMENT_STATUS,
				DIVISION_CODE,
				EQUIPMENT_RETIRED,
				RATE_PER_HOUR,
				Last_Meter,
				CREATE_DATE ,
				LAST_UPDATE ,
				CREATED ,
				DELETED ,
				CREATED_BY ,
				DELETED_BY
				)
			VALUES (
			Source.Company_Code
			/*,Source.Company_ID*/
		   ,Source.Equipment_Code
		   ,Source.Equipment_Type
           ,Source.Description
           ,Source.Year
           ,Source.Equipment_Make
           ,Source.Equipment_Model
           ,Source.License_Number
           ,Source.Meter_Type
           ,Source.Equipment_Status
           ,Source.Division_Code
           ,Source.Equipment_Retired
		   ,Source.Rate_Per_Hour  
		   ,Source.Last_Meter
		   ,getutcdate()
		   ,getutcdate()
		   ,0
		   ,-1
		   ,'insert'
		   ,'n/a'
	      )
				
		;

		 INSERT INTO jobsuccessfaillog 
                  (successfail, 
                   error_severity, 
                   error_line, 
                   procedurename, 
                   error_message, 
                   timestamp) 
      VALUES     ('Success', 
                  '', 
                  '', 
                  'IMPORT_WI_FLEET_MASTER_SP', 
                  '', 
                   Getdate() ) 
  END try 
   BEGIN catch 

      INSERT INTO jobsuccessfaillog 
                  (successfail, 
                   error_severity, 
                   error_line, 
                   procedurename, 
                   error_message, 
                   timestamp) 
      VALUES     ('Fail', 
                  Error_severity(), 
                  Error_line(), 
                  'IMPORT_WI_FLEET_MASTER_SP', 
                  Error_message(), 
                   Getdate() ) 
  END catch; 
		   update #tempWebImportTestingReport 
			SET TARGET_RECORD_COUNT = (SELECT COUNT(1) FROM  dbo.WI_FLEET_MASTER_T );

			update #tempWebImportTestingReport 
			SET INSERT_RECORD_COUNT = (SELECT COUNT(1) FROM  dbo.WI_FLEET_MASTER_T 
			 WHERE CREATED_BY='insert');

			update #tempWebImportTestingReport 
			SET UPDATE_RECORD_COUNT = (SELECT COUNT(1) FROM  dbo.WI_FLEET_MASTER_T 
			 WHERE CREATED_BY='update');

			INSERT INTO dbo.CL_WEBIMPORT_LOG_T(IMPORT_TYPE,SOURCE_RECORD_COUNT,TARGET_RECORD_COUNT,
			INSERT_RECORD_COUNT,UPDATE_RECORD_COUNT,IMPORT_DATE)
			SELECT IMPORT_TYPE,SOURCE_RECORD_COUNT,TARGET_RECORD_COUNT ,INSERT_RECORD_COUNT,
			UPDATE_RECORD_COUNT,getutcdate() FROM #tempWebImportTestingReport ;




GO
/****** Object:  StoredProcedure [dbo].[IMPORT_WI_GLACC_MASTER_SP]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[IMPORT_WI_GLACC_MASTER_SP]
	-- Add the parameters for the stored procedure here
AS


	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;


BEGIN Try
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;


	IF object_id('tempdb..#tempWebImportTestingReport') IS NOT NULL
		DROP TABLE #tempWebImportTestingReport

    CREATE TABLE #tempWebImportTestingReport
   (Import_type nvarchar(50),SOURCE_Record_Count int,
   Target_Record_Count int,Update_Record_Count int, Insert_Record_Count int)

   insert into #tempWebImportTestingReport(Import_Type) values('GL Import')


	IF object_id('tempdb..#tempglmaster') IS NOT NULL
		DROP TABLE #tempglmaster

	SELECT
		   rtrim(ltrim(Company_Code)) as Company_Code,
		   rtrim(ltrim(Gl_Account)) as Gl_Account ,
		   rtrim(ltrim(Description)) as Description
		  ,rtrim(ltrim(Short_Description)) as Short_Description
		  ,rtrim(ltrim(Account_Type_Code)) as Account_Type_Code
		  ,rtrim(ltrim(Post_AP_Detail_Flag)) as Post_AP_Detail_Flag
		  ,rtrim(ltrim(Direct_Cost_Flag)) as Direct_Cost_Flag
		  ,rtrim(ltrim(Cost_Type)) as Cost_Type
		  ,rtrim(ltrim(Status)) as Status
		  ,rtrim(ltrim(All_Cost_Centers)) as All_Cost_Centers  
	INTO #tempglmaster 
	from Sigma.WebImport.dbo.gl_master_mc where company_code <> '088'
	and company_code in (select rtrim(ltrim(b.companycode))
			from [dbo].[CL_Q_BASES] b
			where b.deleted_by < 0
		    and rtrim(ltrim(b.companycode)) = Company_Code)

   update #tempWebImportTestingReport set SOURCE_RECORD_COUNT = (SELECT COUNT(1) FROM  #tempglmaster )

	MERGE [dbo].[WI_GL_MASTER_T] AS Target
	USING #tempGLmaster AS SOURCE
		ON rtrim(ltrim(target.Company_Code)) = rtrim(ltrim(SOURCE.Company_Code))
			AND rtrim(ltrim(target.GL_Account)) = rtrim(ltrim(SOURCE.GL_Account))
	WHEN MATCHED
		THEN
			UPDATE
			SET    TARGET.Description = SOURCE.Description
				  ,TARGET.Short_Description = SOURCE.Short_Description
				  ,TARGET.Account_Type_Code = SOURCE.Account_Type_Code
				  ,TARGET.Post_AP_Detail_Flag = SOURCE.Post_AP_Detail_Flag
				  ,TARGET.Direct_Cost_Flag = SOURCE.Direct_Cost_Flag
				  ,TARGET.Cost_Type = SOURCE.Cost_Type
				  ,TARGET.Status = SOURCE.Status
				  ,TARGET.All_Cost_Centers = SOURCE.All_Cost_Centers
				  ,TARGET.LAST_UPDATE =  getUtcDate()
				  ,TARGET.CREATED_BY = 'update'
			WHEN NOT MATCHED BY TARGET
		THEN
			INSERT (
				Company_Code
			   ,GL_Account
			   ,Description
			   ,Short_Description
			   ,Account_Type_Code
			   ,Post_AP_Detail_Flag
			   ,Direct_Cost_Flag
			   ,Cost_Type
			   ,Status
			   ,All_Cost_Centers,
			    CREATE_DATE ,
				LAST_UPDATE ,
				CREATED ,
				DELETED ,
				CREATED_BY ,
				DELETED_BY
			   )
			   Values (
			    Source.Company_Code
			   ,Source.GL_Account
			   ,Source.Description
			   ,Source.Short_Description
			   ,Source.Account_Type_Code
			   ,Source.Post_AP_Detail_Flag
			   ,Source.Direct_Cost_Flag
			   ,Source.Cost_Type
			   ,Source.Status
			   ,Source.All_Cost_Centers,
			    getutcdate(),
			    getutcdate(), 
			    0,
			    -1,
			   'insert',
			    'n/a'
			    
			);

			 INSERT INTO jobsuccessfaillog 
                  (successfail, 
                   error_severity, 
                   error_line, 
                   procedurename, 
                   error_message, 
                   timestamp) 
      VALUES     ('Success', 
                  '', 
                  '', 
                  'IMPORT_WI_GLACC_MASTER_SP', 
                  '', 
                   Getdate() ) 
  END try 
   BEGIN catch 

      INSERT INTO jobsuccessfaillog 
                  (successfail, 
                   error_severity, 
                   error_line, 
                   procedurename, 
                   error_message, 
                   timestamp) 
      VALUES     ('Fail', 
                  Error_severity(), 
                  Error_line(), 
                  'IMPORT_WI_GLACC_MASTER_SP', 
                  Error_message(), 
                   Getdate() ) 
  END catch; 
			update #tempWebImportTestingReport 
			SET TARGET_RECORD_COUNT = (SELECT COUNT(1) FROM  WI_GL_MASTER_T );

			update #tempWebImportTestingReport 
			SET INSERT_RECORD_COUNT = (SELECT COUNT(1) FROM  WI_GL_MASTER_T 
			 WHERE CREATED_BY='insert');

			update #tempWebImportTestingReport 
			SET UPDATE_RECORD_COUNT = (SELECT COUNT(1) FROM  WI_GL_MASTER_T 
			 WHERE CREATED_BY='update');

			INSERT INTO CL_WEBIMPORT_LOG_T(IMPORT_TYPE,SOURCE_RECORD_COUNT,TARGET_RECORD_COUNT,
			INSERT_RECORD_COUNT,UPDATE_RECORD_COUNT,IMPORT_DATE)
			SELECT IMPORT_TYPE,SOURCE_RECORD_COUNT,TARGET_RECORD_COUNT ,INSERT_RECORD_COUNT,
			UPDATE_RECORD_COUNT,getutcdate() FROM #tempWebImportTestingReport ;




GO
/****** Object:  StoredProcedure [dbo].[IMPORT_WI_JOB_MASTER_SP]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[IMPORT_WI_JOB_MASTER_SP]
	-- Add the parameters for the stored procedure here
AS
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.

	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

BEGIN Try


	IF object_id('tempdb..#tempWebImportTestingReport') IS NOT NULL
		DROP TABLE #tempWebImportTestingReport

    CREATE TABLE #tempWebImportTestingReport
   (Import_type nvarchar(50),SOURCE_Record_Count int,
   Target_Record_Count int,Update_Record_Count int, Insert_Record_Count int)

   insert into #tempWebImportTestingReport(Import_Type) values('Job Import')


	IF object_id('tempdb..#tempjobmaster') IS NOT NULL
		DROP TABLE #tempjobmaster
		
	       SELECT
		   rtrim(ltrim(Company_Code)) as Company_Code,
		   rtrim(ltrim(Job_Number)) as Job_Number, 
		   rtrim(ltrim(Division)) as Division,
           rtrim(ltrim(Job_Description)) as Job_Description, 
           rtrim(ltrim(Address_1)) as Address_1, 
           rtrim(ltrim(Address_2)) as Address_2, 
           rtrim(ltrim(City)) as City, 
           rtrim(ltrim(State)) as State,
           rtrim(ltrim(Zip_Code)) as Zip_Code, 
           rtrim(ltrim(Project_Manager)) as Superintendent, 
           rtrim(ltrim(Contract_Number)) as Contract_Number, 
           rtrim(ltrim(Status_Code)) as Status_Code, 
           rtrim(ltrim(OH_Cost_Type)) as OH_Cost_Type,
           rtrim(ltrim(Customer_Code)) as Customer_Code, 
		   rtrim(ltrim(Job_Type)) as Job_Type, 
           rtrim(ltrim(Project_Manager)) as Project_Manager, 
           rtrim(ltrim(Certified_Flag)) as Certified_Flag  
		   INTO #tempjobmaster
   from Sigma.WebImport.dbo.JC_JOB_MASTER_MC WHERE  company_code <> '088'
  

   update #tempWebImportTestingReport set SOURCE_RECORD_COUNT = (SELECT COUNT(1) FROM  #tempjobmaster )

	MERGE [dbo].[WI_JOB_MASTER_T] AS Target
	USING #tempjobmaster AS SOURCE
		ON rtrim(ltrim(target.Company_Code)) = rtrim(ltrim(SOURCE.Company_Code))
			AND rtrim(ltrim(target.job_number)) = rtrim(ltrim(SOURCE.job_number))
			AND UPPER(RTRIM(LTRIM(target.SOURCE))) ='WEBIMPORT'
		--	AND rtrim(ltrim(target.Superintendent)) = rtrim(ltrim(SOURCE.Superintendent)) /*Added on 22Nov2016 for Manually assign the extra Superintendents Usually they are not actually Superintendents, but people like PE's that approve for Superintendents*/
	WHEN MATCHED
		THEN
			UPDATE
			SET Target.JOB_DESCRIPTION= SOURCE.JOB_DESCRIPTION   
			    ,Target.DIVISION= SOURCE.DIVISION
				,Target.CUSTOMER_CODE= SOURCE.CUSTOMER_CODE
				,Target.CONTRACT_NUMBER = SOURCE.CONTRACT_NUMBER
				,Target.Project_Manager = SOURCE.SUPERINTENDENT
				,TARGET.STATUS = SOURCE.STATUS_CODE
				,TARGET.STATUS_CODE = SOURCE.STATUS_CODE
				,Target.ADDRESS_1 = SOURCE.ADDRESS_1
				,Target.ADDRESS_2 = SOURCE.ADDRESS_2
				,Target.CITY = SOURCE.CITY
				,Target.STATE = SOURCE.STATE
				,Target.ZIP_CODE = SOURCE.ZIP_CODE
				,Target.OH_COST_TYPE = SOURCE.OH_COST_TYPE
				,Target.JOB_TYPE = SOURCE.JOB_TYPE
				,Target.CERTIFIED_FLAG = SOURCE.CERTIFIED_FLAG
				,Target.LAST_UPDATE =  getUtcDate()
				,Target.CREATED_BY = 'update'
			WHEN NOT MATCHED BY TARGET
		THEN
			INSERT (
				JOB_NUMBER,
				JOB_DESCRIPTION,
			    COMPANY_CODE,
				CUSTOMER_CODE,
				CONTRACT_NUMBER,
				DIVISION,
				SUPERINTENDENT,
				STATUS,
				STATUS_CODE,
				ADDRESS_1,
				ADDRESS_2,
				CITY,
				STATE,
				ZIP_CODE,
				OH_COST_TYPE,
				JOB_TYPE,
				CERTIFIED_FLAG,
				CREATE_DATE ,
				LAST_UPDATE ,
				CREATED ,
				DELETED ,
				CREATED_BY ,
				DELETED_BY,
				SOURCE
				)
			VALUES (
			  SOURCE.JOB_NUMBER,
			  SOURCE.JOB_DESCRIPTION,
			  SOURCE.COMPANY_CODE,
			  SOURCE.CUSTOMER_CODE,
			  SOURCE.CONTRACT_NUMBER,
			  SOURCE.DIVISION,
			  SOURCE.SUPERINTENDENT,
			   Source.status_code,
			  'N',
			  SOURCE.ADDRESS_1,
			  SOURCE.ADDRESS_2,
			  SOURCE.CITY,
			  SOURCE.STATE,
			  SOURCE.ZIP_CODE,
			  SOURCE.OH_COST_TYPE,
			  SOURCE.JOB_TYPE,
			  SOURCE.CERTIFIED_FLAG,
			  getutcdate(),
			  getutcdate(), 
			  0,
			  -1,
			  'insert',
			  'n/a',
			  'WebImport'
			);
 INSERT INTO jobsuccessfaillog 
                  (successfail, 
                   error_severity, 
                   error_line, 
                   procedurename, 
                   error_message, 
                   timestamp) 
      VALUES     ('Success', 
                  '', 
                  '', 
                  'IMPORT_WI_JOB_MASTER_SP', 
                  '', 
                   Getdate() ) 
  END try 
   BEGIN catch 

      INSERT INTO jobsuccessfaillog 
                  (successfail, 
                   error_severity, 
                   error_line, 
                   procedurename, 
                   error_message, 
                   timestamp) 
      VALUES     ('Fail', 
                  Error_severity(), 
                  Error_line(), 
                  'IMPORT_WI_JOB_MASTER_SP', 
                  Error_message(), 
                   Getdate() ) 
  END catch; 

			update #tempWebImportTestingReport 
			SET TARGET_RECORD_COUNT = (SELECT COUNT(1) FROM  WI_JOB_MASTER_T );

			update #tempWebImportTestingReport 
			SET INSERT_RECORD_COUNT = (SELECT COUNT(1) FROM  WI_JOB_MASTER_T 
			 WHERE CREATED_BY='insert');

			update #tempWebImportTestingReport 
			SET UPDATE_RECORD_COUNT = (SELECT COUNT(1) FROM  WI_JOB_MASTER_T 
			 WHERE CREATED_BY='update');

			INSERT INTO CL_WEBIMPORT_LOG_T(IMPORT_TYPE,SOURCE_RECORD_COUNT,TARGET_RECORD_COUNT,
			INSERT_RECORD_COUNT,UPDATE_RECORD_COUNT,IMPORT_DATE)
			SELECT IMPORT_TYPE,SOURCE_RECORD_COUNT,TARGET_RECORD_COUNT ,INSERT_RECORD_COUNT,
			UPDATE_RECORD_COUNT,getutcdate() FROM #tempWebImportTestingReport ;






GO
/****** Object:  StoredProcedure [dbo].[IMPORT_WI_PAYITEM_MASTER_SP]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[IMPORT_WI_PAYITEM_MASTER_SP]

	-- Add the parameters for the stored procedure here
AS
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	
	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

BEGIN Try


	IF object_id('tempdb..#tempWebImportTestingReport') IS NOT NULL
		DROP TABLE #tempWebImportTestingReport

    CREATE TABLE #tempWebImportTestingReport
   (Import_type nvarchar(50),Source_Record_Count int,
   Target_Record_Count int,Update_Record_Count int, Insert_Record_Count int)

   insert into #tempWebImportTestingReport(Import_Type) values('Payitem Import')

	IF object_id('tempdb..#tempunitpriceitem') IS NOT NULL
		DROP TABLE #tempunitpriceitem

	SELECT *
	INTO #tempunitpriceitem
	FROM openquery([Sigma], '
    SELECT rtrim(ltrim(up.Company_Code)) AS Company_Code
	,rtrim(ltrim(up.Bill_Item_Code)) AS Bill_Item_Code
	/*,'''' AS Unit_Of_Measure*/
	,(select rtrim(ltrim(js.Contract_Number)) 
					from WebImport.dbo.JC_JOB_MASTER_MC js 
						where rtrim(ltrim(js.Job_Number)) = rtrim(ltrim(up.Job_Number))
						and rtrim(ltrim(js.Company_Code)) = rtrim(ltrim(up.Company_Code))
					and rtrim(ltrim(js.Status_Code)) = ''A'') AS Contract_Number
	FROM WebImport.dbo.CR_UNIT_PRICE_ITEM_MC up
	WHERE rtrim(ltrim(up.Job_Number)) in (select rtrim(ltrim(js2.Job_Number))
			from WebImport.dbo.JC_JOB_MASTER_MC js2 
			where rtrim(ltrim(js2.Job_Number)) = rtrim(ltrim(up.Job_Number))
			and rtrim(ltrim(js2.Company_Code)) = rtrim(ltrim(up.Company_Code))
			and rtrim(ltrim(js2.Status_Code)) = ''A'') 
   ') AS WebImportData
    WHERE  
		WebImportData.company_code in (select rtrim(ltrim(b.companycode))
			from [dbo].[CL_Q_BASES] b
			where b.deleted_by < 0
							  and rtrim(ltrim(b.companycode)) = WebImportData.Company_Code)
					GROUP BY WebImportData.Company_Code, WebImportData.Contract_Number, WebImportData.Bill_Item_Code
					
			
			IF object_id('tempdb..#tempcontractpayitems') IS NOT NULL
		        DROP TABLE #tempcontractpayitems

			select
					    distinct c1.companycode as company_code,c1.contractid as contract_number,
						c1.payitem as payitem,c1.wbscode as wbscode,c1.tier1code as tier1code
						,c1.tier1description as tier1description,c1.tier2code as tier2code,
						c1.tier2description as tier2description,
						c1.tier3code as tier3code, 
						c1.tier3description as tier3description,
						c1.tier4code as tier4code, 
						c1.tier4description as tier4description,
						c1.tier5code as tier5code, 
						c1.tier5description as tier5description,
						c1.phasecode as phasecode,c1.uom as uom,c1.description as description, 
						c1.deleted_by as deleted_by,
						concat(c1.tier1description,' ',c1.tier2description,' ',c1.tier3description) as wbs_description,
						c1.includeinbillingexport,
						c1.inactiveflag
						into #tempcontractpayitems
						from 
						dbo.CL_Q_CONTRACTPAYITEMS  c1 inner join  #tempunitpriceitem c2
						ON c1.deleted_by<0
					    and c1.CONTRACTID = c2.Contract_Number
				        and c1.PAYITEM = c2.BILL_ITEM_CODE
					    and c1.COMPANYCODE= c2.Company_Code
				

update #tempWebImportTestingReport set SOURCE_RECORD_COUNT = (SELECT COUNT(1) FROM  #tempcontractpayitems )

	MERGE [dbo].[WI_PAYITEM_MASTER_T] AS Target
	USING #tempcontractpayitems AS source
		ON rtrim(ltrim(target.Company_Code)) = source.company_code
			AND rtrim(ltrim(target.[Contract_Number])) = source.Contract_Number
			AND rtrim(ltrim(target.payitem)) = source.payitem
	WHEN NOT MATCHED BY TARGET
		THEN
		INSERT 
						(
						company_code,contract_number,payitem,wbs_code,tier1_code,tier1_description,
						tier2_code,tier2_description, tier3_code, tier3_description,
						/*tier4_code, tier4_description,
						tier5_code, tier5_description,*/
						phase_code,uom,description,create_date,last_update,created,deleted,created_by,deleted_by
						,wbs_description,includeinbillingexport,inactiveflag
						)
						values( company_code,contract_number,payitem,wbscode,tier1code,tier1description,tier2code,
						tier2description,tier3code, tier3description,
						/*tier4code, tier4description,
						tier5code, tier5description,*/
						phasecode,uom,description,
						getutcdate(),getutcdate(),0,deleted_by,'loader','n/a'
						,wbs_description,includeinbillingexport,inactiveflag);
					   
 INSERT INTO jobsuccessfaillog 
                  (successfail, 
                   error_severity, 
                   error_line, 
                   procedurename, 
                   error_message, 
                   timestamp) 
      VALUES     ('Success', 
                  '', 
                  '', 
                  'IMPORT_WI_EMPLOYEE_MASTER_SP', 
                  '', 
                  Getutcdate() ) 
  END try 
   BEGIN catch 

      INSERT INTO jobsuccessfaillog 
                  (successfail, 
                   error_severity, 
                   error_line, 
                   procedurename, 
                   error_message, 
                   timestamp) 
      VALUES     ('Fail', 
                  Error_severity(), 
                  Error_line(), 
                  'IMPORT_WI_EMPLOYEE_MASTER_SP', 
                  Error_message(), 
                  Getutcdate() ) 
  END catch; 
			update #tempWebImportTestingReport set TARGET_RECORD_COUNT = (SELECT COUNT(1) FROM WI_PAYITEM_MASTER_T )
			
			INSERT INTO dbo.CL_WEBIMPORT_LOG_T(IMPORT_TYPE,SOURCE_RECORD_COUNT,TARGET_RECORD_COUNT,
			INSERT_RECORD_COUNT,UPDATE_RECORD_COUNT,IMPORT_DATE)
			SELECT IMPORT_TYPE,SOURCE_RECORD_COUNT,TARGET_RECORD_COUNT ,INSERT_RECORD_COUNT,
			UPDATE_RECORD_COUNT,getutcdate() FROM #tempWebImportTestingReport ;



GO
/****** Object:  StoredProcedure [dbo].[IMPORT_WI_RATE_INFORMATION_MASTER_SP]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

 

CREATE PROCEDURE [dbo].[IMPORT_WI_RATE_INFORMATION_MASTER_SP]

	-- Add the parameters for the stored procedure here
AS

	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

  BEGIN try 

      IF Object_id('tempdb..#tempWebImportTestingReport') IS NOT NULL 
        DROP TABLE #tempwebimporttestingreport 

      CREATE TABLE #tempwebimporttestingreport 
        ( 
           import_type         NVARCHAR(50), 
           source_record_count INT, 
           target_record_count INT, 
           update_record_count INT, 
           insert_record_count INT 
        ) 

      INSERT INTO #tempwebimporttestingreport 
                  (import_type) 
      VALUES     ('Rates Import') 

      IF Object_id('tempdb..#temp_ratesmaster') IS NOT NULL 
        DROP TABLE #temp_ratesmaster 

SELECT PR_EMP_USER_FIELDS_DET_MC.Company_Code,
		   PR_EMP_USER_FIELDS_DET_MC.Employee_Code, 
		   PR_EMP_USER_FIELDS_DET_MC.User_Def_Sequence, 
		   PA_USER_FIELDS_SETUP_U_MC.Amount_Prompt, 
		   PR_EMP_USER_FIELDS_DET_MC.Amount_Field
INTO #temp_ratesmaster
FROM Sigma.[WebImport].[dbo].PA_USER_FIELDS_SETUP_U_MC 
		INNER JOIN Sigma.[WebImport].[dbo].PR_EMP_USER_FIELDS_DET_MC ON PA_USER_FIELDS_SETUP_U_MC.User_Def_Sequence = PR_EMP_USER_FIELDS_DET_MC.User_Def_Sequence
	WHERE (PR_EMP_USER_FIELDS_DET_MC.User_Def_Sequence IN ('000237', '000196', '000249', '000268')) 
		--AND (PR_EMP_USER_FIELDS_DET_MC.Company_Code IN (''111'', ''500'', ''555'', ''600'', ''779''))')

--select * from #temp_ratesmaster where User_Def_Sequence = '000249'
      UPDATE #tempwebimporttestingreport 
      SET source_record_count = (SELECT Count(1) FROM #temp_ratesmaster) 
BEGIN
      MERGE [dbo].[wi_employee_master_t] AS Target 
      using #temp_ratesmaster AS source 
      ON Rtrim(Ltrim(target.company_code)) = Rtrim(Ltrim(source.company_code)) 
         AND Rtrim(Ltrim(target.employee_id)) = Rtrim(Ltrim(source.employee_code))
		 AND Rtrim(Ltrim(source.User_Def_Sequence)) = '000196'
		 AND Rtrim(Ltrim(source.Amount_Prompt)) = 'PDM RATE'
      WHEN matched
	  THEN 
        UPDATE SET Target.PERDIEM_RATE = Source.Amount_Field; 
      
	  MERGE [dbo].[wi_employee_master_t] AS Target 
      using #temp_ratesmaster AS source 
      ON Rtrim(Ltrim(target.company_code)) = Rtrim(Ltrim(source.company_code)) 
         AND Rtrim(Ltrim(target.employee_id)) = Rtrim(Ltrim(source.employee_code))
		 AND Rtrim(Ltrim(source.User_Def_Sequence)) = '000237'
		 AND Rtrim(Ltrim(source.Amount_Prompt)) = 'RIG PAY RATE'
	  WHEN matched
	  THEN 
        UPDATE SET Target.RIG_PAY_RATE = Source.Amount_Field;
		
	  MERGE [dbo].[wi_employee_master_t] AS Target 
      using #temp_ratesmaster AS source 
      ON Rtrim(Ltrim(target.company_code)) = Rtrim(Ltrim(source.company_code)) 
         AND Rtrim(Ltrim(target.employee_id)) = Rtrim(Ltrim(source.employee_code))
		 AND Rtrim(Ltrim(source.User_Def_Sequence)) = '000249'
		 AND Rtrim(Ltrim(source.Amount_Prompt)) = 'TRUCK RATE'
      WHEN matched		
	  THEN 
        UPDATE SET Target.TRUCK_RATE = Source.Amount_Field; 

	  MERGE [dbo].[wi_employee_master_t] AS Target 
		using #temp_ratesmaster AS source 
		ON Rtrim(Ltrim(target.company_code)) = Rtrim(Ltrim(source.company_code)) 
			AND Rtrim(Ltrim(target.employee_id)) = Rtrim(Ltrim(source.employee_code))
			AND Rtrim(Ltrim(source.User_Def_Sequence)) = '000268'
		WHEN matched		
		THEN 
		UPDATE SET Target.WAIT_TIME_RATE = Source.Amount_Field; 
END
      INSERT INTO jobsuccessfaillog 
                  (successfail, 
                   error_severity, 
                   error_line, 
                   procedurename, 
                   error_message, 
                   timestamp) 
      VALUES     ('Success', 
                  '', 
                  '', 
                  'IMPORT_WI_RATE_INFORMATION_MASTER_SP', 
                  '', 
                   Getdate() ) 
  END try 

  BEGIN catch 

      INSERT INTO jobsuccessfaillog 
                  (successfail, 
                   error_severity, 
                   error_line, 
                   procedurename, 
                   error_message, 
                   timestamp) 
      VALUES     ('Fail', 
                  Error_severity(), 
                  Error_line(), 
                  'IMPORT_WI_RATE_INFORMATION_MASTER_SP', 
                  Error_message(), 
                  Getdate() ) 
  END catch; 

    UPDATE #tempwebimporttestingreport 
    SET    target_record_count = (SELECT Count(1) 
                                  FROM   dbo.wi_employee_master_t); 

    UPDATE #tempwebimporttestingreport 
    SET    insert_record_count = (SELECT Count(1) 
                                  FROM   dbo.wi_employee_master_t 
                                  WHERE  created_by = 'insert'); 

    UPDATE #tempwebimporttestingreport 
    SET    update_record_count = (SELECT Count(1) 
                                  FROM   dbo.wi_employee_master_t 
                                  WHERE  created_by = 'update'); 

    INSERT INTO dbo.cl_webimport_log_t 
                (import_type, 
                 source_record_count, 
                 target_record_count, 
                 insert_record_count, 
                 update_record_count, 
                 import_date) 
    SELECT import_type, 
           source_record_count, 
           target_record_count, 
           insert_record_count, 
           update_record_count, 
           Getutcdate() 
    FROM   #tempwebimporttestingreport; 
 
GO
/****** Object:  StoredProcedure [dbo].[Onboarding_Contract_Jobs_Not_In_Crewlink_List]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Gets entire list of Company Codes - This can be modified to only get Codes by division, area, etc... in the future.>
-- =============================================
CREATE PROCEDURE  [dbo].[Onboarding_Contract_Jobs_Not_In_Crewlink_List]
	@Contract nvarchar(150)
AS

	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	Select Distinct 
		j.job_number ,
	   j.Company_code,
	   j.CONTRACT_NUMBER,
	   j.Project_Manager ,
	   j.status_code as job_status,
	   j.Customer_code,
	   e.employee_name as superintendent
	From SIGMA.WebImport.dbo.[JC_JOB_MASTER_MC] j 
	Join SIGMA.WebImport.dbo.PR_EMPLOYEE_MASTER_1_MC e on 
		rtrim(ltrim(j.Project_Manager)) = rtrim(ltrim(e.employee_code))
		AND j.CONTRACT_NUMBER = @Contract
	Where 
		j.contract_number not in (select Contract_number from WI_CONTRACT_MASTER_T) 

GO
/****** Object:  StoredProcedure [dbo].[Onboarding_Contracts_Not_In_Crewlink_List]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Gets entire list of Company Codes - This can be modified to only get Codes by division, area, etc... in the future.>
-- =============================================
CREATE PROCEDURE  [dbo].[Onboarding_Contracts_Not_In_Crewlink_List]
AS

	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	Select Distinct 
		contract_number 
	From SIGMA.WebImport.dbo.[JC_JOB_MASTER_MC] j
	Where 
		j.contract_number not in (select Contract_number from WI_CONTRACT_MASTER_T) 
		and j.contract_number <> '' 
	Order by contract_number

GO
/****** Object:  StoredProcedure [dbo].[OnboardingGetContractsNotInCrewlink]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[OnboardingGetContractsNotInCrewlink]

as 


	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	Select Distinct   
		[Contract_Number]
	From SIGMA.WebImport.dbo.JC_JOB_MASTER_MC 
	Where 
		contract_number <> '' 
		and status_code = 'A' 
		and contract_number NOT IN (Select distinct contract_number from WI_CONTRACT_MASTER_T)
	Order by Contract_Number
GO
/****** Object:  StoredProcedure [dbo].[OnboardingGetNewContractPayItemsDataSet]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[OnboardingGetNewContractPayItemsDataSet] 
	@Contract varchar(50)
AS

	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	SELECT distinct  
		up.Bill_Item_Code
		, up.Bill_Item_Description
	FROM SIGMA.WebImport.dbo.JC_JOB_MASTER_MC AS jm
	
	INNER JOIN  SIGMA.WebImport.dbo.CR_UNIT_PRICE_ITEM_MC AS up ON 
		jm.Company_Code = up.Company_Code 
		AND jm.Job_Number = up.Job_Number 
		AND jm.Customer_Code = up.Customer_Code
	WHERE  
		(jm.Contract_Number = @Contract) 
		AND (jm.Status_Code = 'A')

GO
/****** Object:  StoredProcedure [dbo].[PayItemsByContract]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[PayItemsByContract]
    @Contract varchar(30),
	@CompanyCode varchar(3)
as 
begin

	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;


	--To Eliminate Parameter Sniffing
	Declare
		@_Contract varchar(30) = @Contract,
		@_CompanyCode varchar(3) = @CompanyCode


    Select Distinct
		ltrim(rtrim(payItem.Bill_Item_Code))			as Code
		, ltrim(rtrim(payItem.Unit_Of_Measure))			as UnitOfMeasure
		, ltrim(rtrim(payItem.Bill_Item_Description))	as [Description]
		, payItem.Company_Code							as CompanyCode
		, jobMaster.Contract_Number
		--, jobMaster.CustomerCode
		--, ltrim(rtrim(payItem.Job_Number))				as JobNumber
	From Sigma.webimport.dbo.CR_UNIT_PRICE_ITEM_MC payItem with(nolock)

	Join Sigma.webimport.dbo.JC_JOB_MASTER_MC jobMaster with(nolock) on
		payitem.company_code = jobmaster.company_code
		and payitem.job_number = jobmaster.job_number

	Join dbo.vw_WI_Customer_Contract cust on 
		ltrim(rtrim(payItem.Customer_Code)) = ltrim(rtrim(cust.CUSTOMER_CODE))
		and ltrim(rtrim(jobMaster.Contract_Number)) = ltrim(rtrim(cust.CONTRACT_NUMBER))

	Where
		jobMaster.company_code = @_CompanyCode
		and payItem.company_code = @_CompanyCode
		and ltrim(rtrim(jobMaster.Contract_Number)) = @_Contract
		--and 
		--ltrim(rtrim(payitem.Customer_Code)) in 
		--	(
		--		Select 
		--			Customer_code 
		--		From dbo.WI_CUSTOMER_MASTER_T customer
		--		Join dbo.WI_CONTRACT_MASTER_T contract on 
		--			customer.WI_CONTRACT_ID = contract.WI_CONTRACT_ID
		--		Where 
		--			contract.CONTRACT_NUMBER = @contract 
		--			and customer.DELETED = -1
		--	)
	group by
		payItem.Bill_Item_Code,
		jobMaster.Contract_Number,
		payItem.Unit_Of_Measure,
		payItem.Bill_Item_Description,
		payItem.Company_Code	





 --   select 
	--	ltrim(rtrim(payItem.Bill_Item_Code)) as Code,
	--	ltrim(rtrim(payItem.Unit_Of_Measure)) as UnitOfMeasure,
	--	ltrim(rtrim(payItem.Bill_Item_Description)) as [Description],
	--	ltrim(rtrim(payItem.Company_Code)) as CompanyCode,
	--	ltrim(rtrim(jobMaster.Contract_Number)) as ContractNumber
	--from
	--	Sigma.webimport.dbo.CR_UNIT_PRICE_ITEM_MC payItem
	--join
	--	Sigma.webimport.dbo.JC_JOB_MASTER_MC jobMaster
	--	on payItem.Job_Number = jobMaster.Job_Number
	--		and payItem.Company_Code = jobMaster.Company_Code
	--where
	--	ltrim(rtrim(jobMaster.Contract_Number)) = @contract
	--	and ltrim(rtrim(payItem.Company_Code)) = @companyCode
	--	and ltrim(rtrim(payitem.Customer_Code)) in 
	--		(select Customer_code from WI_CUSTOMER_MASTER_T customer
	--		 inner join WI_CONTRACT_MASTER_T contract on customer.WI_CONTRACT_ID = contract.WI_CONTRACT_ID
	--		 where contract.CONTRACT_NUMBER = @contract and customer.DELETED = -1)
	--group by
	--	payItem.Bill_Item_Code,
	--	jobMaster.Contract_Number,
	--	payItem.Unit_Of_Measure,
	--	payItem.Bill_Item_Description,
	--	payItem.Company_Code	
end



GO
/****** Object:  StoredProcedure [dbo].[PayItemsWithWbsMappings]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[PayItemsWithWbsMappings]
	@payItemsPerPage as int,
        @page as int,
	@contract as varchar(50),
	@payItemLike as varchar(50) = null
AS
BEGIN

	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;


	with spectrumPayItems as (

		select 
			ltrim(rtrim(jobMaster.Contract_Number)) as ContractNumber,
			ltrim(rtrim(payItem.Bill_Item_Code)) as PayItemCode,
			ltrim(rtrim(payItem.Unit_Of_Measure)) as UnitOfMeasure,
			ltrim(ltrim(payItem.Bill_Item_Description)) as PayItemDescription,
			'' as WbsCode,
			row_number() over (order by payItem.Bill_Item_Code) as PayItemResultNumber,
			count(*) over () as PayItemCount
		from SIGMA.webimport.dbo.CR_UNIT_PRICE_ITEM_MC payItem

		join SIGMA.webimport.dbo.JC_JOB_MASTER_MC jobMaster on 
			payItem.Job_Number = jobMaster.Job_Number
			and payItem.Company_Code = jobMaster.Company_Code
		where
			ltrim(rtrim(jobMaster.Contract_Number)) = @contract
			--pay item code or description like 
			and (
					@payItemLike is null or 
					(payItem.Bill_Item_Code like '%' + @payItemLike + '%' or payItem.Bill_Item_Description like '%' + @payItemLike + '%')
				)
		group by
			payItem.Bill_Item_Code,
			jobMaster.Contract_Number,
			payItem.Unit_Of_Measure,
			payItem.Bill_Item_Description,
			payItem.Company_Code	
	),

	crewLinkPayItems as (

		Select 
			CONTRACT_NUMBER as ContractNumber, 
			PAYITEM as PayItemCode,
			UOM as UnitOfMeasure,
			[DESCRIPTION] as PayItemDescription,
			WBS_CODE as WbsCode
		From dbo.WI_PAYITEM_MASTER_T
		Where 
			CONTRACT_NUMBER =  @contract
	),

	results as (
	
		Select 
			s.PayItemCode, 
			s.PayItemDescription,
			s.UnitOfMeasure,
			s.ContractNumber,
			s.PayItemResultNumber,
			s.PayItemCount,
			c.WbsCode
		From spectrumPayItems s

		left join crewLinkPayItems c on 
			s.PayItemCode = c.PayItemCode
			and s.PayItemDescription = c.PayItemDescription
	)

	Select 
		results.PayItemCode, 
		results.PayItemDescription,
		results.UnitOfMeasure,
		results.WbsCode,
		results.PayItemCount
	From results
	Where 
		PayItemResultNumber between (@payItemsPerPage * (@page - 1) + 1) 
		and (@payItemsPerPage * (@page - 1)) + @payItemsPerPage
	Order by
		results.PayItemCode, 
		results.WbsCode
END
GO
/****** Object:  StoredProcedure [dbo].[SP_EquipmentLink_Hours_For_Export]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_EquipmentLink_Hours_For_Export] @CompanyCode Nvarchar(10)
,
--@Superintendent nvarchar(10) = '',
                                                          @WorkDateBegin nvarchar(10)
,                                                         @WorkDateEnd nvarchar(10)
,                                                         @BatchID nvarchar(20)
AS

	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	--Declare @BatchID nvarchar(20)
	--Declare @Superintendent varchar(20)
	--declare @CompanyCode varchar(20)
	--declare @WorkDateBegin nvarchar(20)
	--declare @WorkDateEnd nvarchar(20)
	--set @WorkDateBegin = '01/21/18'
	--set @WorkDateEnd = '01/27/18'
	--set @Superintendent = 34511
	--set @CompanyCode = '111'
	--set @BatchID = 'Test1'

	DECLARE @PreviousStart DATE
	DECLARE @PreviousEnd DATE
	SET @PreviousStart = Dateadd(day, -7, CONVERT(VARCHAR, @WorkDateBegin, 112))
	SET @PreviousEnd= Dateadd(day, -7, CONVERT(VARCHAR, @WorkDateEnd, 112))
	DECLARE @SingleQuote nvarchar(1)
	SET @SingleQuote = ''''

Begin
	--SET FMTONLY OFF

	If OBJECT_ID('tempdb..#PreviousWeek') is not null
		Drop Table #PreviousWeek;

	If OBJECT_ID('tempdb..#currentweek ') is not null
		Drop Table #currentweek;

	If OBJECT_ID('tempdb..#TEMPFLEET') is not null
		Drop Table #TEMPFLEET;

	If OBJECT_ID('tempdb..#TEMPFLEETALLHOUR') is not null
		Drop Table #TEMPFLEETALLHOUR;


	CREATE TABLE #PreviousWeek ( equipcode     NVARCHAR(10)
	,                            job_number    NVARCHAR(10)
	,                            RATE_PER_HOUR decimal(5,2) )

	CREATE TABLE #currentweek ( equipcode     NVARCHAR(10)
	,                           job_number    NVARCHAR(10)
	,                           RATE_PER_HOUR decimal(5,2) )

	INSERT INTO #previousweek ( equipcode, job_number, RATE_PER_HOUR )

	SELECT DISTINCT Rtrim(Ltrim(em.equipment_code))
	,               Rtrim(Ltrim(em.job_number))
	,               RATE_PER_HOUR
	FROM dbo.ec_revenue_history_mc em

	JOIN dbo.WI_FLEET_MASTER_T     m  ON Rtrim(Ltrim(em.equipment_code)) = Rtrim(Ltrim(m.equipment_code))
	--AND m.equipment_status IN (SELECT equipment_status
	--                           FROM
	--    SIGMA.webimport.dbo.ec_equipment_status_mc
	--                           WHERE  status_type = 'A')
	WHERE Rtrim(Ltrim(transaction_date)) BETWEEN Dateadd(day, -7, CONVERT(VARCHAR(8), @PreviousStart, 112))
		AND Dateadd(day, -1, CONVERT(VARCHAR(8), @PreviousEnd, 112))
		AND Rtrim(Ltrim(equipment_company_code_2)) = @CompanyCode



	INSERT INTO #currentweek ( equipcode, job_number, RATE_PER_HOUR )

	SELECT DISTINCT wi_fleet_master_t.equipment_code
	,               wi_job_master_t.job_number
	,               RATE_PER_HOUR
	FROM       dbo.cl_job_t                    

	INNER JOIN dbo.wi_job_master_t              ON cl_job_t.wi_job_id = wi_job_master_t.wi_job_id

	INNER JOIN dbo.cl_user                      ON cl_job_t.user_id = cl_user.user_id

	INNER JOIN dbo.wi_employee_master_t         ON cl_user.wi_employee_id = wi_employee_master_t.wi_employee_id

	INNER JOIN dbo.cl_contract_fleet_t          ON cl_user.user_id = cl_contract_fleet_t.user_id

	INNER JOIN dbo.wi_fleet_master_t            ON cl_contract_fleet_t.wi_fleet_id = wi_fleet_master_t.wi_fleet_id

	JOIN       dbo.cl_job_equipment_t      je   ON je.[job_id] = cl_job_t.job_id
			AND je.[contract_fleet_id] = cl_contract_fleet_t.[contract_fleet_id]
			AND je.hours > 0

	JOIN       dbo.wi_employee_master_t AS Emp2 ON wi_job_master_t.superintendent = emp2.wi_employee_id

	WHERE job_start_date BETWEEN @WorkDateBegin AND @WorkDateEnd
		AND wi_job_master_t.company_code = @CompanyCode
		AND wi_job_master_t.status = 'a'




	SELECT WI_JOB_MASTER_T.JOB_NUMBER                 
	,      CL_JOB_EQUIPMENT_T.CONTRACT_FLEET_ID        CONTRACT_FLEET_ID
	,      REPLACE(CL_JOB_EQUIPMENT_T.WBS_CODE,'.','') WBS_CODE
	,      sum(CL_JOB_EQUIPMENT_T.HOURS)               HOURS
	,      WI_JOB_MASTER_T.SUPERINTENDENT              SUPERINTENDENT
		INTO #TEMPFLEET
	FROM       dbo.CL_JOB_EQUIPMENT_T

	Inner Join dbo.CL_JOB_T           ON CL_JOB_EQUIPMENT_T.JOB_ID = CL_JOB_T.JOB_ID

	Inner Join dbo.WI_JOB_MASTER_T    ON WI_JOB_MASTER_T.WI_JOB_ID = CL_JOB_T.WI_JOB_ID

	Where convert(datetime, CL_JOB_T.JOB_START_DATE, 103) >= @WorkDateBegin
		and convert(datetime,CL_JOB_T.JOB_START_DATE, 103) <= @WorkDateEnd
		AND CL_JOB_T.JOB_STATUS_ID = 2
		AND ISNULL(DBO.CL_JOB_EQUIPMENT_T.ISACTIVE,1) = 1
		AND WI_JOB_MASTER_T.COMPANY_CODE = @CompanyCode
		--AND RTRIM(LTRIM(WI_JOB_MASTER_T.SUPERINTENDENT )) = @Superintendent
		AND CL_JOB_EQUIPMENT_T.HOURS >0


	Group by WI_JOB_MASTER_T.SUPERINTENDENT
	,        WI_JOB_MASTER_T.JOB_NUMBER
	,        CL_JOB_EQUIPMENT_T.WBS_CODE
	,        CL_JOB_EQUIPMENT_T.CONTRACT_FLEET_ID

	--select * from #tempfleet

	SELECT JOB_NUMBER       
	,      CONTRACT_FLEET_ID
	,      SUM(HOURS)        ALLHOURS
		INTO #TEMPFLEETALLHOURS
	FROM #TEMPFLEET

	Group by JOB_NUMBER
	,        CONTRACT_FLEET_ID
	--select * from #TEMPFLEETALLHOURS



	SELECT WI_FLEET_MASTER_T.EQUIPMENT_CODE               
	,      WBS_CODE                                       
	,      SUPERINTENDENT                                 
	,      #TEMPFLEET.JOB_NUMBER                          
	,      SUM(HOURS)                                         HOURS
	,      ALLHOURS                                       
	,      (SELECT CASE when (ALLHOURS) < 40 then SUM(HOURS) / ALLHOURS * 100
	                    When ALLHOURS > 40   then SUM(HOURS) / ALLHOURS * 100
	                                         else 100 END) AS PercentofHours
	,      (SELECT CASE when (ALLHOURS) < 40 then (40 - ALLHOURS) * (SUM(HOURS) / ALLHOURS)
	                    when (ALLHOURS) > 40 then (40 - ALLHOURS) * (SUM(HOURS) / ALLHOURS)
	                                         else 40 END)  AS Adjustment
		INTO #TEMPFLEETSUM
	FROM       #TEMPFLEET             
	INNER JOIN dbo.CL_CONTRACT_FLEET_T ON #TEMPFLEET.CONTRACT_FLEET_ID = DBO.CL_CONTRACT_FLEET_T.CONTRACT_FLEET_ID

	INNER JOIN dbo.WI_FLEET_MASTER_T   ON DBO.CL_CONTRACT_FLEET_T.WI_FLEET_ID = DBO.WI_FLEET_MASTER_T.WI_FLEET_ID

	inner join #TEMPFLEETALLHOURS      on #TEMPFLEETALLHOURS.Job_number = #TEMPFLEET.JOB_NUMBER
			and #TEMPFLEETALLHOURS.CONTRACT_FLEET_ID = #TEMPFLEET.CONTRACT_FLEET_ID

	GROUP BY #TEMPFLEET.JOB_NUMBER
	,        WBS_CODE
	,        WI_FLEET_MASTER_T.EQUIPMENT_CODE
	,        Hours
	,        ALLHOURS
	,        SUPERINTENDENT
	order by EQUIPMENT_CODE
	--select * from #TEMPFLEETSUM

	--Prep temp tables END

	--Beginning of hours from database
	SELECT 'Hours'                                                                                      as SectionType
	,      '555'                                                                                        AS Equipment_Company
	,      CONVERT(DATE, @WorkDateEnd)                                                                  AS Transaction_Date
	,      @BatchID                                                                                     as BatchID
	,      #TEMPFLEETSUM.EQUIPMENT_CODE                                                                 AS Equipment_Code
	,      'EU'                                                                                         AS Source_Code
	,      'J'                                                                                          AS Rate_Type_Code
	,      'H'                                                                                          AS Rate_Flag
	,      'F'                                                                                          AS Transaction_Type
	,      ISNULL(#TEMPFLEETSUM.HOURS,0)                                                                AS Transaction_Hours
	,      WI_FLEET_MASTER_T.RATE_PER_HOUR                                                              AS Transaction_Rate
	,      ( #TEMPFLEETSUM.HOURS * WI_FLEET_MASTER_T.RATE_PER_HOUR)                                     AS Transaction_Amount
	,      @SingleQuote + CL_Q_EquipmentGLAccountLookup.GL_DEBIT                                        AS GL_Debit
	,      @SingleQuote + CL_Q_EquipmentGLAccountLookup.GL_CREDIT                                       AS GL_Credit
	,      (SELECT CASE when #TEMPFLEETSUM.JOB_NUMBER = '6001561990' then '7761580604'
	                    when #TEMPFLEETSUM.JOB_NUMBER = '6001664390' then '7761580609'
	                    when #TEMPFLEETSUM.JOB_NUMBER = '6001663490' then '7761580610'
	                    when #TEMPFLEETSUM.JOB_NUMBER = '6001663090' then '7761580611'
	                    when #TEMPFLEETSUM.JOB_NUMBER = '6001562790' then '7761580614'
	                    when #TEMPFLEETSUM.JOB_NUMBER = '1111512190' then '7761580616'
	                    when #TEMPFLEETSUM.JOB_NUMBER = '1111512290' then '7761580617'
	                    when #TEMPFLEETSUM.JOB_NUMBER = '1111512090' then '7761580603'

	                                                                 else #TEMPFLEETSUM.JOB_NUMBER END)
	AS                                                                                                     JOB_NUMBER
	,      @SingleQuote + #TEMPFLEETSUM.WBS_CODE                                                        AS WBS_Code
	,      CL_Q_EquipmentGLAccountLookup.COSTTYPE                                                       AS Cost_Type
	,      ''                                                                                           AS Remarks
	,      ''                                                                                           AS Billing_Rate
	,      ''                                                                                           AS Debit_Cost_Center
	,      (SELECT CASE when #TEMPFLEETSUM.JOB_NUMBER = '6001561990' then '776'
	                    when #TEMPFLEETSUM.JOB_NUMBER = '6001664390' then '776'
	                    when #TEMPFLEETSUM.JOB_NUMBER = '6001663490' then '776'
	                    when #TEMPFLEETSUM.JOB_NUMBER = '6001663090' then '776'
	                    when #TEMPFLEETSUM.JOB_NUMBER = '6001562790' then '776'
	                    when #TEMPFLEETSUM.JOB_NUMBER = '1111512190' then '776'
	                    when #TEMPFLEETSUM.JOB_NUMBER = '1111512290' then '776'
	                    when #TEMPFLEETSUM.JOB_NUMBER = '1111512090' then '776'

	                                                                 else @CompanyCode END)            
	AS                                                                                                     Company_Code
	FROM       #TEMPFLEETSUM                    

	INNER JOIN DBO.WI_FLEET_MASTER_T             ON #TEMPFLEETSUM.EQUIPMENT_CODE = DBO.WI_FLEET_MASTER_T.EQUIPMENT_CODE
	INNER JOIN DBO.CL_Q_EquipmentGLAccountLookup ON DBO.CL_Q_EquipmentGLAccountLookup.STATUS = DBO.WI_FLEET_MASTER_T.EQUIPMENT_STATUS
	--End of hours from database
	Union all
	--Beginning of hours Adjusted hours
	SELECT 'Adjusted'                                                                                   as SectionType
	,      '555'                                                                                        AS Equipment_Company
	,      CONVERT(DATE, @WorkDateEnd)                                                                  AS Transacation_Date
	,      @BatchID                                                                                     as BatchID
	,      #TEMPFLEETSUM.EQUIPMENT_CODE                                                                
	,      'EU'                                                                                         AS Source_Code
	,      'J'                                                                                          AS Rate_Type_Code
	,      'H'                                                                                          AS Rate_Flag
	,      'F'                                                                                          AS Transaction_Type
	,      convert(decimal(5,2),Adjustment)                                                             AS Transaction_Hours
	,      WI_FLEET_MASTER_T.RATE_PER_HOUR                                                              AS Transaction_Rate
	,      ( #TEMPFLEETSUM.HOURS * WI_FLEET_MASTER_T.RATE_PER_HOUR)                                     AS Transaction_Amount
	,      @SingleQuote + CL_Q_EquipmentGLAccountLookup.GL_DEBIT                                        AS GL_Debit
	,      @SingleQuote + CL_Q_EquipmentGLAccountLookup.GL_CREDIT                                       AS GL_Credit
	,      (SELECT CASE when #TEMPFLEETSUM.JOB_NUMBER = '6001561990' then '7761580604'
	                    when #TEMPFLEETSUM.JOB_NUMBER = '6001664390' then '7761580609'
	                    when #TEMPFLEETSUM.JOB_NUMBER = '6001663490' then '7761580610'
	                    when #TEMPFLEETSUM.JOB_NUMBER = '6001663090' then '7761580611'
	                    when #TEMPFLEETSUM.JOB_NUMBER = '6001562790' then '7761580614'
	                    when #TEMPFLEETSUM.JOB_NUMBER = '1111512190' then '7761580616'
	                    when #TEMPFLEETSUM.JOB_NUMBER = '1111512290' then '7761580617'
	                    when #TEMPFLEETSUM.JOB_NUMBER = '1111512090' then '7761580603'

	                                                                 else #TEMPFLEETSUM.JOB_NUMBER END)
	AS                                                                                                     JOB_NUMBER
	,      @SingleQuote + #TEMPFLEETSUM.WBS_CODE                                                        AS WBS_Code
	,      CL_Q_EquipmentGLAccountLookup.COSTTYPE                                                       AS Cost_Type
	,      ''                                                                                           AS Remarks
	,      ''                                                                                           AS Billing_Rate
	,      ''                                                                                           AS Debit_Cost_Center
	,      (SELECT CASE when #TEMPFLEETSUM.JOB_NUMBER = '6001561990' then '776'
	                    when #TEMPFLEETSUM.JOB_NUMBER = '6001664390' then '776'
	                    when #TEMPFLEETSUM.JOB_NUMBER = '6001663490' then '776'
	                    when #TEMPFLEETSUM.JOB_NUMBER = '6001663090' then '776'
	                    when #TEMPFLEETSUM.JOB_NUMBER = '6001562790' then '776'
	                    when #TEMPFLEETSUM.JOB_NUMBER = '1111512190' then '776'
	                    when #TEMPFLEETSUM.JOB_NUMBER = '1111512290' then '776'
	                    when #TEMPFLEETSUM.JOB_NUMBER = '1111512090' then '776'

	                                                                 else @CompanyCode END)            
	AS                                                                                                     Company_Code

	FROM       #TEMPFLEETSUM                    

	INNER JOIN DBO.WI_FLEET_MASTER_T             ON #TEMPFLEETSUM.EQUIPMENT_CODE = DBO.WI_FLEET_MASTER_T.EQUIPMENT_CODE
	INNER JOIN DBO.CL_Q_EquipmentGLAccountLookup ON DBO.CL_Q_EquipmentGLAccountLookup.STATUS = DBO.WI_FLEET_MASTER_T.EQUIPMENT_STATUS
	--END of hours Adjusted hours

	UNION all
	--Beginning of Missing Equipment Hours

	SELECT 'Missing'                                                          as SectionType
	,      '555'                                                              AS Equipment_Company
	,      CONVERT(DATE, @WorkDateEnd)                                        AS Transaction_Date
	,      @BatchID                                                           as BatchID
	,      (Ltrim(equipcode))                                                 AS Equipment_Code
	,      'EU'                                                               AS Source_Code
	,      'J'                                                                AS Rate_Type_Code
	,      'H'                                                                AS Rate_Flag
	,      'F'                                                                AS Transaction_Type
	,      40                                                                 AS Transaction_Hours
	,      RATE_PER_HOUR                                                      AS Transaction_Rate
	,      (40 * RATE_PER_HOUR)                                               AS Transaction_Amount
	,      '00750956000'                                                      AS GL_Debit
	,      '00342000100'                                                      AS GL_Credit
	,      job_number                                                        
	,      '000001'                                                           as wbs_code
	,      'Q'                                                                AS Cost_Type
	,      ''                                                                 AS Remarks
	,      ''                                                                 AS Billing_Rate
	,      ''                                                                 AS Debit_Cost_Center
	,      (SELECT CASE when JOB_NUMBER = '6001561990' then '776'
	                    when JOB_NUMBER = '6001664390' then '776'
	                    when JOB_NUMBER = '6001663490' then '776'
	                    when JOB_NUMBER = '6001663090' then '776'
	                    when JOB_NUMBER = '6001562790' then '776'
	                    when JOB_NUMBER = '1111512190' then '776'
	                    when JOB_NUMBER = '1111512290' then '776'
	                    when JOB_NUMBER = '1111512090' then '776'
	--when #TEMPFLEETSUM.JOB_NUMBER = '6001664311' then  '776'
	--  when #TEMPFLEETSUM.JOB_NUMBER = '6001664320' then  '776'
	                                                   else @CompanyCode END)
	AS                                                                           Company_Code

	FROM #previousweek
	WHERE equipcode NOT IN (SELECT equipcode
		FROM #currentweek)
--ORDER  BY #previousweek.equipcode

END ;

GO
/****** Object:  StoredProcedure [dbo].[SP_EquipmentLink_Lockdowns]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_EquipmentLink_Lockdowns] @WorkDateEnd nvarchar(10)

AS

	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	--declare @WorkDateEnd nvarchar(10)
	--set @WorkDateEnd ='2/10/18'
	--SET FMTONLY OFF
	SELECT dbo.WI_EMPLOYEE_MASTER_T.EMPLOYEE_NAME                                                                       
	,      dbo.CL_LOCK_DOWN_T.CALENDAR_END_DATE                                                                         
	,      (SELECT CASE when LOCK_DOWN_STATUS = 1 then WI_EMPLOYEE_MASTER_T.EMPLOYEE_NAME + '    - LOCKED DOWN'

	                                              else WI_EMPLOYEE_MASTER_T.EMPLOYEE_NAME + '    - NOT LOCKED DOWN' END) AS LOCK_DOWN_STATUS
	FROM       dbo.CL_LOCK_DOWN_T      
	INNER JOIN dbo.CL_USER              ON dbo.CL_LOCK_DOWN_T.USER_ID = dbo.CL_USER.USER_ID
	INNER JOIN dbo.WI_EMPLOYEE_MASTER_T ON dbo.CL_USER.WI_EMPLOYEE_ID = dbo.WI_EMPLOYEE_MASTER_T.WI_EMPLOYEE_ID

	where CALENDAR_END_DATE = @WorkDateEnd
		and employee_name not like '%Super%'
GO
/****** Object:  StoredProcedure [dbo].[SP_EquipmentLink_Missing]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[SP_EquipmentLink_Missing]
--Previous
  @CompanyCode NVARCHAR(max)    
, @CurrentdateStart NVARCHAR(10)
, @CurrentdateEnd NVARCHAR(10)  
, @Superintendent NVARCHAR(max)  = ''



as

	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	--DECLARE @CompanyCode NVARCHAR(max)
	-- DECLARE @CurrentdateStart  NVARCHAR(10)
	-- DECLARE @CurrentdateEnd  NVARCHAR(10)

	--SET @CurrentdateStart = '01/21/18'
	--SET @CurrentdateEnd = '01/27/18'

	--SET @CompanyCode = '600'

	DECLARE @PreviousStart DATE
	DECLARE @PreviousEnd DATE
	SET @PreviousStart = Dateadd(day, -7, CONVERT(VARCHAR, @CurrentdateStart, 112))



	SET @PreviousEnd= Dateadd(day, -7, CONVERT(VARCHAR, @CurrentdateEnd, 112))

	--SET @CurrentdateStart = '12/31/17'
	--SET @CurrentdateEnd = '01/06/18'

	--SET @CompanyCode = '600'
	SET FMTONLY OFF
	IF Object_id('tempdb..#PreviousWeek') IS NOT NULL
	BEGIN
		DROP TABLE #previousweek
	END

	CREATE TABLE #previousweek ( equipcode  NVARCHAR(10)
	,
	--transaction_date NVARCHAR(100),
	--active         NVARCHAR(1),
	--superintendent NVARCHAR(100),
	                             job_number NVARCHAR(10)
	--foreman        NVARCHAR(40)
	)

	INSERT INTO #previousweek ( equipcode,
	--transaction_date,
	job_number )
	SELECT DISTINCT Rtrim(Ltrim(em.equipment_code))
	,
	--Rtrim(Ltrim(transaction_date)),
	                Rtrim(Ltrim(em.job_number))
	FROM         ec_revenue_history_mc                      em
	JOIN         WI_FLEET_MASTER_T                          m  ON Rtrim(Ltrim(em.equipment_code)) = Rtrim(Ltrim(m.equipment_code))
			AND m.equipment_status IN (SELECT equipment_status
			FROM SIGMA.webimport.dbo.ec_equipment_status_mc   
			WHERE status_type = 'A')
	WHERE Rtrim(Ltrim(transaction_date)) BETWEEN Dateadd(day, -7,
		CONVERT(VARCHAR(8),
		@PreviousStart, 112)) AND
		Dateadd(day, -1, CONVERT(VARCHAR(8
		), @PreviousEnd,
		112))
		AND Rtrim(Ltrim(equipment_company_code_2)) = @CompanyCode

	--SELECT *
	--FROM   #previousweek
	--ORDER  BY equipcode

	IF Object_id('tempdb..#CurrentWeek') IS NOT NULL
	BEGIN
		DROP TABLE #currentweek
	END

	CREATE TABLE #currentweek ( equipcode       NVARCHAR(10)
	,                           equipdesc       NVARCHAR(100)
	,
	--active         NVARCHAR(1),
	                            superintendent  NVARCHAR(100)
	,                           job_number      NVARCHAR(10)
	,                           foreman         NVARCHAR(40)
	,
	--OwnedFlag      NVarchar(10),
	                            contract_number NVARCHAR(max) )

	INSERT INTO #currentweek ( equipcode, equipdesc,
	--active,
	superintendent, job_number, foreman
	--OwnedFlag,
	--CONTRACT_NUMBER
	)
	SELECT DISTINCT
	-- CL_JOB_T.JOB_START_DATE,
	  wi_fleet_master_t.equipment_code       
	, wi_fleet_master_t.equipment_description
	,
	--cl_contract_fleet_t.isactive,
	  Emp2.employee_name                      AS superintendent
	, wi_job_master_t.job_number             
	, cl_user.user_name                       AS Foreman_Name
	--owned_flag,
	--CONTRACT_NUMBER
	FROM       cl_job_t                    
	INNER JOIN wi_job_master_t              ON cl_job_t.wi_job_id = wi_job_master_t.wi_job_id
	INNER JOIN cl_user                      ON cl_job_t.user_id = cl_user.user_id
	INNER JOIN wi_employee_master_t         ON cl_user.wi_employee_id = wi_employee_master_t.wi_employee_id
	INNER JOIN cl_contract_fleet_t          ON cl_user.user_id = cl_contract_fleet_t.user_id
	INNER JOIN wi_fleet_master_t            ON cl_contract_fleet_t.wi_fleet_id =
			wi_fleet_master_t.wi_fleet_id
	JOIN       cl_job_equipment_t      je   ON je.[job_id] = cl_job_t.job_id
			AND je.[contract_fleet_id] = cl_contract_fleet_t.[contract_fleet_id]
			AND je.hours > 0
	JOIN       wi_employee_master_t AS Emp2 ON wi_job_master_t.superintendent = emp2.wi_employee_id
	--JOIN
	--   SIGMA.WebImport.dbo.EC_REVENUE_HISTORY_MC em on rtrim(ltrim(em.EQUIPMENT_CODE)) = wi_fleet_master_t.EQUIPMENT_CODE
	--   and em.transaction_date between  CONVERT(VARCHAR(8), @CurrentdateStart, 112) and  CONVERT(VARCHAR(8), @CurrentdateEnd, 112)
	WHERE job_start_date BETWEEN @CurrentdateStart AND @CurrentdateEnd
		AND wi_job_master_t.company_code = @CompanyCode
		AND wi_job_master_t.status = 'a'

	--SELECT *
	--FROM   #currentweek
	--ORDER  BY equipcode

	SELECT Rtrim(Ltrim(equipcode)) as Equipment
	,      job_number             
	FROM #previousweek
	WHERE equipcode NOT IN (SELECT equipcode
		FROM #currentweek)
	ORDER BY equipcode
GO
/****** Object:  StoredProcedure [dbo].[sp_UnitPriceTransferForReports]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[sp_UnitPriceTransferForReports]


AS

	SET NOCOUNT ON;


	INSERT INTO [dbo].[CR_UNIT_PRICE_ITEM_MC] ( Company_Code, Customer_Code, Job_Number, Bill_Item_Code, Bill_Item_Description, Unit_Price, Unit_Of_Measure )
	SELECT rtrim(ltrim(Company_Code))
	,      rtrim(ltrim(Customer_Code))
	,      rtrim(ltrim(Job_Number))
	,      rtrim(ltrim(Bill_Item_Code))
	,      rtrim(ltrim(Bill_Item_Description))
	,      rtrim(ltrim(Unit_Price))
	,      rtrim(ltrim(Unit_Of_Measure))
	FROM SIGMA.WebImport.dbo.CR_UNIT_PRICE_ITEM_MC up
	WHERE NOT EXISTS (Select Company_Code
		,                    Customer_Code
		,                    Job_Number
		,                    Bill_Item_Code
		,                    Bill_Item_Description
		,                    Unit_Price
		,                    Unit_Of_Measure
		From CR_UNIT_PRICE_ITEM_MC c
		WHERE c.Company_Code = up.Company_Code
			and c.Customer_Code = up.Customer_Code
			and c.Job_Number = up.Job_Number
			and c.Bill_Item_Code = up.Bill_Item_Code
			and c.Unit_Price = up.Unit_Price
			and c.Unit_Of_Measure = up.Unit_Of_Measure)
GO
/****** Object:  StoredProcedure [dbo].[SSRS_EquipmentListSFC]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--USE [CrewLink_2]
--GO
--/****** Object:  StoredProcedure [dbo].[CL_2_EquipmentTime]    Script Date: 6/20/2017 1:49:16 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
CREATE PROCEDURE [dbo].[SSRS_EquipmentListSFC] @Contract varchar(max)
,                                             @weekbegin date
,                                             @Weekend date
as

	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	--DECLARE @weekbegin DATE
	--DECLARE @Weekend DATE
	--DECLARE @Contract VARCHAR(100)

	--SET @weekbegin ='1-8-18'
	--SET @Weekend = '1-13-18'
	--SET @Contract = 'cgoh np 2016-20'



	IF Object_id('tempdb..#CurrentWeek') IS NOT NULL
	BEGIN
		DROP TABLE #currentweek
	END

	IF Object_id('tempdb..#MissingEqupment') IS NOT NULL
	BEGIN
		DROP TABLE #MissingEqupment
	END

	IF Object_id('tempdb..#PreviousWeek') IS NOT NULL
	BEGIN
		DROP TABLE #previousweek
	END

	CREATE TABLE #currentweek ( EQUIPMENT_CODE        NVARCHAR(10)
	,                           EQUIPMENT_DESCRIPTION NVARCHAR(100)
	,                           active                NVARCHAR(1)
	,                           superintendent        NVARCHAR(100)
	,                           job_number            NVARCHAR(10)
	,                           foreman               NVARCHAR(40)
	,                           OwnedFlag             NVarchar(10)
	,                           CONTRACT_NUMBER       Nvarchar(max) )

	CREATE TABLE #previousweek ( EQUIPMENT_CODE        NVARCHAR(10)
	,                            EQUIPMENT_DESCRIPTION NVARCHAR(100)
	,                            active                NVARCHAR(1)
	,                            superintendent        NVARCHAR(100)
	,                            job_number            NVARCHAR(10)
	,                            foreman               NVARCHAR(40)
	,                            OwnedFlag             NVarchar(10)
	,                            CONTRACT_NUMBER       Nvarchar(max) )

	INSERT INTO #currentweek ( EQUIPMENT_CODE, EQUIPMENT_DESCRIPTION, active, superintendent, job_number, foreman, OwnedFlag, CONTRACT_NUMBER )
	SELECT DISTINCT
	-- CL_JOB_T.JOB_START_DATE,
	  wi_fleet_master_t.equipment_code       
	, wi_fleet_master_t.equipment_description
	, cl_contract_fleet_t.isactive           
	, Emp2.EMPLOYEE_NAME                      as superintendent
	, wi_job_master_t.job_number             
	, cl_user.user_name                       AS Foreman_Name
	, owned_flag                             
	, CONTRACT_NUMBER                        

	FROM       cl_job_t                                          
	INNER JOIN wi_job_master_t                                    ON cl_job_t.wi_job_id = wi_job_master_t.wi_job_id
	INNER JOIN cl_user                                            ON cl_job_t.user_id = cl_user.user_id
	INNER JOIN wi_employee_master_t                               ON cl_user.wi_employee_id =
			wi_employee_master_t.wi_employee_id
			and wi_employee_master_t.STATUS = 'A'
	INNER JOIN cl_contract_fleet_t                                ON cl_user.user_id = cl_contract_fleet_t.user_id
	INNER JOIN wi_fleet_master_t                                  ON cl_contract_fleet_t.wi_fleet_id =
			wi_fleet_master_t.wi_fleet_id
	JOIN       cl_job_equipment_t                            je   ON je.[job_id] = cl_job_t.job_id
			AND je.[contract_fleet_id] =
			cl_contract_fleet_t.[contract_fleet_id]
			AND je.hours > 0
	JOIN       dbo.WI_EMPLOYEE_MASTER_T                   AS Emp2 ON dbo.WI_JOB_MASTER_T.SUPERINTENDENT = Emp2.EMPLOYEE_ID
	JOIN       SIGMA.WebImport.dbo.EC_EQUIPMENT_MASTER_MC    em   on rtrim(ltrim(em.EQUIPMENT_CODE)) = wi_fleet_master_t.EQUIPMENT_CODE
	WHERE job_start_date BETWEEN @weekbegin AND @Weekend
		and (WI_JOB_MASTER_T.CONTRACT_NUMBER IN
		(SELECT items
		FROM dbo.Split(@Contract, ',')))
	--  select * from #CurrentWeek   order by EquipCode
	INSERT INTO #previousweek ( EQUIPMENT_CODE, EQUIPMENT_DESCRIPTION, active, superintendent, job_number, foreman, OwnedFlag, CONTRACT_NUMBER )
	SELECT DISTINCT
	-- CL_JOB_T.JOB_START_DATE,
	  wi_fleet_master_t.equipment_code       
	, wi_fleet_master_t.equipment_description
	, cl_contract_fleet_t.isactive           
	, Emp2.EMPLOYEE_NAME                      as superintendent
	, wi_job_master_t.job_number             
	, cl_user.user_name                       AS Foreman_Name
	, owned_flag                             
	, CONTRACT_NUMBER                        
	FROM       cl_job_t                                          
	INNER JOIN wi_job_master_t                                    ON cl_job_t.wi_job_id = wi_job_master_t.wi_job_id
	INNER JOIN cl_user                                            ON cl_job_t.user_id = cl_user.user_id
	INNER JOIN wi_employee_master_t                               ON cl_user.wi_employee_id =
			wi_employee_master_t.wi_employee_id
			and wi_employee_master_t.STATUS = 'A'
	INNER JOIN cl_contract_fleet_t                                ON cl_user.user_id = cl_contract_fleet_t.user_id
	INNER JOIN wi_fleet_master_t                                  ON cl_contract_fleet_t.wi_fleet_id =
			wi_fleet_master_t.wi_fleet_id
	JOIN       cl_job_equipment_t                            je   ON je.[job_id] = cl_job_t.job_id
			AND je.[contract_fleet_id] =
			cl_contract_fleet_t.[contract_fleet_id]
			AND je.hours > 0
	JOIN       dbo.WI_EMPLOYEE_MASTER_T                   AS Emp2 ON dbo.WI_JOB_MASTER_T.SUPERINTENDENT = Emp2.EMPLOYEE_ID
	JOIN       SIGMA.WebImport.dbo.EC_EQUIPMENT_MASTER_MC    em   on rtrim(ltrim(em.EQUIPMENT_CODE)) = wi_fleet_master_t.EQUIPMENT_CODE
	WHERE job_start_date BETWEEN Dateadd(day, -7, @weekbegin) AND
		Dateadd(day, -1, @weekbegin)
		and (WI_JOB_MASTER_T.CONTRACT_NUMBER IN
		(SELECT items
		FROM dbo.Split(@Contract, ',')))
	--select * from #PreviousWeek  order by EquipCode

	--CREATE TABLE #MissingEqupment

	--  (   Yard          NVARCHAR(100),
	--       CONTRACT_NUMBER      NVARCHAR(MAX),
	--      active         NVARCHAR(1),
	--      EMPLOYEE_NAME NVARCHAR(10),
	--      TITLE     NVARCHAR(10),
	--      equipcode        NVARCHAR(40) ,
	--equipdesc      NVarchar(100),

	--   )


	SELECT DISTINCT 'YARD'                as Foreman_Name
	,               CONTRACT_NUMBER      
	,               superintendent        as Superintendent
	,               NULL                  as EMPLOYEE_NAME
	,               NULL                  as TITLE
	,               EQUIPMENT_CODE       
	,               EQUIPMENT_DESCRIPTION

	FROM #previousweek
	WHERE EQUIPMENT_CODE NOT IN (SELECT EQUIPMENT_CODE
		FROM #currentweek)


	union all

	SELECT DISTINCT Upper(Replace(dbo.cl_user.user_name, '.', ' ')) AS Foreman_Name
	,               dbo.WI_CONTRACT_MASTER_T.CONTRACT_NUMBER       
	,               dbo.WI_EMPLOYEE_MASTER_T.EMPLOYEE_NAME          AS Superintendent
	,               WI_EMPLOYEE_MASTER_T_1.EMPLOYEE_NAME           
	,               WI_EMPLOYEE_MASTER_T_1.TITLE                   
	,               NULL                                            as EQUIPMENT_CODE
	,               NULL                                            as EQUIPMENT_DESCRIPTION

	FROM           dbo.WI_EMPLOYEE_MASTER_T                          
	INNER JOIN     dbo.WI_CONTRACT_MASTER_T                          
		INNER JOIN dbo.CL_JOB_HEADER_INFO_T                           ON dbo.WI_CONTRACT_MASTER_T.WI_CONTRACT_ID = dbo.CL_JOB_HEADER_INFO_T.WI_CONTRACT_ID
		INNER JOIN dbo.CL_USER                                        ON dbo.CL_JOB_HEADER_INFO_T.WI_FOREMAN_ID = dbo.CL_USER.USER_ID ON dbo.WI_EMPLOYEE_MASTER_T.WI_EMPLOYEE_ID = dbo.CL_JOB_HEADER_INFO_T.WI_SUPERINTENDENT_ID
	INNER JOIN     dbo.CL_CONTRACT_CREW_T                             ON dbo.WI_CONTRACT_MASTER_T.WI_CONTRACT_ID = dbo.CL_CONTRACT_CREW_T.WI_CONTRACT_ID
			AND dbo.CL_USER.USER_ID = dbo.CL_CONTRACT_CREW_T.USER_ID
			and dbo.CL_CONTRACT_CREW_T.ISActive = 1
	INNER JOIN     dbo.WI_EMPLOYEE_MASTER_T AS WI_EMPLOYEE_MASTER_T_1 ON dbo.CL_CONTRACT_CREW_T.WI_EMPLOYEE_ID = WI_EMPLOYEE_MASTER_T_1.WI_EMPLOYEE_ID
			and WI_EMPLOYEE_MASTER_T_1.STATUS = 'A'
	INNER JOIN     dbo.WI_EMPLOYEE_MASTER_T AS WI_EMPLOYEE_MASTER_T_3 ON cl_user.wi_employee_id =
			wi_employee_master_t_3.wi_employee_id
			and wi_employee_master_t_3.STATUS = 'A'
	inner join     dbo.CL_CONTRACT_FLEET_T                            ON dbo.CL_CONTRACT_FLEET_T.USER_ID = dbo.CL_USER.USER_ID
	iNNER JOIN     dbo.WI_FLEET_MASTER_T                              ON dbo.CL_CONTRACT_FLEET_T.WI_FLEET_ID = dbo.WI_FLEET_MASTER_T.WI_FLEET_ID
			and dbo.CL_CONTRACT_FLEET_T.WI_CONTRACT_ID = dbo.WI_CONTRACT_MASTER_T.WI_CONTRACT_ID
			AND (dbo.CL_CONTRACT_FLEET_T.ISACTIVE = 1)
	WHERE (cl_user.USER_ROLE_ID = 1)
		AND (dbo.WI_CONTRACT_MASTER_T.CONTRACT_NUMBER IN
		(SELECT items
		FROM dbo.Split(@Contract, ',') AS Split_1))
		and WI_EMPLOYEE_MASTER_T_1.STATUS = 'A'

	Union all

	SELECT DISTINCT Upper(Replace(dbo.cl_user.user_name, '.', ' ')) AS Foreman_Name
	,               dbo.WI_CONTRACT_MASTER_T.CONTRACT_NUMBER       
	,               dbo.WI_EMPLOYEE_MASTER_T.EMPLOYEE_NAME          AS Superintendent
	,               NULL                                            as EMPLOYEE_NAME
	,               NULL                                            as TITLE
	,               dbo.WI_FLEET_MASTER_T.EQUIPMENT_CODE           
	,               dbo.WI_FLEET_MASTER_T.EQUIPMENT_DESCRIPTION    




	FROM       dbo.CL_CONTRACT_FLEET_T                           
	INNER JOIN dbo.WI_FLEET_MASTER_T                              ON dbo.CL_CONTRACT_FLEET_T.WI_FLEET_ID = dbo.WI_FLEET_MASTER_T.WI_FLEET_ID
	INNER JOIN dbo.CL_USER                                        ON dbo.CL_CONTRACT_FLEET_T.USER_ID = dbo.CL_USER.USER_ID
	INNER JOIN dbo.CL_JOB_HEADER_INFO_T                           ON dbo.CL_USER.USER_ID = dbo.CL_JOB_HEADER_INFO_T.WI_FOREMAN_ID
	INNER JOIN dbo.WI_EMPLOYEE_MASTER_T                           on dbo.WI_EMPLOYEE_MASTER_T.WI_EMPLOYEE_ID = dbo.CL_JOB_HEADER_INFO_T.WI_SUPERINTENDENT_ID
	INNER JOIN dbo.WI_CONTRACT_MASTER_T                           ON dbo.CL_CONTRACT_FLEET_T.WI_CONTRACT_ID = dbo.WI_CONTRACT_MASTER_T.WI_CONTRACT_ID
			AND dbo.CL_JOB_HEADER_INFO_T.WI_CONTRACT_ID = dbo.WI_CONTRACT_MASTER_T.WI_CONTRACT_ID
	INNER JOIN dbo.WI_EMPLOYEE_MASTER_T AS WI_EMPLOYEE_MASTER_T_1 ON dbo.CL_USER.WI_EMPLOYEE_ID = WI_EMPLOYEE_MASTER_T_1.WI_EMPLOYEE_ID
			and WI_EMPLOYEE_MASTER_T_1.STATUS = 'A'
	inner join dbo.WI_EMPLOYEE_MASTER_T AS WI_EMPLOYEE_MASTER_T_3 ON cl_user.wi_employee_id =
			wi_employee_master_t_3.wi_employee_id
			and wi_employee_master_t_3.STATUS = 'A'
	WHERE (cl_user.USER_ROLE_ID = 1)
		AND (dbo.CL_CONTRACT_FLEET_T.ISACTIVE = 1)
		AND (dbo.WI_CONTRACT_MASTER_T.CONTRACT_NUMBER IN
		(SELECT items
		FROM dbo.Split(@Contract, ',') AS Split_1) )

		and WI_EMPLOYEE_MASTER_T_1.STATUS = 'A'











































--SELECT DISTINCT
--                   Upper(Replace(dbo.cl_user.user_name, '.', ' ')) AS Foreman_Name,  dbo.WI_CONTRACT_MASTER_T.CONTRACT_NUMBER,
--                  dbo.WI_EMPLOYEE_MASTER_T.EMPLOYEE_NAME AS Superintendent,
--                   WI_EMPLOYEE_MASTER_T_1.EMPLOYEE_NAME, WI_EMPLOYEE_MASTER_T_1.TITLE,
--				  NULL as EQUIPMENT_CODE,NULL as EQUIPMENT_DESCRIPTION

--FROM     dbo.WI_EMPLOYEE_MASTER_T INNER JOIN
--                  dbo.WI_CONTRACT_MASTER_T INNER JOIN
--                  dbo.CL_JOB_HEADER_INFO_T ON dbo.WI_CONTRACT_MASTER_T.WI_CONTRACT_ID = dbo.CL_JOB_HEADER_INFO_T.WI_CONTRACT_ID INNER JOIN
--                  dbo.CL_USER ON dbo.CL_JOB_HEADER_INFO_T.WI_FOREMAN_ID = dbo.CL_USER.USER_ID ON
--                  dbo.WI_EMPLOYEE_MASTER_T.WI_EMPLOYEE_ID = dbo.CL_JOB_HEADER_INFO_T.WI_SUPERINTENDENT_ID INNER JOIN
--                  dbo.CL_CONTRACT_CREW_T ON dbo.WI_CONTRACT_MASTER_T.WI_CONTRACT_ID = dbo.CL_CONTRACT_CREW_T.WI_CONTRACT_ID AND
--                  dbo.CL_USER.USER_ID = dbo.CL_CONTRACT_CREW_T.USER_ID  and dbo.CL_CONTRACT_CREW_T.ISActive = 1
--				   INNER JOIN
--                  dbo.WI_EMPLOYEE_MASTER_T AS WI_EMPLOYEE_MASTER_T_1 ON
--                  dbo.CL_CONTRACT_CREW_T.WI_EMPLOYEE_ID = WI_EMPLOYEE_MASTER_T_1.WI_EMPLOYEE_ID
--				  inner join
--				  dbo.CL_CONTRACT_FLEET_T  ON dbo.CL_CONTRACT_FLEET_T.USER_ID = dbo.CL_USER.USER_ID
--				  iNNER JOIN
--                  dbo.WI_FLEET_MASTER_T ON dbo.CL_CONTRACT_FLEET_T.WI_FLEET_ID = dbo.WI_FLEET_MASTER_T.WI_FLEET_ID
--				  and dbo.CL_CONTRACT_FLEET_T.WI_CONTRACT_ID = dbo.WI_CONTRACT_MASTER_T.WI_CONTRACT_ID
--					AND (dbo.CL_CONTRACT_FLEET_T.ISACTIVE = 1)
--WHERE  (cl_user.USER_ROLE_ID = 1) AND (dbo.WI_CONTRACT_MASTER_T.CONTRACT_NUMBER IN
--                      (SELECT items
--                       FROM      dbo.Split(@Contract, ',') AS Split_1))

--Union all

--SELECT DISTINCT
--                   Upper(Replace(dbo.cl_user.user_name, '.', ' ')) AS Foreman_Name, dbo.WI_CONTRACT_MASTER_T.CONTRACT_NUMBER,
--                  dbo.WI_EMPLOYEE_MASTER_T.EMPLOYEE_NAME AS Superintendent,
--                  NULL as EMPLOYEE_NAME, NULL as TITLE
--				  ,dbo.WI_FLEET_MASTER_T.EQUIPMENT_CODE, dbo.WI_FLEET_MASTER_T.EQUIPMENT_DESCRIPTION




--FROM     dbo.CL_CONTRACT_FLEET_T INNER JOIN
--                  dbo.WI_FLEET_MASTER_T ON dbo.CL_CONTRACT_FLEET_T.WI_FLEET_ID = dbo.WI_FLEET_MASTER_T.WI_FLEET_ID
--				  INNER JOIN
--                  dbo.CL_USER ON dbo.CL_CONTRACT_FLEET_T.USER_ID = dbo.CL_USER.USER_ID
--				   INNER JOIN
--                  dbo.CL_JOB_HEADER_INFO_T ON dbo.CL_USER.USER_ID = dbo.CL_JOB_HEADER_INFO_T.WI_FOREMAN_ID
--				  INNER JOIN
--                 dbo.WI_EMPLOYEE_MASTER_T on dbo.WI_EMPLOYEE_MASTER_T.WI_EMPLOYEE_ID = dbo.CL_JOB_HEADER_INFO_T.WI_SUPERINTENDENT_ID
--	  INNER JOIN
--                 dbo.WI_CONTRACT_MASTER_T ON dbo.CL_CONTRACT_FLEET_T.WI_CONTRACT_ID = dbo.WI_CONTRACT_MASTER_T.WI_CONTRACT_ID AND
--                  dbo.CL_JOB_HEADER_INFO_T.WI_CONTRACT_ID = dbo.WI_CONTRACT_MASTER_T.WI_CONTRACT_ID
--				 INNER JOIN
--                  dbo.WI_EMPLOYEE_MASTER_T AS WI_EMPLOYEE_MASTER_T_1 ON dbo.CL_USER.WI_EMPLOYEE_ID = WI_EMPLOYEE_MASTER_T_1.WI_EMPLOYEE_ID

--WHERE  (cl_user.USER_ROLE_ID = 1) AND (dbo.CL_CONTRACT_FLEET_T.ISACTIVE = 1) AND (dbo.WI_CONTRACT_MASTER_T.CONTRACT_NUMBER IN
--                      (SELECT items
--                       FROM      dbo.Split(@Contract, ',') AS Split_1))

--ORDER BY Superintendent


GO
/****** Object:  StoredProcedure [dbo].[SSRS_EquipmentListSFC_NotActive]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--USE [CrewLink_2]
--GO
--/****** Object:  StoredProcedure [dbo].[CL_2_EquipmentTime]    Script Date: 6/20/2017 1:49:16 PM ******/
--SET ANSI_NULLS ON
--GO
--SET QUOTED_IDENTIFIER ON
--GO
CREATE PROCEDURE [dbo].[SSRS_EquipmentListSFC_NotActive] @Contract varchar(max)
,                                                       @weekbegin date
,                                                       @Weekend date
as
	--DECLARE @weekbegin DATE
	--DECLARE @Weekend DATE
	--DECLARE @Contract VARCHAR(100)

	--SET @weekbegin ='1-8-18'
	--SET @Weekend = '1-13-18'
	--SET @Contract = 'cgoh np 2016-20'

	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;



	IF Object_id('tempdb..#CurrentWeek') IS NOT NULL
	BEGIN
		DROP TABLE #currentweek
	END

	IF Object_id('tempdb..#MissingEqupment') IS NOT NULL
	BEGIN
		DROP TABLE #MissingEqupment
	END

	IF Object_id('tempdb..#PreviousWeek') IS NOT NULL
	BEGIN
		DROP TABLE #previousweek
	END

	CREATE TABLE #currentweek ( EQUIPMENT_CODE        NVARCHAR(10)
	,                           EQUIPMENT_DESCRIPTION NVARCHAR(100)
	,                           active                NVARCHAR(1)
	,                           superintendent        NVARCHAR(100)
	,                           job_number            NVARCHAR(10)
	,                           foreman               NVARCHAR(40)
	,                           OwnedFlag             NVarchar(10)
	,                           CONTRACT_NUMBER       Nvarchar(max) )

	CREATE TABLE #previousweek ( EQUIPMENT_CODE        NVARCHAR(10)
	,                            EQUIPMENT_DESCRIPTION NVARCHAR(100)
	,                            active                NVARCHAR(1)
	,                            superintendent        NVARCHAR(100)
	,                            job_number            NVARCHAR(10)
	,                            foreman               NVARCHAR(40)
	,                            OwnedFlag             NVarchar(10)
	,                            CONTRACT_NUMBER       Nvarchar(max) )

	INSERT INTO #currentweek ( EQUIPMENT_CODE, EQUIPMENT_DESCRIPTION, active, superintendent, job_number, foreman, OwnedFlag, CONTRACT_NUMBER )
	SELECT DISTINCT
	-- CL_JOB_T.JOB_START_DATE,
	  wi_fleet_master_t.equipment_code       
	, wi_fleet_master_t.equipment_description
	, cl_contract_fleet_t.isactive           
	, Emp2.EMPLOYEE_NAME                      as superintendent
	, wi_job_master_t.job_number             
	, cl_user.user_name                       AS Foreman_Name
	, owned_flag                             
	, CONTRACT_NUMBER                        

	FROM       cl_job_t                                          
	INNER JOIN wi_job_master_t                                    ON cl_job_t.wi_job_id = wi_job_master_t.wi_job_id
	INNER JOIN cl_user                                            ON cl_job_t.user_id = cl_user.user_id
	INNER JOIN wi_employee_master_t                               ON cl_user.wi_employee_id =
			wi_employee_master_t.wi_employee_id
			and wi_employee_master_t.STATUS <> 'A'
	INNER JOIN cl_contract_fleet_t                                ON cl_user.user_id = cl_contract_fleet_t.user_id
	INNER JOIN wi_fleet_master_t                                  ON cl_contract_fleet_t.wi_fleet_id =
			wi_fleet_master_t.wi_fleet_id

	JOIN       cl_job_equipment_t                            je   ON je.[job_id] = cl_job_t.job_id
			AND je.[contract_fleet_id] =
			cl_contract_fleet_t.[contract_fleet_id]
			AND je.hours > 0
	JOIN       wi_employee_master_t                       AS Emp2 ON wi_job_master_t.superintendent =
			emp2.wi_employee_id
	JOIN       SIGMA.WebImport.dbo.EC_EQUIPMENT_MASTER_MC    em   on rtrim(ltrim(em.EQUIPMENT_CODE)) = wi_fleet_master_t.EQUIPMENT_CODE
	WHERE job_start_date BETWEEN @weekbegin AND @Weekend
		and (WI_JOB_MASTER_T.CONTRACT_NUMBER IN
		(SELECT items
		FROM dbo.Split(@Contract, ',')))
	--  select * from #CurrentWeek   order by EquipCode
	INSERT INTO #previousweek ( EQUIPMENT_CODE, EQUIPMENT_DESCRIPTION, active, superintendent, job_number, foreman, OwnedFlag, CONTRACT_NUMBER )
	SELECT DISTINCT
	-- CL_JOB_T.JOB_START_DATE,
	  wi_fleet_master_t.equipment_code       
	, wi_fleet_master_t.equipment_description
	, cl_contract_fleet_t.isactive           
	, Emp2.EMPLOYEE_NAME                      as superintendent
	, wi_job_master_t.job_number             
	, cl_user.user_name                       AS Foreman_Name
	, owned_flag                             
	, CONTRACT_NUMBER                        
	FROM       cl_job_t                                          
	INNER JOIN wi_job_master_t                                    ON cl_job_t.wi_job_id = wi_job_master_t.wi_job_id
	INNER JOIN cl_user                                            ON cl_job_t.user_id = cl_user.user_id
	INNER JOIN wi_employee_master_t                               ON cl_user.wi_employee_id =
			wi_employee_master_t.wi_employee_id
			and WI_EMPLOYEE_MASTER_T.STATUS <> 'A'
	INNER JOIN cl_contract_fleet_t                                ON cl_user.user_id = cl_contract_fleet_t.user_id
	INNER JOIN wi_fleet_master_t                                  ON cl_contract_fleet_t.wi_fleet_id =
			wi_fleet_master_t.wi_fleet_id
	JOIN       cl_job_equipment_t                            je   ON je.[job_id] = cl_job_t.job_id
			AND je.[contract_fleet_id] =
			cl_contract_fleet_t.[contract_fleet_id]
			AND je.hours > 0
	JOIN       wi_employee_master_t                       AS Emp2 ON wi_job_master_t.superintendent =
			emp2.wi_employee_id
	JOIN       SIGMA.WebImport.dbo.EC_EQUIPMENT_MASTER_MC    em   on rtrim(ltrim(em.EQUIPMENT_CODE)) = wi_fleet_master_t.EQUIPMENT_CODE
	WHERE job_start_date BETWEEN Dateadd(day, -7, @weekbegin) AND
		Dateadd(day, -1, @weekbegin)
		and (WI_JOB_MASTER_T.CONTRACT_NUMBER IN
		(SELECT items
		FROM dbo.Split(@Contract, ',')))
	--select * from #PreviousWeek  order by EquipCode

	--CREATE TABLE #MissingEqupment

	--  (   Yard          NVARCHAR(100),
	--       CONTRACT_NUMBER      NVARCHAR(MAX),
	--      active         NVARCHAR(1),
	--      EMPLOYEE_NAME NVARCHAR(10),
	--      TITLE     NVARCHAR(10),
	--      equipcode        NVARCHAR(40) ,
	--equipdesc      NVarchar(100),

	--   )


	--   SELECT DISTINCT
	--  'YARD' as Foreman_Name,
	--  CONTRACT_NUMBER,
	--  superintendent as Superintendent,
	--   NULL as EMPLOYEE_NAME,
	--NULL as TITLE,
	--    EQUIPMENT_CODE,
	--       EQUIPMENT_DESCRIPTION

	--   FROM   #previousweek
	--   WHERE  EQUIPMENT_CODE NOT IN (SELECT EQUIPMENT_CODE
	--                            FROM   #currentweek)


	--			 union all

	SELECT DISTINCT Upper(Replace(dbo.cl_user.user_name, '.', ' ')) AS Foreman_Name
	,               dbo.WI_CONTRACT_MASTER_T.CONTRACT_NUMBER       
	,               dbo.WI_EMPLOYEE_MASTER_T.EMPLOYEE_NAME          AS Superintendent
	,               WI_EMPLOYEE_MASTER_T_1.EMPLOYEE_NAME           
	,               WI_EMPLOYEE_MASTER_T_1.TITLE                   
	,               NULL                                            as EQUIPMENT_CODE
	,               NULL                                            as EQUIPMENT_DESCRIPTION

	FROM           dbo.WI_EMPLOYEE_MASTER_T                          
	INNER JOIN     dbo.WI_CONTRACT_MASTER_T                          
		INNER JOIN dbo.CL_JOB_HEADER_INFO_T                           ON dbo.WI_CONTRACT_MASTER_T.WI_CONTRACT_ID = dbo.CL_JOB_HEADER_INFO_T.WI_CONTRACT_ID
		INNER JOIN dbo.CL_USER                                        ON dbo.CL_JOB_HEADER_INFO_T.WI_FOREMAN_ID = dbo.CL_USER.USER_ID ON dbo.WI_EMPLOYEE_MASTER_T.WI_EMPLOYEE_ID = dbo.CL_JOB_HEADER_INFO_T.WI_SUPERINTENDENT_ID
	INNER JOIN     dbo.CL_CONTRACT_CREW_T                             ON dbo.WI_CONTRACT_MASTER_T.WI_CONTRACT_ID = dbo.CL_CONTRACT_CREW_T.WI_CONTRACT_ID
			AND dbo.CL_USER.USER_ID = dbo.CL_CONTRACT_CREW_T.USER_ID
			and dbo.CL_CONTRACT_CREW_T.ISActive = 1
	INNER JOIN     dbo.WI_EMPLOYEE_MASTER_T AS WI_EMPLOYEE_MASTER_T_1 ON dbo.CL_CONTRACT_CREW_T.WI_EMPLOYEE_ID = WI_EMPLOYEE_MASTER_T_1.WI_EMPLOYEE_ID
			and WI_EMPLOYEE_MASTER_T_1.STATUS <> 'A'
	INNER JOIN     dbo.WI_EMPLOYEE_MASTER_T AS WI_EMPLOYEE_MASTER_T_3 ON cl_user.wi_employee_id =
			wi_employee_master_t_3.wi_employee_id
			and wi_employee_master_t_3.STATUS <> 'A'
	inner join     dbo.CL_CONTRACT_FLEET_T                            ON dbo.CL_CONTRACT_FLEET_T.USER_ID = dbo.CL_USER.USER_ID
	iNNER JOIN     dbo.WI_FLEET_MASTER_T                              ON dbo.CL_CONTRACT_FLEET_T.WI_FLEET_ID = dbo.WI_FLEET_MASTER_T.WI_FLEET_ID
			and dbo.CL_CONTRACT_FLEET_T.WI_CONTRACT_ID = dbo.WI_CONTRACT_MASTER_T.WI_CONTRACT_ID
			AND (dbo.CL_CONTRACT_FLEET_T.ISACTIVE = 1)
	WHERE (cl_user.USER_ROLE_ID = 1)
		AND (dbo.WI_CONTRACT_MASTER_T.CONTRACT_NUMBER IN
		(SELECT items
		FROM dbo.Split(@Contract, ',') AS Split_1))
		and WI_EMPLOYEE_MASTER_T_1.STATUS <> 'A'

	Union all

	SELECT DISTINCT Upper(Replace(dbo.cl_user.user_name, '.', ' ')) AS Foreman_Name
	,               dbo.WI_CONTRACT_MASTER_T.CONTRACT_NUMBER       
	,               dbo.WI_EMPLOYEE_MASTER_T.EMPLOYEE_NAME          AS Superintendent
	,               NULL                                            as EMPLOYEE_NAME
	,               NULL                                            as TITLE
	,               dbo.WI_FLEET_MASTER_T.EQUIPMENT_CODE           
	,               dbo.WI_FLEET_MASTER_T.EQUIPMENT_DESCRIPTION    




	FROM       dbo.CL_CONTRACT_FLEET_T                           
	INNER JOIN dbo.WI_FLEET_MASTER_T                              ON dbo.CL_CONTRACT_FLEET_T.WI_FLEET_ID = dbo.WI_FLEET_MASTER_T.WI_FLEET_ID
	INNER JOIN dbo.CL_USER                                        ON dbo.CL_CONTRACT_FLEET_T.USER_ID = dbo.CL_USER.USER_ID
	INNER JOIN dbo.CL_JOB_HEADER_INFO_T                           ON dbo.CL_USER.USER_ID = dbo.CL_JOB_HEADER_INFO_T.WI_FOREMAN_ID
	INNER JOIN dbo.WI_EMPLOYEE_MASTER_T                           on dbo.WI_EMPLOYEE_MASTER_T.WI_EMPLOYEE_ID = dbo.CL_JOB_HEADER_INFO_T.WI_SUPERINTENDENT_ID
	INNER JOIN dbo.WI_CONTRACT_MASTER_T                           ON dbo.CL_CONTRACT_FLEET_T.WI_CONTRACT_ID = dbo.WI_CONTRACT_MASTER_T.WI_CONTRACT_ID
			AND dbo.CL_JOB_HEADER_INFO_T.WI_CONTRACT_ID = dbo.WI_CONTRACT_MASTER_T.WI_CONTRACT_ID
	INNER JOIN dbo.WI_EMPLOYEE_MASTER_T AS WI_EMPLOYEE_MASTER_T_1 ON dbo.CL_USER.WI_EMPLOYEE_ID = WI_EMPLOYEE_MASTER_T_1.WI_EMPLOYEE_ID
			and WI_EMPLOYEE_MASTER_T_1.STATUS <> 'A'
	INNER JOIN dbo.WI_EMPLOYEE_MASTER_T AS WI_EMPLOYEE_MASTER_T_3 ON cl_user.wi_employee_id =
			wi_employee_master_t_3.wi_employee_id
			and wi_employee_master_t_3.STATUS <> 'A'
	WHERE (cl_user.USER_ROLE_ID = 1)
		AND (dbo.CL_CONTRACT_FLEET_T.ISACTIVE = 1)
		AND (dbo.WI_CONTRACT_MASTER_T.CONTRACT_NUMBER IN
		(SELECT items
		FROM dbo.Split(@Contract, ',') AS Split_1) )

		and WI_EMPLOYEE_MASTER_T_1.STATUS <> 'A'











































--SELECT DISTINCT
--                   Upper(Replace(dbo.cl_user.user_name, '.', ' ')) AS Foreman_Name,  dbo.WI_CONTRACT_MASTER_T.CONTRACT_NUMBER,
--                  dbo.WI_EMPLOYEE_MASTER_T.EMPLOYEE_NAME AS Superintendent,
--                   WI_EMPLOYEE_MASTER_T_1.EMPLOYEE_NAME, WI_EMPLOYEE_MASTER_T_1.TITLE,
--				  NULL as EQUIPMENT_CODE,NULL as EQUIPMENT_DESCRIPTION

--FROM     dbo.WI_EMPLOYEE_MASTER_T INNER JOIN
--                  dbo.WI_CONTRACT_MASTER_T INNER JOIN
--                  dbo.CL_JOB_HEADER_INFO_T ON dbo.WI_CONTRACT_MASTER_T.WI_CONTRACT_ID = dbo.CL_JOB_HEADER_INFO_T.WI_CONTRACT_ID INNER JOIN
--                  dbo.CL_USER ON dbo.CL_JOB_HEADER_INFO_T.WI_FOREMAN_ID = dbo.CL_USER.USER_ID ON
--                  dbo.WI_EMPLOYEE_MASTER_T.WI_EMPLOYEE_ID = dbo.CL_JOB_HEADER_INFO_T.WI_SUPERINTENDENT_ID INNER JOIN
--                  dbo.CL_CONTRACT_CREW_T ON dbo.WI_CONTRACT_MASTER_T.WI_CONTRACT_ID = dbo.CL_CONTRACT_CREW_T.WI_CONTRACT_ID AND
--                  dbo.CL_USER.USER_ID = dbo.CL_CONTRACT_CREW_T.USER_ID  and dbo.CL_CONTRACT_CREW_T.ISActive = 1
--				   INNER JOIN
--                  dbo.WI_EMPLOYEE_MASTER_T AS WI_EMPLOYEE_MASTER_T_1 ON
--                  dbo.CL_CONTRACT_CREW_T.WI_EMPLOYEE_ID = WI_EMPLOYEE_MASTER_T_1.WI_EMPLOYEE_ID
--				  inner join
--				  dbo.CL_CONTRACT_FLEET_T  ON dbo.CL_CONTRACT_FLEET_T.USER_ID = dbo.CL_USER.USER_ID
--				  iNNER JOIN
--                  dbo.WI_FLEET_MASTER_T ON dbo.CL_CONTRACT_FLEET_T.WI_FLEET_ID = dbo.WI_FLEET_MASTER_T.WI_FLEET_ID
--				  and dbo.CL_CONTRACT_FLEET_T.WI_CONTRACT_ID = dbo.WI_CONTRACT_MASTER_T.WI_CONTRACT_ID
--					AND (dbo.CL_CONTRACT_FLEET_T.ISACTIVE = 1)
--WHERE  (cl_user.USER_ROLE_ID = 1) AND (dbo.WI_CONTRACT_MASTER_T.CONTRACT_NUMBER IN
--                      (SELECT items
--                       FROM      dbo.Split(@Contract, ',') AS Split_1))

--Union all

--SELECT DISTINCT
--                   Upper(Replace(dbo.cl_user.user_name, '.', ' ')) AS Foreman_Name, dbo.WI_CONTRACT_MASTER_T.CONTRACT_NUMBER,
--                  dbo.WI_EMPLOYEE_MASTER_T.EMPLOYEE_NAME AS Superintendent,
--                  NULL as EMPLOYEE_NAME, NULL as TITLE
--				  ,dbo.WI_FLEET_MASTER_T.EQUIPMENT_CODE, dbo.WI_FLEET_MASTER_T.EQUIPMENT_DESCRIPTION




--FROM     dbo.CL_CONTRACT_FLEET_T INNER JOIN
--                  dbo.WI_FLEET_MASTER_T ON dbo.CL_CONTRACT_FLEET_T.WI_FLEET_ID = dbo.WI_FLEET_MASTER_T.WI_FLEET_ID
--				  INNER JOIN
--                  dbo.CL_USER ON dbo.CL_CONTRACT_FLEET_T.USER_ID = dbo.CL_USER.USER_ID
--				   INNER JOIN
--                  dbo.CL_JOB_HEADER_INFO_T ON dbo.CL_USER.USER_ID = dbo.CL_JOB_HEADER_INFO_T.WI_FOREMAN_ID
--				  INNER JOIN
--                 dbo.WI_EMPLOYEE_MASTER_T on dbo.WI_EMPLOYEE_MASTER_T.WI_EMPLOYEE_ID = dbo.CL_JOB_HEADER_INFO_T.WI_SUPERINTENDENT_ID
--	  INNER JOIN
--                 dbo.WI_CONTRACT_MASTER_T ON dbo.CL_CONTRACT_FLEET_T.WI_CONTRACT_ID = dbo.WI_CONTRACT_MASTER_T.WI_CONTRACT_ID AND
--                  dbo.CL_JOB_HEADER_INFO_T.WI_CONTRACT_ID = dbo.WI_CONTRACT_MASTER_T.WI_CONTRACT_ID
--				 INNER JOIN
--                  dbo.WI_EMPLOYEE_MASTER_T AS WI_EMPLOYEE_MASTER_T_1 ON dbo.CL_USER.WI_EMPLOYEE_ID = WI_EMPLOYEE_MASTER_T_1.WI_EMPLOYEE_ID

--WHERE  (cl_user.USER_ROLE_ID = 1) AND (dbo.CL_CONTRACT_FLEET_T.ISACTIVE = 1) AND (dbo.WI_CONTRACT_MASTER_T.CONTRACT_NUMBER IN
--                      (SELECT items
--                       FROM      dbo.Split(@Contract, ',') AS Split_1))

--ORDER BY Superintendent


GO
/****** Object:  StoredProcedure [dbo].[SSRS_GET_CONTRACT_DFR_LABOR_DETAILS]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SSRS_GET_CONTRACT_DFR_LABOR_DETAILS] @CONTRACT_NUMBER VARCHAR(80)
,
-- THIS IS A JOB START DATE
                                                            @WEEKBEGIN DATE
,                                                           @SUPERINTEDENT INT
,                                                           @FOREMAN INT
AS
BEGIN

	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	-- EXEC [SSRS_GET_CONTRACT_DFR_LABOR_DETAILS] 'DUKE CENTRAL CORRIDOR','3/31/2021','15877','4602'
	DECLARE @UNION_CODES AS TABLE ( UNION_CODE                   VARCHAR(50)
	,                               UNION_NAME                   VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST1 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST2 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST3 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST4 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST5 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST6 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST7 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST8 VARCHAR(200)
	,                               RATE_LEVEL_DESCRIPTION_LIST9 VARCHAR(200) )

	INSERT INTO @UNION_CODES
	SELECT UNION_CODE                                
	,      UNION_NAME                                
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST1)) AS LEVEL1
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST2)) AS LEVEL2
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST3)) AS LEVEL3
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST4)) AS LEVEL4
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST5)) AS LEVEL5
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST6)) AS LEVEL6
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST7)) AS LEVEL7
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST8)) AS LEVEL8
	,      RTRIM(LTRIM(RATE_LEVEL_DESCRIPTION_LIST9)) AS LEVEL9
	FROM SIGMA.WEBIMPORT.DBO.PR_UNION_MASTER_1_MC WITH (NOLOCK)
	WHERE Company_code = '600'

	SELECT DISTINCT CREW_NAME.EMPLOYEE_NAME                                             
	,               CREW_NAME.COMPANY_CODE                                              
	,               JLT.UNION_CODE                                                      
	,               JLT.PAY_LEVEL                                                           PAYLEVEL
	,               CASE WHEN JLT.PAY_LEVEL = 1 THEN UC.RATE_LEVEL_DESCRIPTION_LIST1
	                     WHEN JLT.PAY_LEVEL = 2 THEN UC.RATE_LEVEL_DESCRIPTION_LIST2
	                     WHEN JLT.PAY_LEVEL = 3 THEN UC.RATE_LEVEL_DESCRIPTION_LIST3
	                     WHEN JLT.PAY_LEVEL = 4 THEN UC.RATE_LEVEL_DESCRIPTION_LIST4
	                     WHEN JLT.PAY_LEVEL = 5 THEN UC.RATE_LEVEL_DESCRIPTION_LIST5
	                     WHEN JLT.PAY_LEVEL = 6 THEN UC.RATE_LEVEL_DESCRIPTION_LIST6
	                     WHEN JLT.PAY_LEVEL = 7 THEN UC.RATE_LEVEL_DESCRIPTION_LIST7
	                     WHEN JLT.PAY_LEVEL = 8 THEN UC.RATE_LEVEL_DESCRIPTION_LIST8
	                     WHEN JLT.PAY_LEVEL = 9 THEN UC.RATE_LEVEL_DESCRIPTION_LIST9 END AS PAY_LEVEL_DESC
	,               JLT.STANDARD_HOURS                                                  
	,               JLT.OT_HOURS                                                        
	,               JLT.DT_HOURS                                                        
	,               (JLT.STANDARD_HOURS + JLT.OT_HOURS + JLT.DT_HOURS)                   AS TOTAL_HOURS
	FROM            CL_JOB_T             JT (NOLOCK)               
	INNER JOIN      CL_JOB_LABOR_T       JLT (NOLOCK)               ON JT.JOB_ID = JLT.JOB_ID
	INNER JOIN      CL_CONTRACT_CREW_T   CCT (NOLOCK)               ON JLT.FOREMAN_CREW_ID = CCT.FOREMAN_CREW_ID
	--TO GET CREW MEMBER NAME
	INNER JOIN      WI_EMPLOYEE_MASTER_T CREW_NAME (NOLOCK)         ON CCT.WI_EMPLOYEE_ID = CREW_NAME.WI_EMPLOYEE_ID
	INNER JOIN      WI_JOB_MASTER_T      JM (NOLOCK)                ON JT.WI_JOB_ID = JM.WI_JOB_ID
	INNER JOIN      WI_CONTRACT_MASTER_T CM (NOLOCK)                ON JM.CONTRACT_NUMBER = CM.CONTRACT_NUMBER
	-- TO GET THE FOREMAN NAME
	INNER JOIN      CL_USER              FOREMAN_USER_ID (NOLOCK)   ON JT.USER_ID = FOREMAN_USER_ID.USER_ID
	INNER JOIN      WI_EMPLOYEE_MASTER_T FOREMAN_USER_NAME (NOLOCK) ON FOREMAN_USER_ID.WI_EMPLOYEE_ID = FOREMAN_USER_NAME.WI_EMPLOYEE_ID
	-- TO GET THE APPROVER NAME
	INNER JOIN      WI_EMPLOYEE_MASTER_T EM (NOLOCK)                ON JM.SUPERINTENDENT = EM.EMPLOYEE_ID
	LEFT OUTER JOIN @UNION_CODES         UC                         ON JLT.UNION_CODE = UC.UNION_CODE
	WHERE CM.CONTRACT_NUMBER = @CONTRACT_NUMBER
		AND JT.JOB_STATUS_ID IN (1,2,7)
		-- RECORDS FOR SUPEINTENDENT1 SHOULD NOT BE INCLUDED
		AND JM.SUPERINTENDENT NOT IN ('600011')
		AND JT.JOB_START_DATE = @WEEKBEGIN
		AND EM.WI_EMPLOYEE_ID = @SUPERINTEDENT
		AND JT.USER_ID = @FOREMAN
	--AND JLT.STANDARD_HOURS != 0
	--AND JLT.ISACTIVE = 1
	ORDER BY CREW_NAME.EMPLOYEE_NAME

END

GO
/****** Object:  StoredProcedure [dbo].[SSRS_GET_CONTRACT_DFR_REVENUE_DETAILS]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SSRS_GET_CONTRACT_DFR_REVENUE_DETAILS] @CONTRACT_NUMBER VARCHAR(80)
,
-- THIS IS A JOB START DATE
                                                              @WEEKBEGIN DATE
,                                                             @SUPERINTEDENT INT
,                                                             @FOREMAN INT
AS
BEGIN

	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	SELECT PM.PAYITEM
	,      PM.DESCRIPTION
	,      JPT.QTY
	,      PM.UOM
	,      JPT.WORK_ORDER
	,      JPT.PO_NUMBER
	,      JPT.STREET_ADDRESS
	FROM       CL_JOB_T             JT (NOLOCK)               
	INNER JOIN CL_JOB_PAYITEM_T     JPT (NOLOCK)               ON JT.JOB_ID = JPT.JOB_ID
	INNER JOIN WI_PAYITEM_MASTER_T  PM (NOLOCK)                ON JPT.WI_PAYITEM_ID = PM.WI_PAYITEM_ID
	INNER JOIN WI_JOB_MASTER_T      JM (NOLOCK)                ON JT.WI_JOB_ID = JM.WI_JOB_ID
	INNER JOIN WI_CONTRACT_MASTER_T CM (NOLOCK)                ON JM.CONTRACT_NUMBER = CM.CONTRACT_NUMBER
	-- TO GET THE FOREMAN NAME
	INNER JOIN CL_USER              FOREMAN_USER_ID (NOLOCK)   ON JT.USER_ID = FOREMAN_USER_ID.USER_ID
	INNER JOIN WI_EMPLOYEE_MASTER_T FOREMAN_USER_NAME (NOLOCK) ON FOREMAN_USER_ID.WI_EMPLOYEE_ID = FOREMAN_USER_NAME.WI_EMPLOYEE_ID
	-- TO GET THE APPROVER NAME
	INNER JOIN WI_EMPLOYEE_MASTER_T EM (NOLOCK)                ON JM.SUPERINTENDENT = EM.EMPLOYEE_ID
	WHERE CM.CONTRACT_NUMBER = @CONTRACT_NUMBER
		AND JT.JOB_STATUS_ID IN (1,2,7)
		-- RECORDS FOR SUPEINTENDENT1 SHOULD NOT BE INCLUDED
		AND JM.SUPERINTENDENT NOT IN ('600011')
		AND JT.JOB_START_DATE = @WEEKBEGIN
		AND EM.WI_EMPLOYEE_ID = @SUPERINTEDENT
		AND JT.USER_ID = @FOREMAN
		AND JPT.ISACTIVE = 1
	ORDER BY JT.JOB_START_DATE

END
GO
/****** Object:  StoredProcedure [dbo].[SSRS_GET_INVALID_BILLING_UNITS]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




CREATE PROCEDURE [dbo].[SSRS_GET_INVALID_BILLING_UNITS] @JobDateStart datetime
,                                                      @JobDateStop datetime

AS

	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	select *
	from (
	SELECT distinct JMT.COMPANY_CODE   
	,               JMT.CONTRACT_NUMBER
	,               CM.CUSTOMER_CODE   
	,               JOB_NUMBER         
	,               PAYITEM             as Invalid_BillingUnit_NoRate
	,               EM.EMPLOYEE_NAME    as Approver
	,               U.USER_NAME         as FOREMAN
	,               JT.JOB_START_DATE   as Entry_Date
	,               JST.JOB_STATUS_NAME as Entry_Status
	,               CMT.IS_REVENUE_LIVE
	,               PT.QTY             
	FROM       [CrewLink_2].[dbo].[CL_JOB_PAYITEM_T] PT (NOLOCK) 
	INNER JOIN WI_PAYITEM_MASTER_T                   WP (NOLOCK)  on WP.WI_PAYITEM_ID = PT.WI_PAYITEM_ID
	INNER JOIN CL_JOB_T                              JT (NOLOCK)  on PT.JOB_ID = JT.JOB_ID
	INNER JOIN WI_JOB_MASTER_T                       JMT (NOLOCK) ON JT.WI_JOB_ID = JMT.WI_JOB_ID
	INNER JOIN CL_User                               U (NOLOCK)   on JT.CREATED_BY = U.USER_ID
	INNER JOIN WI_EMPLOYEE_MASTER_T                  EM (NOLOCK)  on EM.EMPLOYEE_ID = JMT.SUPERINTENDENT
	INNER JOIN CL_JOB_STATUS_T                       JST (NOLOCK) on JT.JOB_STATUS_ID = JST.JOB_STATUS_ID
	INNER JOIN WI_CONTRACT_MASTER_T                  CMT (NOLOCK) ON JMT.CONTRACT_NUMBER = CMT.CONTRACT_NUMBER
	INNER JOIN WI_CUSTOMER_MASTER_T                  CM           on PT.WI_CUSTOMER_ID = CM.WI_CUSTOMER_ID
	WHERE JOB_START_DATE >= @JobDateStart
		AND JOB_START_DATE <= @JobDateStop) a
	WHERE NOT EXISTS (SELECT Distinct Bill_Item_Code
		,                             Job_Number
		,                             Company_Code
		,                             Customer_Code
		from CR_UNIT_PRICE_ITEM_MC p
		WHERE a.JOB_NUMBER = p.Job_Number
			and a.Invalid_BillingUnit_NoRate = p.Bill_Item_Code
			and a.COMPANY_CODE = p.Company_Code
			and a.CUSTOMER_CODE = p.Customer_Code
			and p.company_code <> '088')
	Order By CONTRACT_NUMBER ASC
	,        Job_Number ASC
	,        Foreman ASC
	,        Invalid_BillingUnit_NoRate ASC
	,        Entry_Date ASC

GO
/****** Object:  StoredProcedure [dbo].[SSRS_GET_INVALID_PHASE_CODES]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




CREATE PROCEDURE [dbo].[SSRS_GET_INVALID_PHASE_CODES] @JobDateStart datetime
,                                                    @JobDateStop datetime

AS
	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	select *
	from (
	SELECT distinct JMT.COMPANY_CODE         
	,               CONTRACT_NUMBER          
	,               JOB_NUMBER               
	,               Replace(WBS_Code, '.','') as Invalid_Phase_Code
	,               EM.EMPLOYEE_NAME          as Approver
	,               U.USER_NAME               as FOREMAN
	,               EM2.EMPLOYEE_NAME         as CrewMember
	,               JT.JOB_START_DATE         as Entry_Date
	,               JST.JOB_STATUS_NAME       as Entry_Status
	FROM       [CrewLink_2].[dbo].[CL_JOB_LABOR_T] JLT (NOLOCK)
	INNER JOIN CL_JOB_T                            JT (NOLOCK)  on JLT.JOB_ID = JT.JOB_ID
	INNER JOIN WI_JOB_MASTER_T                     JMT (NOLOCK) ON JT.WI_JOB_ID = JMT.WI_JOB_ID
	INNER JOIN CL_User                             U (NOLOCK)   on JT.CREATED_BY = U.USER_ID
	INNER JOIN WI_EMPLOYEE_MASTER_T                EM (NOLOCK)  on EM.EMPLOYEE_ID = JMT.SUPERINTENDENT
	INNER JOIN CL_CONTRACT_CREW_T                  CCT (NOLOCK) on JLT.FOREMAN_CREW_ID = CCT.FOREMAN_CREW_ID
	INNER JOIN WI_EMPLOYEE_MASTER_T                EM2 (NOLOCK) on CCT.WI_EMPLOYEE_ID = EM2.WI_EMPLOYEE_ID
	INNER JOIN CL_JOB_STATUS_T                     JST (NOLOCK) on JT.JOB_STATUS_ID = JST.JOB_STATUS_ID
	WHERE JOB_START_DATE >= @JobDateStart
		AND JOB_START_DATE <= @JobDateStop) a
	WHERE NOT EXISTS (SELECT Distinct Invalid_Phase_Code
		,                             Job_Number
		from SIGMA.WebImport.dbo.JC_Phase_master_MC p
		WHERE a.JOB_NUMBER = p.Job_Number
			and a.Invalid_Phase_Code = p.Phase_Code
			and p.company_code <> '088'
			and p.Status_Code = 'A')
	Order By CONTRACT_NUMBER ASC
	,        Job_Number ASC
	,        Foreman ASC
	,        CrewMember Asc
	,        Invalid_Phase_Code ASC
	,        Entry_Date ASC


GO
/****** Object:  StoredProcedure [dbo].[SSRS_Weekly_Theoretical_Revenue]    Script Date: 17-11-2022 17:33:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--EXEC SSRS_Weekly_Theoretical_Revenue '3/31/2019', 'LEGACY CAM ATMOS BID 2016'

-- EXEC SSRS_Weekly_Theoretical_Revenue '05/29/19', 'Spire 2018-20'

CREATE PROCEDURE [dbo].[SSRS_Weekly_Theoretical_Revenue] @DATEFILTER date
,                                                       @CONTRACT_NUMBER nvarchar(20)

AS

	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	declare @StartDate datetime
	declare @EndDate datetime
	--declare @CONTRACT_NUMBER nvarchar(20) = 'SPIRE 2018-20'
	--declare @DATEFILTER datetime = getdate()
	--Declare @DATEFILTER2 DATETIME = DATEADD(day, 1, @DATEFILTER);
	SELECT @StartDate = DATEADD(wk,DATEDIFF(wk,7,@DATEFILTER),6)
	SELECT @EndDate = DATEADD(wk,DATEDIFF(wk,1,@DATEFILTER),6)

	SELECT DISTINCT JT.JOB_START_DATE                                as JobDate
	,               JT.CREATED_ON                                    as EnteredDate
	,               JST.JOB_STATUS_NAME                              as EntryStatus
	,               EMP.EMPLOYEE_NAME                                as SUPERINTENDENT
	,               EMP2.EMPLOYEE_NAME                               as FOREMAN
	,               PIM.COMPANY_CODE                                
	--,JMT.CUSTOMER_CODE
	--,case when JMT.CUSTOMER_CODE = 'SPIREMO' then 'SPIREMO19' else JMT.CUSTOMER_CODE end as CUSTOMER_CODE
	,               CUST.CUSTOMER_CODE                              
	,               PIM.CONTRACT_NUMBER                             
	,               UP.JOB_NUMBER                                   
	,               JPT.PO_NUMBER                                   
	,               JPT.WORK_ORDER                                  
	,               JPT.STREET_ADDRESS                              
	,               PIM.PAYITEM                                     
	,               PIM.WBS_CODE                                    
	,               PIM.DESCRIPTION                                 
	,               JPT.QTY                                         
	,               PIM.UOM                                         
	,               UP.Unit_Price                                   
	,               cast((UP.Unit_Price * JPT.QTY) as numeric(36,2)) as Revenue

	FROM       dbo.[CR_UNIT_PRICE_ITEM_MC] UP with (nolock)  
	--FROM SIGMA.webimport.dbo.CR_UNIT_PRICE_ITEM_MC UP
	INNER JOIN WI_JOB_MASTER_T             JMT with (nolock)  ON JMT.JOB_NUMBER = UP.Job_Number

	INNER JOIN dbo.CL_JOB_T                JT with (nolock)   ON JT.WI_JOB_ID = JMT.WI_JOB_ID

	INNER JOIN dbo.CL_JOB_PAYITEM_T        JPT with (nolock)  ON JPT.JOB_ID = JT.JOB_ID

	INNER JOIN dbo.WI_CUSTOMER_MASTER_T    CUST with (nolock) ON JPT.WI_CUSTOMER_ID = CUST.WI_CUSTOMER_ID

	INNER JOIN dbo.CL_JOB_STATUS_T         JST with (nolock)  ON JST.JOB_STATUS_ID = JT.JOB_STATUS_ID
			and JT.JOB_STATUS_ID <> 5

	INNER JOIN dbo.WI_PAYITEM_MASTER_T     PIM with (nolock)  ON PIM.WI_PAYITEM_ID = JPT.WI_PAYITEM_ID

	INNER JOIN dbo.WI_EMPLOYEE_MASTER_T    EMP with (nolock)  ON EMP.EMPLOYEE_ID = JMT.SUPERINTENDENT

	INNER JOIN dbo.CL_USER                 CU with (nolock)   ON CU.USER_ID = JT.USER_ID

	INNER JOIN dbo.WI_EMPLOYEE_MASTER_T    EMP2 with (nolock) ON EMP2.WI_EMPLOYEE_ID = CU.WI_EMPLOYEE_ID

	Where
		--UP.Customer_Code = JMT.CUSTOMER_CODE
		--UP.Customer_Code = case when JMT.CUSTOMER_CODE = 'SPIREMO' then 'SPIREMO19' else JMT.CUSTOMER_CODE end
		UP.Customer_Code = CUST.CUSTOMER_CODE
		AND ltrim(rtrim(UP.Bill_Item_Code)) = ltrim(rtrim(PIM.PAYITEM))
		AND UP.Job_Number IN
		(SELECT DISTINCT JMT.JOB_NUMBER
		FROM       [dbo].[CL_JOB_T] JT 
		INNER JOIN WI_JOB_MASTER_T  JMT ON JT.WI_JOB_ID = JMT.WI_JOB_ID
		WHERE JT.JOB_START_DATE >= @StartDate
			AND JT.JOB_START_DATE < @EndDate)
		AND ltrim(rtrim(PIM.CONTRACT_NUMBER)) like '%' + @CONTRACT_NUMBER + '%'--= ltrim(rtrim(@CONTRACT_NUMBER))
		AND JPT.QTY > 0
		AND (
			JT.JOB_START_DATE >= @StartDate
			AND JT.JOB_START_DATE < @EndDate)
	Order by SUPERINTENDENT
	,        FOREMAN
	,        Job_Number
	,        EnteredDate Asc




GO
