using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.AccountUser;

namespace CustomerPortal.Services.Validations.AccountUser
{
    public class EditUserDataValidations : IEditUserDataValidations
    {
        public  EditUserResponse ValidateUserData(EditUserDto _editUserDto, EditUserResponse response)
        {
            response.status = true;
            if(_editUserDto.Email == null || _editUserDto.Email == "")
            {
                response.status = false;
                response.message = "Email is required";
            }
            if(_editUserDto.FirstName == null || _editUserDto.FirstName == "")
            {
                response.status = false;
                response.message = "First Name is required";
            }
            if (_editUserDto.LastName == null || _editUserDto.LastName == "")
            {
                response.status = false;
                response.message = "Last Name is required";
            }
            if (_editUserDto.TypeId == null || _editUserDto.TypeId == 0)
            {
                response.status = false;
                response.message = "Organiation is required";
            }
            if(_editUserDto.Region.Count == 0 || _editUserDto.Region.Any(x=>x.Id == 0))
            {
                response.status = false;
                response.message = "Region is required";
            }
            if (_editUserDto.RoleId == null || _editUserDto.RoleId == 0)
            {
                response.status = false;
                response.message = "Role is required";
            }
            return  response;
        }
    }
}
