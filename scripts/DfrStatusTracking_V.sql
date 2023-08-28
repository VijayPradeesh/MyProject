USE [CustomerPortal.Development]
GO

/****** Object:  View [dbo].[DFRStatusDetails_v]    Script Date: 15-02-2023 17:24:52 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO




/****** Script for SelectTopNRows command from SSMS  *****
 Select * From 	dbo.DFRStatusDetails_v*/
ALTER VIEW [dbo].[DFRStatusDetails_v]
AS
SELECT   Distinct     a.ID AS JobMasterID, a.JobID, a.JobNumber, a.JobStartDate, b.StatusID, c.Text AS Status, b.ReasonTypeID, h.Text AS Reason, b.Comment AS Comment, a.ForemanID, a.ForemanName, a.ForemanRole, 
                         a.ApproverID AS Approver, a.ApproverName, a.ApproverRole, ISNULL(b.CLUserId, b.CPUserId) AS RespondedBy, ISNULL(b.CLUserRole, f.Text) AS RespondedByRole, CASE WHEN b.CLUserId IS NOT NULL AND 
                         b.CLUsername IS NOT NULL THEN b.CLUsername WHEN b.CLUserID IS NOT NULL AND b.CLUsername IS NULL THEN a.ApproverName WHEN b.cluserid IS NULL THEN g.[Username] ELSE NULL END AS RespondedByName, 
                         b.AddedDate AS RespondedOn, b.CPIPAddress, b.Active AS DFRActive
FROM            dbo.JobMaster_T AS a WITH (nolock) INNER JOIN
                         dbo.DFRStatusTracking_T AS b WITH (nolock) ON a.ID = b.JobMasterID INNER JOIN
                         dbo.Lookup_T AS c WITH (nolock) ON b.StatusID = c.ID AND c.Type = 'DFRStatus' AND c.Active = 1 LEFT OUTER JOIN
                         dbo.UserRoleRegionMapping_T AS d WITH (nolock) ON b.CPUserId = d.UserID AND d.Active = 1 LEFT OUTER JOIN
                         dbo.TypeRoleMapping_T AS e WITH (nolock) ON d.TypeRoleID = e.ID AND e.Active = 1 LEFT OUTER JOIN
                         dbo.Lookup_T AS f WITH (nolock) ON e.RoleID = f.ID AND f.Type = 'UserRole' AND f.Active = 1 LEFT OUTER JOIN
                         dbo.User_T AS g WITH (nolock) ON b.CPUserId = g.ID AND g.Active = 1 LEFT OUTER JOIN
                         dbo.Lookup_T AS h WITH (nolock) ON b.ReasonTypeID = h.ID AND h.Type = 'ReasonType' AND h.Active = 1
						 order by b.AddedDate offset 0 rows
						 
GO


