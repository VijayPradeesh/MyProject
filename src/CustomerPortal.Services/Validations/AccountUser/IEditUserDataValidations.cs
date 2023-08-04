using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.AccountUser;

namespace CustomerPortal.Services.Validations.AccountUser
{
    public interface IEditUserDataValidations
    {
        EditUserResponse ValidateUserData(EditUserDto _editUserDto, EditUserResponse response);
    }
}
