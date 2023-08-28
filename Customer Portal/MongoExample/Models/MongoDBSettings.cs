namespace MongoExample.Models;

public class MongoDBSettings
{
	public string ConnectionURI { get; set; } = null!;
	public string DataBaseName { get; set; } = null!;
	public string CollectionName { get; set; } = null!;

}