using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.AccountUser;

namespace CustomerPortal.Services.Validations.AccountUser
{
    public class EditUserDataValidations : IEditUserDataValidations
    {
        public  EditUserResponse ValidateUserData(EditUserDto _editUserDto, EditUserResponse response)
        {
            response.status = true;
            if(_editUserDto.Email == "" || _editUserDto.Email == null)
            {
                response.status = false;
                response.message = "Email is required";
            }
            return  response;
        }
    }
}
