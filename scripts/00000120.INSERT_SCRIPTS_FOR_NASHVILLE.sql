BEGIN
   IF NOT EXISTS (SELECT TOP 1 * FROM [dbo].[CL_DFR_MASTER_T]
                   WHERE [UNIQUE_KEY] = 'Duke Line 469 Pipeline')
   BEGIN
   INSERT [dbo].[CL_DFR_MASTER_T] ([DFR_NAME], [ISACTIVE], [UNIQUE_KEY]) VALUES (N'Duke Line 469 Pipeline DFR', 1, N'Duke Line 469 Pipeline')
   END
   IF NOT EXISTS (SELECT TOP 1 * FROM [dbo].[CL_DFR_MAPPING_T]
                   WHERE [WI_CONTRACT_ID] in (SELECT TOP 1 WI_CONTRACT_ID FROM [WI_CONTRACT_MASTER_T] where [CONTRACT_NUMBER] = 'Duke Line 469 Pipeline')
                   AND [DFR_ID] in (SELECT TOP 1 DFR_ID FROM CL_DFR_MASTER_T WHERE UNIQUE_KEY = 'Duke Line 469 Pipeline'))
   BEGIN
	INSERT [dbo].[CL_DFR_MAPPING_T] ( [WI_CONTRACT_ID], [DFR_ID], [CREATED_ON], [CREATED_BY], [MODIFIED_ON], [MODIFIED_BY], [ISACTIVE]) VALUES ((SELECT TOP 1 WI_CONTRACT_ID FROM [WI_CONTRACT_MASTER_T] where [CONTRACT_NUMBER] = 'DUKE LINE 469 PIPELINE'), (SELECT TOP 1 DFR_ID FROM CL_DFR_MASTER_T WHERE UNIQUE_KEY = 'Duke Line 469 Pipeline'), (SELECT CURRENT_TIMESTAMP), NULL, NULL, NULL, 1)
   END
END