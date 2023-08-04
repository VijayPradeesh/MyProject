using CustomerPortal.Services.Core.DataTransferObjects;
using CustomerPortal.Services.Core.Responses.Tutorials;

namespace CustomerPortal.Services.Services.Turorials
{
    public class TutorialsService : ITutorialsService
    {
        public List<TutorialResponse> GetFiles(TutorialsDto tutorialsDto)
        {
            var obj = Configuration.GetInstance();
            var response = new List<TutorialResponse>();
            tutorialsDto.assignFolder();

            DirectoryInfo d = new DirectoryInfo(obj.GetFilePath() +"\\" + tutorialsDto.Company + "\\" + tutorialsDto.Folder);

            bool folderExistsD = Directory.Exists(obj.GetFilePath() + "\\" + tutorialsDto.Company + "\\" + tutorialsDto.Folder);
           

            DirectoryInfo e = new DirectoryInfo(obj.GetFilePath() + "\\Common\\" + tutorialsDto.Folder);
            bool folderExistsE = Directory.Exists(obj.GetFilePath() + "\\Common\\" + tutorialsDto.Folder);

            //Getting files
            if (folderExistsD)
            {
                FileInfo[] Files = d.GetFiles();
                foreach (FileInfo file in Files)
                {
                    response.Add(new TutorialResponse
                    {
                        Filepath = tutorialsDto.Company + "/" + tutorialsDto.Folder + "/" + file.Name,
                        FileName = file.Name,
                        ModifiedDate = file.LastWriteTime,
                        Name = Path.GetFileNameWithoutExtension(file.Name)
                    });
                }
            }
            
            if(folderExistsE)
            {
                FileInfo[] files = e.GetFiles();
                // Files = Files.Concat(files).ToArray();
                foreach (FileInfo file in files)
                {
                    response.Add(new TutorialResponse
                    {
                        Filepath = "Common/" + tutorialsDto.Folder + "/" + file.Name,
                        FileName = file.Name,
                        ModifiedDate = file.LastWriteTime,
                        Name = Path.GetFileNameWithoutExtension(file.Name)
                    });
                }
            }
            
            return response.OrderBy(x=>x.FileName).ToList();
        }
    }
}
