using CustomerPortal.Services.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace CustomerPortal.Services.Core.ApplicationDbContext
{
    public class CustomerPortalDbContext : DbContext
    {
        public CustomerPortalDbContext(DbContextOptions options) : base(options)
        {

        }
        public DbSet<User> Users { get; set; }

        public DbSet<User_Role> UserRole { get; set; }
        public DbSet<User_Type> UserType { get; set; }

        public DbSet<PasswordHistory> PasswordHistory { get; set; }

        public DbSet<Job_Status> JobStatus { get; set; }
        public DbSet<Job> Job { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>();
            modelBuilder.ApplyConfiguration(new UserConfiguration());

            modelBuilder.Entity<User_Type>();
            modelBuilder.ApplyConfiguration(new UserTypeConfiguration());

            modelBuilder.Entity<User_Role>();
            modelBuilder.ApplyConfiguration(new UserRoleConfiguration());

            modelBuilder.Entity<PasswordHistory>();
            modelBuilder.ApplyConfiguration(new PasswordHistoryConfiguration());

            modelBuilder.Entity<Job_Status>();
            modelBuilder.ApplyConfiguration(new JobStatusConfiguration());

            modelBuilder.Entity<Job>();
            modelBuilder.ApplyConfiguration(new JobConfiguration());



        }
    }
}
