using CustomerPortal.Services.Core.Models;
using CustomerPortal.Services.Core.Responses.Auth;
using Microsoft.AspNetCore.Mvc;
using static CustomerPortal.Services.Controllers.AuthController;

namespace CustomerPortal.Services.Controllers.Helper.Auth
{
    public interface IAuthHelper
    {
        ActionResult ValidateLogin(LoginResponse response);
        ActionResult ValidateReset(User user, ResetPasswordResponse response);
        ActionResult ValidateChangePassword(ChangePasswordResponse response);

    }
}
