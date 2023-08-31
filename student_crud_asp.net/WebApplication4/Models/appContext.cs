using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;


namespace WebApplication4.Models
{
    public class appContext : DbContext
    {
        public appContext() :base("name-appContext")
        { 
            
        }
        public DbSet<Student> Student_data { get; set; }
    
    }
}