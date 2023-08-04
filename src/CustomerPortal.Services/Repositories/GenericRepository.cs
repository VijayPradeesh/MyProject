using CustomerPortal.Services.Core.ApplicationDbContext;
using Microsoft.EntityFrameworkCore;

namespace CustomerPortal.Services.Repositories
{
    public class GenericRepository : IGenericRepository
    {
        
        public GenericRepository(CustomerPortalDbContext dbContext)
        {
            DbContext = dbContext;
           

        }

        public CustomerPortalDbContext DbContext { get; }

        public DbSet<TEntity> Get<TEntity>() where TEntity : class
        {
            return DbContext.Set<TEntity>();
        }

        public async Task Add<TEntity>(TEntity entity) where TEntity : class
        {
            await DbContext.AddAsync(entity);
        }

        public void Update<TEntity>(TEntity entity) where TEntity : class
        {
             DbContext.Update<TEntity>(entity);
           
        }

        public async Task CommitAsync()
        {
             await DbContext.SaveChangesAsync();
        }

        
    }


}
