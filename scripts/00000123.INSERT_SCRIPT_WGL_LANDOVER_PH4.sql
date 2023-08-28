BEGIN
   IF NOT EXISTS (SELECT TOP 1 * FROM [dbo].[CL_DFR_MASTER_T]
                   WHERE [UNIQUE_KEY] = 'WGL Landover PH4')
   BEGIN
   INSERT [dbo].[CL_DFR_MASTER_T] ([DFR_NAME], [ISACTIVE], [UNIQUE_KEY]) VALUES (N'WGL Landover PH4 DFR', 1, N'WGL Landover PH4')
   END
   IF NOT EXISTS (SELECT TOP 1 * FROM [dbo].[CL_DFR_MAPPING_T]
                   WHERE [WI_CONTRACT_ID] in (SELECT TOP 1 WI_CONTRACT_ID FROM [WI_CONTRACT_MASTER_T] where [CONTRACT_NUMBER] = 'WGL Landover PH4')
                   AND [DFR_ID] in (SELECT TOP 1 DFR_ID FROM CL_DFR_MASTER_T WHERE UNIQUE_KEY = 'WGL Landover PH4'))
   BEGIN
	INSERT [dbo].[CL_DFR_MAPPING_T] ( [WI_CONTRACT_ID], [DFR_ID], [CREATED_ON], [CREATED_BY], [MODIFIED_ON], [MODIFIED_BY], [ISACTIVE]) VALUES ((SELECT TOP 1 WI_CONTRACT_ID FROM [WI_CONTRACT_MASTER_T] where [CONTRACT_NUMBER] = 'WGL Landover PH4'), (SELECT TOP 1 DFR_ID FROM CL_DFR_MASTER_T WHERE UNIQUE_KEY = 'WGL Landover PH4'), (SELECT CURRENT_TIMESTAMP), NULL, NULL, NULL, 1)
   END
END