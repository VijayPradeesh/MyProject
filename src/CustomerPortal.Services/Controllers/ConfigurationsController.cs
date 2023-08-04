using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Services.Configurations;
using CustomerPortal.Services.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CustomerPortal.Services.Services.ErrorLogging;
using CustomerPortal.Services.Core.Responses.Configurations;

namespace CustomerPortal.Services.Controllers
{
    [Route("customerPortal/[controller]")]
    [ApiController]
    public class ConfigurationsController : ControllerBase
    {
        public ConfigurationsController(IConfigurationService configurationService, IErrorLogging errorLogging)
        {
            ConfigurationService = configurationService;
            ErrorLogging = errorLogging;
        }

        public IConfigurationService ConfigurationService { get; }
        public IErrorLogging ErrorLogging { get; }

        [HttpGet]
        [Route("GetAllOrganisations")]
        [Authorize]
        public async Task<ActionResult> GetOrganisations(bool flag)
        {
            try
            {
                var organizations = await ConfigurationService.GetOrganisations(flag);
                return StatusCode(200, organizations);
            }
            catch(Exception ex)
            {
                var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                await ErrorLogging.AddErrorLogging("500", controllerName, innerException, ex, ex.Message.ToString());
                return StatusCode(500, ErrorMessages.ServerError);
            }
            
        }

        [HttpGet]
        [Route("GetAllContracts/{Id}")]
        [Authorize]
        public async Task<ActionResult> GetContracts(long Id)
        {
            try
            {
                var response = await ConfigurationService.GetContracts(Id);
                return StatusCode(200, response);
            }
            catch(Exception ex)
            {
                var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                await ErrorLogging.AddErrorLogging("500", controllerName, innerException, ex, ex.Message.ToString());
                return StatusCode(500, ErrorMessages.ServerError);
            }
        }

        [HttpPost]
        [Authorize]
        [Route("GetAllRegions")]
        public async Task<ActionResult> GetAllRegions(GetAllRegionsDto getAllRegionsDto)
        {
            try
            {
                var response = await ConfigurationService.GetAllRegions(getAllRegionsDto.Contract);
                return StatusCode(200, response);

            }catch(Exception ex)
            {
                var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                await ErrorLogging.AddErrorLogging("500", controllerName, innerException, ex, ex.Message.ToString());
                return StatusCode(500, ErrorMessages.ServerError);
            }
        }

        [HttpGet]
        [Route("GetRoles/{Id}")]
        [Authorize]
        public async Task<ActionResult> GetRoles(long Id)
        {
            try
            {
                var response = await ConfigurationService.GetRoles(Id);
                return Ok(response);
            }catch(Exception ex)
            {
                var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                await ErrorLogging.AddErrorLogging("500", controllerName, innerException, ex, ex.Message.ToString());
                return StatusCode(500, ErrorMessages.ServerError);
            }
            
        }

        [HttpPost]
        [Route("AddNew")]
        [Authorize]
        public async Task<ActionResult> AddNew(AddNewInLookUp addnew)
        {
            try
            {
                addnew.UserId = Convert.ToInt64(HttpContext.User.FindFirst("UserId").Value);
                var response =  await ConfigurationService.AddNewInLookUp(addnew);
                if(response.status == true)
                {
                    return Ok(response);
                }
                return StatusCode(500, response);
                
            }catch(Exception ex)
            {
                var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                await ErrorLogging.AddErrorLogging("500", controllerName, innerException, ex, ex.Message.ToString());
                return StatusCode(500, ErrorMessages.ServerError);
            }
            
        }

        [HttpPost]
        [Route("GetAllScreens")]
        [Authorize]
        public async Task<ActionResult> GetAllScreens(ScreensDto _screensDto)
        {
            try
            {
                var data = await ConfigurationService.GetAllScreens(_screensDto);
                return Ok(data);
            }catch(Exception ex)
            {
                var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                await ErrorLogging.AddErrorLogging("500", controllerName, innerException, ex, ex.Message.ToString());
                return StatusCode(500, ErrorMessages.ServerError);
            }
            
        }

        [HttpPost]
        [Route("PostContract")]
        [Authorize]
        public async Task<ActionResult> PostContract(PostContractDto postContractDto)
        {
            try
            {
                postContractDto.UserId = Convert.ToInt64(HttpContext.User.FindFirst("UserId").Value);
                var response = await ConfigurationService.PostContract(postContractDto);
                if(response.status == false)
                {
                    return StatusCode(500, response);
                }
                return Ok(response);
            }catch(Exception ex)
            {
                var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                await ErrorLogging.AddErrorLogging("500", controllerName, innerException, ex, ex.Message.ToString());
                return StatusCode(500, ErrorMessages.ServerError);
            }
        }

        [HttpPost]
        [Route("PostRegion")]
        [Authorize]
        public async Task<ActionResult> PostRegion(PostRegion postRegion)
        {
            try
            {
                postRegion.UserId = Convert.ToInt64(HttpContext.User.FindFirst("UserId").Value);
                var response =await ConfigurationService.PostRegion(postRegion);
                if(response.status)
                {
                    return Ok(response);
                }
                return StatusCode(500, response);
                
            }catch(Exception ex)
            {
                var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                await ErrorLogging.AddErrorLogging("500", controllerName, innerException, ex, ex.Message.ToString());
                return StatusCode(500, ErrorMessages.ServerError);
            }
        }

        [HttpPost]
        [Route("PostRole")]
        [Authorize]

        public async Task<ActionResult> PostRole(PostRoleDto postRoleDto)
        {
            try
            {
                postRoleDto.UserId = Convert.ToInt64(HttpContext.User.FindFirst("UserId").Value);
                var response = await ConfigurationService.PostRole(postRoleDto);
                if (response.status)
                {
                    return Ok(response);
                }
                return StatusCode(500, response);
            }catch(Exception ex)
            {
                var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                await ErrorLogging.AddErrorLogging("500", controllerName, innerException, ex, ex.Message.ToString());
                return StatusCode(500, ErrorMessages.ServerError);
            }
        }

        [HttpPost]
        [Route("PostScreen")]
        [Authorize]
        public async Task<ActionResult> PostScreen(PostScreensDto postScreenDto)
        {
            try
            {
                postScreenDto.UserId = Convert.ToInt64(HttpContext.User.FindFirst("UserId").Value);
                var response = await ConfigurationService.PostScreen(postScreenDto);
                if (response.status)
                {
                    return Ok(response);
                }
                return StatusCode(500, response);
            }
            catch (Exception ex)
            {
                var controllerName = ControllerContext.ActionDescriptor.ControllerName + "-" + ControllerContext.ActionDescriptor.ActionName;
                var innerException = ex.InnerException == null ? "" : ex.InnerException.ToString();
                await ErrorLogging.AddErrorLogging("500", controllerName, innerException, ex, ex.Message.ToString());
                return StatusCode(500, ErrorMessages.ServerError);
            }
            
        }

    }
}
