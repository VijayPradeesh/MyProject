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
                changePasswordResponse.Message = ErrorMessages.UserNotFound; // "User doesn't exist";
                return changePasswordResponse;
            }
            else
            {
                if(_changePasswordDto.UserId != user.UserId)
                {
                    changePasswordResponse.IsInvalidUser = true;
                    changePasswordResponse.Status = false;
                    changePasswordResponse.Message = ErrorMessages.InvalidUser; // "Invalid User";
                    return changePasswordResponse;
                }
                else if(user.IsActive == false)
                {
                    changePasswordResponse.IsActiveUser = false;
                    changePasswordResponse.Status = false;
                    changePasswordResponse.Message = ErrorMessages.InActiveUser; // "User is inactive";
                    return changePasswordResponse;
                }
                else if(user.IsLockOut == true)
                {
                    changePasswordResponse.IsUserLockedOut = true;
                    changePasswordResponse.Status = false;
                    changePasswordResponse.Message = ErrorMessages.LockedOut; // "User is locked out";
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
                        changePasswordResponse.Message = ErrorMessages.PasswordAlreadyExists; // "Password already exists, Please try another password";
                        return changePasswordResponse;
                    }
                    else
                    {
                        await AuthRepo.UpdateUserAndPasswordHistory(user, passwordSalt, passwordHash, user.UserId, null);
                        changePasswordResponse.Message = ErrorMessages.PasswordChangedSuccessfully; // "Password Changed Successfully";
                        return changePasswordResponse;
                    }
                }
            }
            return changePasswordResponse;
        }
        public async Task<ResetPasswordTempDto> ResetPassword(ResetPasswordDto _resetPasswordDto)
        {
            CreatePasswordHash(out string password, out byte[] PasswordHash, out byte[] PasswordSalt);
            var user =  await AuthRepo.ResetPassword(_resetPasswordDto, PasswordSalt, PasswordHash);
            var rstdto = new ResetPasswordTempDto();
            rstdto = null;
            if (user != null)
            {
                 rstdto = new ResetPasswordTempDto();
                rstdto.Password = password;
                rstdto.IsLockedOut = user.IsLockOut;
                rstdto.IsActive = user.IsActive;
                rstdto.IsForgetPassword = user.ForgetPassword;
                // SendEmail(password, user.Email, user.UserName);
                return rstdto;
            }
            return rstdto;
        }
        public async Task<RegisterResponse> Register(RegisterDto _userDto, RegisterResponse response)
        {
            CreatePasswordHash(out string password, out byte[] PasswordHash, out byte[] PasswordSalt);
            response =await AuthRepo.RegisterUser(_userDto, PasswordHash, PasswordSalt, response);
            if(response.Status == true)
            {
                response.Password = password;
            }
            // SendEmail(password, _userDto.Email, _userDto.FirstName + " " + _userDto.LastName);
            
            return response;
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
                response.message = ErrorMessages.UserNotFound; // "User Not Found";
                response.Token =  "NUF";
                return response;
            }
            else
            {
                if (user.IsActive == false)
                {
                    response.flag = false;
                    response.IsActiveUser = false;
                    response.message = ErrorMessages.InActiveUser; // "User is Inactive";
                    return response;
                }
                if (user.IsLockOut == true)
                {
                    TimeSpan xx = (TimeSpan)(DateTime.Now - user.LoginFailedOn);
                    if(!(xx.TotalMinutes >= 360))
                    {
                        response.flag = false;
                        response.IsLockedOut = true;
                        response.message = ErrorMessages.LockedOut; // "User account is locked out";
                        return response;
                    }
                }
                if (!ValidatePassword(_loginDto.Password, user.passwordSalt, user.passwordHash))
                {
                    var fl = await AuthRepo.UpdateLoginData(_loginDto, "fail");
                    if(fl == "locked")
                    {
                        response.flag = false;
                        response.IsAttemptsExceeded = true;
                        response.message = ErrorMessages.AttemptsExceeded; // "You have exceeded the attempts. Your account has been locked.! Contact your admin";
                        return response;
                    }
                    else
                    {
                        response.flag = false;
                        response.IsInvalidPassword = true;
                        response.message = ErrorMessages.InvalidPassword; // "Invalid Password";
                        response.Token = "";
                        return response;
                    }
                    
                }
                
                
            }
            var fs = await AuthRepo.UpdateLoginData(_loginDto, "success");
            var role = await AuthRepo.GetRole(user.UserId);
            response.Screens = await AuthRepo.GetAllScreens(role[0].TypeId, role[0].RoleId);
            var organisation = role.Select(x => x.Type).DistinctBy(x => x).FirstOrDefault();
            var rl = role.Select(x => x.Role).DistinctBy(x => x).ToList();
            // var str = String.Join(",", rl.ToArray());
            string token = CreateToken(user, rl, user.UserName, organisation);
            response.Token = token;
            if (fs == "expired")
            {
                response.flag = false;
                response.IsPasswordExpired = true;
                response.message = ErrorMessages.PasswordExpired; // "Your Password is expired. Please change your password to continue";

                return response;
            }
            response.IsNewUser = user.isNewlyGeneratedAccount ?? false;
            response.message = ErrorMessages.LoggedInSuccessfully; // "Logged in successfully";
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
        private string CreateToken(User userDto, List<string> role, string username, string organisation)
        {
                var str = String.Join(",", role.ToArray());
                var rx = role.Find(x=>x == "Admin");
                var flag = false;
                if (rx != null)
                {
                    flag = true;
                }
                List<Claim> claims = new List<Claim>
                {
                    new Claim("UserName", username),
                    new Claim("Role", str),
                    new Claim("Email", userDto.Email),
                    new Claim("UserId", userDto.UserId.ToString()),
                    new Claim("IsAdmin", flag.ToString()),
                    new Claim("Organization", organisation),
                    new Claim(ClaimTypes.Role, str)
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
        }
        private void CreatePasswordHash(out string Password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            StringBuilder resultStringBuilder = new StringBuilder();
            int len = dictionaryString.Length;
            var random = new Random();

            for (int i = 0; i < 16; i++)
            {

                resultStringBuilder.Append(dictionaryString[random.Next(len)]);
            }
            string ss = resultStringBuilder.ToString();
            if (!CreatePassword(ss, Salphabets, resultStringBuilder))
            {
               ss = resultStringBuilder.Append(Salphabets[random.Next(Salphabets.Length)]).ToString();
            }
            // ss = resultStringBuilder.ToString();
            if (!CreatePassword(ss, Calphabets, resultStringBuilder))
            {
               ss=  resultStringBuilder.Append(Calphabets[random.Next(Calphabets.Length)]).ToString();
            }
            // ss = resultStringBuilder.ToString();
            if (!CreatePassword(ss, Numbers, resultStringBuilder))
            {
               ss=  resultStringBuilder.Append(Numbers[random.Next(Numbers.Length)]).ToString();
            }
            // ss = resultStringBuilder.ToString();
            if (!CreatePassword(ss, sChar, resultStringBuilder))
            {
               ss=  resultStringBuilder.Append(sChar[random.Next(sChar.Length)]).ToString();
            }
            Password = ss;
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

        public bool CreatePassword(string ss , string sh,StringBuilder resultStringBuilder)
        {
            var random = new Random();
            var sflag = false;
            for (int i = 0; i < sh.Length; i++)
            {
                var j = ss.IndexOf(sh[i]);
                if (j > 0)
                {
                    sflag = true;
                }
            }
            return sflag;
        }
    }
}
