namespace WebApplication4.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addingStudentRecord : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Students",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        student_name = c.String(nullable: false, maxLength: 30),
                        address = c.String(nullable:false, maxLength:100),
                        parent_name = c.String(nullable:false, maxLength:30),
                        DOB = c.DateTime(nullable: false),
                        grade = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Students");
        }
    }
}
