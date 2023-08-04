using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.Tutorials;

namespace CustomerPortal.Services.Services.Turorials
{
    public interface ITutorialsService
    {
        List<TutorialResponse> GetFiles(TutorialsDto tutorialsDto);
    }

}
