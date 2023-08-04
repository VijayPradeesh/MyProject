namespace CustomerPortal.Services.Core.DataTransferObjects
{
    public class TutorialsDto
    {
       
        public long UserId { get; set; }
        public string Company { get; set; }
        public string Folder { get; set; }

        public bool flag { get; set; }

        public void assignFolder()
        {
            if(this.flag)
            {
                this.Folder = "Videos";
            }else
            {
                this.Folder = "Documents";
            }
        }


    }
}
