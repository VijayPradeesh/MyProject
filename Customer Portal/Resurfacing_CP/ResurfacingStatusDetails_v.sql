
/****** Object:  View [dbo].[ResurfacingStatusDetails_v]    Script Date: 12-06-2023 09:45:32 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO






/****** Script for SelectTopNRows command from SSMS  *****
 Select * From 	dbo.DFRStatusDetails_v */
CREATE View [dbo].[ResurfacingStatusDetails_v]
as
	
	Select 
        a.ID                                     as [ResurfacingMasterID]
        , a.ResurfacingId                        as [ResurfacingId]
        , a.JobNumber                            as [JobNumber]
        , a.JobStartDate                         as [JobStartDate]
        , b.StatusID                             as [StatusID]
        , c.[Text]                               as [Status]    
        , b.ReasonTypeID                         as [ReasonTypeID]
        , h.[Text]                               as [Reason]
        , b.Comment                              as [Comment]
        , a.ForemanID                            as [ForemanID]
        , a.ForemanName                          as [ForemanName]
        , a.ForemanRole                          as [ForemanRole]
        , a.ApproverID                           as [Approver]
        , a.ApproverName                         as [ApproverName]
        , a.ApproverRole                         as [ApproverRole]
        , isnull(b.CLUserID, b.CPUserId)         as [RespondedBy]
        , isnull(b.CLUserRole, f.[Text])         as [RespondedByRole]
        , Case 
            When b.CLUserId is not null and b.CLUsername is not null then b.CLUsername
            When b.CLUserID is not null and b.CLUsername is null then a.ApproverName
            When b.cluserid is null then g.[Username]
            else Null
        end                                      as [RespondedByName]
        , b.AddedDate                            as [RespondedOn]
        , b.CPIPAddress                          as [CPIPAddress]
        , b.Active                               as [DFRActive]
		, b.Requester                            as [Requester]
		, case 
			when b.Signature is not null then 'image/png'
		end as [MIME]
        , cast('' as xml).value('xs:base64Binary(sql:column("b.signature"))', 'varchar(max)')   as [SignatureBase64]
        --, b.Signature                            as [SignatureBinary]  --- Data type in Crewlink is varbinary(max)

    From [dbo].[ResurfacingMaster_T]                    a with (nolock)

    Join [dbo].[ResurfacingStatusTracking_T]            b with (nolock) on
        a.[ID] = b.ResurfacingMasterId

    Join [dbo].[Lookup_T]                       c with (nolock) on
        b.[StatusID] = c.[ID]
        and c.[Type] = 'DFRStatus'
        and c.[Active] = 1

    outer apply (
					Select Top 1 
						UserID
						, TypeRoleID
					From [dbo].[UserRoleRegionMapping_T] d with (nolock) 
					Where
       					b.[CPUserID] = d.[UserId]
       					and d.[Active] = 1
				) as p

    Left Join [dbo].[TypeRoleMapping_T]        e with (nolock) on
        p.[TypeRoleID] = e.[ID]
        and e.[Active] = 1

    Left Join [dbo].[Lookup_T]                 f with (nolock) on
        e.[RoleID] = f.[ID]
        and f.[Type] = 'UserRole'
        and f.Active = 1

    Left Join [dbo].[User_T]                   g with(nolock) on
        b.[CPUserID] = G.[ID]
        and g.[Active] = 1

    Left Join [dbo].[Lookup_T]                 h with (nolock) on
        b.[ReasonTypeID] = h.[ID]
        and h.[Type] = 'ReasonType'
        and h.[Active] = 1

	Where
		a.Active = 1

GO




