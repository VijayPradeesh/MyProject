namespace CustomerPortal.Services.Core
{
    public sealed class Configuration
    {
        private static readonly Lazy<Configuration> _instance = new Lazy<Configuration>(new Configuration());
        private static string? connectionString;
        private static string? Filepath;
        private static readonly object obj = new object();
        private Configuration()
        {
        }
        public static Configuration GetInstance()
        {
            // avoiding concurrency and making it thread safe
            lock (obj)
            {
                return _instance.Value;
            }
            
        }
        
        public  string GetConnectionString()
        {
            // avoiding concurrency and making it thread safe
            lock(obj)
            {
                return connectionString;
            }
            
        }

        public string? GetFilePath()
        {
            // avoiding concurrency and making it thread safe
            lock (obj)
            {
                return Filepath;
            }

        }

        public  void SetConnectionString(string ConString)
        {
            // avoiding concurrency and making it thread safe
            lock (obj)
            {
                connectionString = ConString;
            }
            
        }

        public void SetFilePath(string filepath)
        {
            // avoiding concurrency and making it thread safe
            lock (obj)
            {
                Filepath = filepath;
            }

        }
    }
}
