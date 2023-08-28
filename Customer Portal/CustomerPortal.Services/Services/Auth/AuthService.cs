using CustomerPortal.Services.Core.Crypto;
using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Models;
using CustomerPortal.Services.Repositories.Auth;
using MailKit.Net.Smtp;
using Microsoft.IdentityModel.Tokens;
using MimeKit;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Fare;
using System.Text;
using System;
using System.Collections.Generic;
using static CustomerPortal.Services.Controllers.AuthController;
using CustomerPortal.Services.Core.Responses.Auth;

namespace CustomerPortal.Services.Services.Auth
{
    public class AuthService: IAuthService
    {
        private  IAuthRepo AuthRepo { get; }
        public IConfiguration Configuration { get; }
        private readonly ICrypto _crypto;

        public static string dictionaryString = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_!@#$%^&*?";

        public static string Salphabets = "abcdefghijklmnopqrstuvwxyz";
        public static string Calphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        public static string Numbers = "0123456789";
        public static string sChar = "_!@#$%^&*?";

        public AuthService(IAuthRepo authRepo, IConfiguration configuration, ICrypto crypto)
        {
            AuthRepo = authRepo;
            Configuration = configuration;
            _crypto = crypto;
        }


        public async Task<ChangePasswordResponse> ChangePassword(ChangePasswordDto _changePasswordDto, ChangePasswordResponse changePasswordResponse)
        {
            changePasswordResponse.IsUserFound = true;
            changePasswordResponse.IsInvalidUser = false;
            changePasswordResponse.IsActiveUser = true;
            var user = await AuthRepo.GetUser(_changePasswordDto.Email);
            if(user == null)
            {
                changePasswordResponse.IsUserFound = false;
                changePasswordResponse.Status = false;
                changePasswordResponse.Message =  "User doesn't exist";
                return changePasswordResponse;
            }
            else
            {
                if(_changePasswordDto.UserId != user.UserId)
                {
                    changePasswordResponse.IsInvalidUser = true;
                    changePasswordResponse.Status = false;
                    changePasswordResponse.Message = "Invalid User";
                    return changePasswordResponse;
                }
                if(!ValidatePassword(_changePasswordDto.CurrentPassword, user.passwordSalt, user.PasswordHash))
                {
                    changePasswordResponse.InValidPassword = true;
                    changePasswordResponse.Status = false;
                    changePasswordResponse.Message = "Invalid Password";
                    return changePasswordResponse;
                }
                else if(user.IsActive == false)
                {
                    changePasswordResponse.IsActiveUser = false;
                    changePasswordResponse.Status = false;
                    changePasswordResponse.Message = "User is inactive";
                    return changePasswordResponse;
                }
                else if(user.IsLockOut == true)
                {
                    changePasswordResponse.IsUserLockedOut = true;
                    changePasswordResponse.Status = false;
                    changePasswordResponse.Message = "User is locked out";
                    return changePasswordResponse;
                }
                else
                {
                    var pwh =await AuthRepo.GetPasswordHistory(_changePasswordDto.UserId);
                    var flag = true;
                    createSaltAndHash(_changePasswordDto.NewPassword, out byte[] passwordSalt, out byte[] passwordHash);
                    foreach(var item in pwh)
                    {
                        if(ValidatePassword(_changePasswordDto.NewPassword, item.passwordSalt, item.PasswordHash))
                        {
                            flag = false;
                        }
                    }
                    if(flag == false)
                    {
                        changePasswordResponse.IsAlreadyExistingPassword = true;
                        changePasswordResponse.Status = false;
                        changePasswordResponse.Message = "Password already exists, Please try another password";
                        return changePasswordResponse;
                    }
                    else
                    {
                        try
                        {
                            await AuthRepo.UpdateUserAndPasswordHistory(user, passwordSalt, passwordHash, user.UserId, null);
                        }
                        catch(Exception ex)
                        {
                            changePasswordResponse.ExceptionOccured = true;
                            Console.WriteLine(ex.ToString());
                        }
                        finally
                        {
                            if(changePasswordResponse.ExceptionOccured)
                            {
                                changePasswordResponse.Status = false;
                                changePasswordResponse.Message = "System exception occured.! CHange password failed.!";
                            }else
                            {
                                changePasswordResponse.Status = true;
                                changePasswordResponse.Message = "Password changed Successfully";
                                
                            }
                        }
                        return changePasswordResponse;
                    }
                }
            }
            return changePasswordResponse;
        }
        public async Task<User> ResetPassword(ResetPasswordDto _resetPasswordDto)
        {
            CreatePasswordHash(out string password, out byte[] PasswordHash, out byte[] PasswordSalt);
            var user =  await AuthRepo.ResetPassword(_resetPasswordDto, PasswordSalt, PasswordHash);
            if(user != null)
            {
                SendEmail(password, user.Email, user.UserName);
                return user;
            }
            return user;
        }
        public async Task<User> Register(RegisterDto _userDto)
        {
            CreatePasswordHash(out string password, out byte[] PasswordHash, out byte[] PasswordSalt);
            var user =await AuthRepo.RegisterUser(_userDto, PasswordHash, PasswordSalt);
            SendEmail(password, _userDto.Email, _userDto.FirstName + " " + _userDto.LastName);
            return user;
        }
        public async Task<LoginResponse> Login(LoginDto _loginDto, LoginResponse response)
        {
            var user = await AuthRepo.GetUser(_loginDto.Email);
            response.Token = "";
            response.IsLockedOut = false;
            response.IsActiveUser = true;
            response.IsPasswordExpired = false;
            response.IsInvalidPassword = false;
            response.IsUserFound = true;
            response.message = "";
            response.flag = true;
            response.IsNewUser = false;
            // var user = new User();
            if (user == null)
            {
                response.flag = false;
                response.IsUserFound = false;
                response.message = "User Not Found";
                response.Token =  "NUF";
                return response;
            }
            else
            {
                if (user.IsActive == false)
                {
                    response.flag = false;
                    response.IsActiveUser = false;
                    response.message = "User is Inactive";
                    return response;
                }
                if (user.IsLockOut == true)
                {
                    TimeSpan xx = (TimeSpan)(DateTime.Now - user.LoginFailedOn);
                    if(!(xx.TotalMinutes >= 360))
                    {
                        response.flag = false;
                        response.IsLockedOut = true;
                        response.message = "User account is locked out";
                        return response;
                    }
                }
                if (!ValidatePassword(_loginDto.Password, user.passwordSalt, user.PasswordHash))
                {
                    var fl = await AuthRepo.UpdateLoginData(_loginDto, "fail");
                    if(fl == "locked")
                    {
                        response.flag = false;
                        response.IsAttemptsExceeded = true;
                        response.message = "You have exceeded the attempts. Your account has been locked.! Contact your admin";
                        return response;
                    }
                    else
                    {
                        response.flag = false;
                        response.IsInvalidPassword = true;
                        response.message = "Invalid Password";
                        response.Token = "";
                        return response;
                    }
                    
                }
                
                
            }
            var fs = await AuthRepo.UpdateLoginData(_loginDto, "success");
            if (fs == "expired")
            {
                response.flag = false;
                response.IsPasswordExpired = true;
                response.message = "Your Password is expired. Please change your password to continue";
                return response;
            }
            var role = await AuthRepo.GetRole(user.UserId);
            string token = CreateToken(user, role);
            if(role == "Mears-Admin" || role == "Spire-Admin")
            {
                response.IsAdmin = true;
            }else
            {
                response.IsAdmin = false;
            }
            response.Token = token;
            response.Id = user.UserId;
            response.userName = user.Email;
            response.IsNewUser = user.isNewlyGeneratedAccount ?? false;
            response.message = "Logged in successfully";
            return response;
        }
        private void SendEmail(string password, string Email, string UserName)
        {
            try
            {
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse("testcrewlink@gmail.com"));
                email.To.Add(MailboxAddress.Parse(Email));
                email.Subject = "Password";
                email.Body = new TextPart(MimeKit.Text.TextFormat.Html)
                {
                    Text = "<p>Hi " +UserName +"," + "</p><p>Your password is <strong style=\"font-weight:700; font-size:125%\">" + password.ToString() + "</strong></p><p>This Password is confidential.</p><p>Please do not share it with anyone.</p> <p>Please change the password after logging in.</p></p>"
                };
                using var smtp = new SmtpClient();
                smtp.Connect("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
                var Password = GetDecryptedPassword("CWVbObVP6GxuSH57L7Mkeg==");
                smtp.Authenticate("testcrewlink@gmail.com", "jbysygiywhbedtpq");
                smtp.Send(email);
                smtp.Disconnect(true);
            }catch(Exception ex)
            {
                throw new Exception(ex.ToString());
            }
            
             
        }
        private bool ValidatePassword(string Password, byte[] passwordSalt, byte[] passwordHash)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computeHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(Password));
                return computeHash.SequenceEqual(passwordHash);

            }
            // return true;
        }
        private string CreateToken(User userDto, string role)
        {
            try
            {
                List<Claim> claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, userDto.UserName),
                    new Claim(ClaimTypes.Role, role),
                    new Claim("UserId", userDto.UserId.ToString())

                };
                var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(Configuration["JwtSettings:Token"]));
                var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
                var token = new JwtSecurityToken(
                    issuer: Configuration["JwtSettings:Issuer"],
                    audience: Configuration["JwtSettings:Audience"],
                    claims: claims,
                    signingCredentials: credentials,
                    expires: DateTime.Now.AddDays(1));
                var jwt = new JwtSecurityTokenHandler().WriteToken(token);
                return jwt;
                // return String.Empty;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }

        }
        private void CreatePasswordHash(out string Password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            StringBuilder resultStringBuilder = new StringBuilder();
            int len = dictionaryString.Length;
            var random = new Random();

            for (int i = 0; i < 12; i++)
            {

                resultStringBuilder.Append(dictionaryString[random.Next(len)]);
            }
            string ss = resultStringBuilder.ToString();
            var sflag = false;
            for (int i = 0; i < Salphabets.Length; i++)
            {
                var j = ss.IndexOf(Salphabets[i]);
                if (j > 0)
                {
                    sflag = true;
                }
            }
            if (!sflag)
            {
                resultStringBuilder.Append(Salphabets[random.Next(Salphabets.Length)]);
            }
            ss = resultStringBuilder.ToString();
            var cflag = false;
            for (int i = 0; i < Calphabets.Length; i++)
            {
                var j = ss.IndexOf(Calphabets[i]);
                if (j > 0)
                {
                    cflag = true;
                }
            }
            if (!cflag)
            {
                resultStringBuilder.Append(Calphabets[random.Next(Calphabets.Length)]);
            }
            ss = resultStringBuilder.ToString();
            var NFlag = false;
            for (int i = 0; i < Numbers.Length; i++)
            {
                var j = ss.IndexOf(Numbers[i]);
                if (j > 0)
                {
                    NFlag = true;
                }
            }
            if (!NFlag)
            {
                resultStringBuilder.Append(Numbers[random.Next(Numbers.Length)]);
            }
            ss = resultStringBuilder.ToString();
            var SpecialFlag = false;
            for (int i = 0; i < sChar.Length; i++)
            {
                var j = ss.IndexOf(sChar[i]);
                if (j > 0)
                {
                    SpecialFlag = true;
                }
            }
            if (!SpecialFlag)
            {
                resultStringBuilder.Append(sChar[random.Next(sChar.Length)]);
            }
            Password = resultStringBuilder.ToString();
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(Password));
            }
        }

        private void createSaltAndHash(string password, out byte[] passwordSalt, out byte[] passwordHash)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private string GetDecryptedPassword(string encryptedString)
        {
            var decryptValue = _crypto.Decryption(encryptedString);
            return decryptValue;
        }
    }
}
