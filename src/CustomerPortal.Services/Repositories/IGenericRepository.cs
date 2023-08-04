using Microsoft.EntityFrameworkCore;

namespace CustomerPortal.Services.Repositories
{
    public interface IGenericRepository
    {
        DbSet<TEntity> Get<TEntity>() where TEntity : class;

        void Update<TEntity>(TEntity entity) where TEntity : class;

        Task Add<TEntity>(TEntity entity) where TEntity : class;

        Task CommitAsync();
    }
}
