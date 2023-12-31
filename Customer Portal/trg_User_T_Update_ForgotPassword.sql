USE [CustomerPortal.Development]
GO
/****** Object:  Trigger [dbo].[trg_User_T_Update_ForgotPassword]    Script Date: 1/12/2023 12:40:04 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Chris Carlsen
-- Create date: 01/12/2023
-- Description:	Notify if they forgot password
-- =============================================
Create TRIGGER [dbo].[trg_User_T_Update_ForgotPassword]
   ON  [dbo].[User_T] 
   AFTER UPDATE
AS 
BEGIN
	
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED; --nolock

	IF Exists (Select 0 from iNSERTED) and exists(select 0 from DELETED) Begin


		DECLARE @error nvarchar(MAX)
 
		SELECT @error =  Concat(
							'<td style="text-align:center;">' + cast(inserted.ID as varchar(25)) + '</td> ',
							'<td style="text-align:center; white-space:nowrap;">' + INSERTED.Username + '</td> ',
							'<td style="text-align:center; white-space:nowrap;">' + INSERTED.Email + '</td> ',
							'<td style="text-align:center; white-space:nowrap;">' + case when INSERTED.IsNewAccount = 1 Then 'True' else 'False' end +'</td> ',
							'<td style="text-align:center; white-space:nowrap;">' + case when INSERTED.ForgotPassword = 1 then 'True' else 'False' end +'</td> ',
							'<td style="text-align:center; white-space:nowrap;">' + Convert(varchar(25),INSERTED.ChangedDate) +'</td> '
						)
					FROM INSERTED 
					WHERE 
						inserted.ForgotPassword = 1

		IF @error is not null BEGIN

			Declare @css varchar(500) = Concat(
										'<style> ',
											'table { margin: .5em; border-collapse: collapse; width:50%; } ',
											 'td { padding: 0 .5em; border: 1px solid #000; }' ,
											 'th { background-color:#F0941C; text-align:center; border: 1px solid #000; }',
											'</style> '
										)


			DECLARE @body varchar(MAX) = Concat( 
											@Css,
											'<h1>Customer Portal - Password Reset.</h1> ',
											'<br>',
											'<table> ',
													'<tr> ',
													'<th style="width:25px;">ID</th> ',
													'<th>Username</th> ',
													'<th>Email</th> ',
													'<th>New Account</th>',
													'<th>Forgot Password</th> ',
													'<th>Changed On</th> ',
												'</tr> ',
												'<tr> ',
														@error,
												'</tr> ',
												'</table>'
											)


			EXEC msdb.dbo.sp_send_dbmail
				@profile_name = 'Mears Service Processes'
				,@recipients = 'Chris.Carlsen@Mears.net;'
				,@subject = 'Customer Portal: Password Reset Notification ******* QA *******'
				,@body = @body
				,@body_format = 'HTML'
				,@importance ='HIGH'

				;THROW 51000, 'The record does not exist.', 1;  
				

		End
	End
END


User {UserId: 49} Modified
  UserId: 49 PK
  AccessFailedCount: 0 Modified
  AccountCreatedOn: '08-12-2022 18:28:16' Modified
  CreatedBy: 48 Modified
  Email: 'testuser4@psiog.com' Modified
  FirstName: 'Test' Modified
  ForgetPassword: 'True' Modified Originally 'False'
  IsActive: 'True' Modified
  IsLockOut: 'False' Modified
  LastLogin: '16-12-2022 22:11:19' Modified
  LastName: 'User4' Modified
  LockedOutOn: <null> Modified
  LoginFailedOn: <null> Modified
  ModifiedBy: 1 Modified
  ModifiedOn: '03-01-2023 17:49:00' Modified
  PasswordUpdatedOn: '08-12-2022 18:28:16' Modified
  UserName: 'Test.User4' Modified
  isNewlyGeneratedAccount: 'True' Modified
