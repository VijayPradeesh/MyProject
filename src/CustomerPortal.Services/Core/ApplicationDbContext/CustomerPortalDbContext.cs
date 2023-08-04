using CustomerPortal.Services.Core.Models;
using CustomerPortal.Services.Core.Views;
using Microsoft.EntityFrameworkCore;

namespace CustomerPortal.Services.Core.ApplicationDbContext
{
    public class CustomerPortalDbContext : DbContext
    {
        public CustomerPortalDbContext(DbContextOptions options) : base(options)
        {

        }
        public DbSet<User> Users { get; set; }
        public DbSet<RoleTypeMapping> UserRole { get; set; }
        public DbSet<PasswordHistory> PasswordHistory { get; set; }

        public DbSet<Job_Status> JobStatus { get; set; }
        public DbSet<Job> Job { get; set; }

        public DbSet<User_Role_Region_Mapping> UserRoleRegion { get; set; }
        public DbSet<RoleTypeMapping> RoleTypeMapping { get; set; }

        public DbSet<LookUp> LookUp { get; set; }
        public DbSet<JobStatusTracking> JobStatusTracking { get; set; }
        public DbSet<ContractRegionMapping> ContractRegionMapping { get; set; }
        public DbSet<JobPayItem> JobPayItem { get; set; }

        public DbSet<JobLabour> JobLabour { get; set; }

        public DbSet<JobEquipment> JobEquipment { get; set; }

        public DbSet<Comments> Comments { get; set; }
        public DbSet<Error_Logging> Error_Logging { get; set; }

        public DbSet<ReportGeneration> ReportGeneration { get; set; }

        public DbSet<TypeRoleScreenMapping> TypeRoleScreenMapping { get; set; }

        public DbSet<SewerCam> SewerCam { get; set; }
        public DbSet<SewerCamDetails> SewerCamDetails { get; set; }

        public DbSet<ResurfacingMaster> ResurfacingMaster { get; set; }

        public DbSet<ResurfacingRestored> ResurfacingRestored { get; set; }
        public DbSet<ResurfacingAdditionalMaterial> ResurfacingAdditionalMaterials { get; set; }
        public DbSet<ResurfacingDrawingImages> ResurfacingDrawingImages { get; set; }

        public DbSet<ResurfacingStatusTracking> resurfacingStatusTrackings { get; set; }

        public DbSet<ResurfacingReport> ResurfacingReport { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>();
            modelBuilder.ApplyConfiguration(new UserConfiguration());

            modelBuilder.Entity<PasswordHistory>();
            modelBuilder.ApplyConfiguration(new PasswordHistoryConfiguration());

            modelBuilder.Entity<Job_Status>();
            modelBuilder.ApplyConfiguration(new JobStatusConfiguration());

            modelBuilder.Entity<Job>();
            modelBuilder.ApplyConfiguration(new JobConfiguration());

            modelBuilder.Entity<User_Role_Region_Mapping>();
            modelBuilder.ApplyConfiguration(new User_Role_Region_MappingConfiguration());

            modelBuilder.Entity<RoleTypeMapping>();
            modelBuilder.ApplyConfiguration(new RoleTypeMappingConfiguration());

            modelBuilder.Entity<LookUp>();
            modelBuilder.ApplyConfiguration(new LookUpConfiguration());

            modelBuilder.Entity<JobStatusTracking>();
            modelBuilder.ApplyConfiguration(new JobStatusTrackingConfiguration());

            modelBuilder.Entity<ContractRegionMapping>();
            modelBuilder.ApplyConfiguration(new ContractRegionMappingConfiguration());

            modelBuilder.Entity<JobPayItem>();
            modelBuilder.ApplyConfiguration(new JobPayItemConfiguration());

            modelBuilder.Entity<JobLabour>();
            modelBuilder.ApplyConfiguration(new JoblabourConfiguration());

            modelBuilder.Entity<JobEquipment>();
            modelBuilder.ApplyConfiguration(new JobEquipmentConfiguration());

            modelBuilder.Entity<JobEquipment>();
            modelBuilder.ApplyConfiguration(new JobEquipmentConfiguration());

            modelBuilder.Entity<Comments>();
            modelBuilder.ApplyConfiguration(new CommentsConfiguration());

            modelBuilder.Entity<Error_Logging>();
            modelBuilder.ApplyConfiguration(new ErrorLoggingConfiguration());

            modelBuilder.Entity<ReportGeneration>();
            modelBuilder.ApplyConfiguration(new ReportGenerationConfiguration());

            modelBuilder.Entity<TypeRoleScreenMapping>();
            modelBuilder.ApplyConfiguration(new TypeRoleScreenMappingConfiguration());

                
            // SewerCam Configurations
            modelBuilder.Entity<SewerCam>();
            modelBuilder.ApplyConfiguration(new SewerCamConfiguration());

            modelBuilder.Entity<SewerCamDetails>();
            modelBuilder.ApplyConfiguration(new SewerCamDetailsConfiguration());

            // Configuring Resurfacing entities
            modelBuilder.Entity<ResurfacingMaster>();
            modelBuilder.ApplyConfiguration(new ResurfacingConfiguration());

            modelBuilder.Entity<ResurfacingRestored>();
            modelBuilder.ApplyConfiguration(new ResurfacingRestoredConfiguration());

            modelBuilder.Entity<ResurfacingAdditionalMaterial>();
            modelBuilder.ApplyConfiguration(new ResurfacingAdditionalMaterialConfiguration());

            modelBuilder.Entity<ResurfacingDrawingImages>();
            modelBuilder.ApplyConfiguration(new ResurfacingDrawingImagesConfiguration());

            modelBuilder.Entity<ResurfacingStatusTracking>();
            modelBuilder.ApplyConfiguration(new ResurfacingStatusTrackingConfiguration());

            modelBuilder.Entity<ResurfacingReport>();
            modelBuilder.ApplyConfiguration(new ResurfacingReportConfiguration());


        }
    }
}
