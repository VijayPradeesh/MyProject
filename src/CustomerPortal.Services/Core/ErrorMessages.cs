namespace CustomerPortal.Services.Core
{
    public static class ErrorMessages
    {
        #region Auth
        public static string ServerError = "Internal Server Error";

        public static string ExistingUser = "Username already taken";

        public static string InvalidRoleOrOrganization = "Invalid organization or Role";

        public static string NoRegionFound = "No region found";

        public static string UserNotFound = "User not found";

        public static string InActiveUser = "User is inactive";

        public static string LockedOut = "User account is locked out";

        public static string AttemptsExceeded = "You have exceeded the attempts. Your account has been locked.! Contact your admin";

        public static string InvalidPassword = "Invalid Password";

        public static string PasswordExpired = "Your Password is expired. Please change your password to continue";
        public static string LoggedInSuccessfully = "Logged in successfully";

        public static string RequestPassword = "Please contact the user to request for a password";

        public static string PasswordChangedSuccessfully = "Password changed successfully!";

        public static string InvalidUser = "Invalid User";

        public static string PasswordAlreadyExists = "Password already exists, Please try another password";

        public static string UserCreatedSuccessfully = "User created successfully";

        public static string RequestSent = "Request has been sent";

        public static string UserDetailsSaved = "User details updated successfully";
        #endregion Auth

        #region Configuration
        public static string CustomerDoesNotExists = "Customer does not exist";
        public static string ContractDoesNotExist = "Contract does not exist";
        public static string RegionDoesNotExists = "Region does not exist";
        public static string RegionAlreadyExist = "Region already exists";
        public static string RegionMappingDoesNotExist = "Region mapping does not exist";
        public static string RoleDoesNotExist = "Role does not exists";
        public static string RoleExistforCustomer = "This role already exists for this customer";
        public static string RoleNotExistsforCustomer = "This role is not assigned to this customer";
        public static string ScreenMappingExists = "Screen Mapping already exists";
        public static string ScreenMappingNotExists = "Screen Mapping does not exist";
        public static string NoCustomerContractMapping = "No data found for the respective Customer and Contract";
        public static string ContractExistsforCustomer = "This Contract already exists for this Customer";
        public static string DataSavedSuccessfully = "Data saved successfully";
        #endregion

    }
}
