select * FROM  [CrewLink.Prod.Latest].[dbo].[CL_USER] 
left join [CrewLink.Prod.Latest].[dbo].[CL_JOB_HEADER_INFO_T] 
on [CrewLink.Prod.Latest].[dbo].[CL_USER].USER_ID = [CrewLink.Prod.Latest].[dbo].[CL_JOB_HEADER_INFO_T].WI_FOREMAN_ID
where [CrewLink.Prod.Latest].[dbo].[CL_JOB_HEADER_INFO_T].WI_FOREMAN_ID is null