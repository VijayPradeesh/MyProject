using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication4.Models;

namespace WebApplication4.Controllers
{
    public class StudentController : Controller
    {
        private appContext _context;

        public StudentController()
        {
            _context = new Models.appContext();
        }
        // GET: Student
        public ActionResult StudentList()
        {
            var studentList = _context.Student_data.ToList();
            
            return View(studentList);
        }

        public ActionResult studentInfo()
        {
            return View(new Student {id=0 });
        }
        [ValidateAntiForgeryToken]
        public ActionResult saveInfo(Student student)//whatever the data passed in the form is sent here ti initialise the student object..this is called model binding 
        {
            if (!ModelState.IsValid) 
            {
                return View("studentInfo",student);
            }

            if (student.id == 0)// id=0 means add new customer to the database
            {
                _context.Student_data.Add(student);
            }
            else 
            {
                var infoFromDb = _context.Student_data.FirstOrDefault(e => e.id == student.id);

                if (infoFromDb == null)
                {
                    return HttpNotFound();
                }

                infoFromDb.student_name = student.student_name;
                infoFromDb.parent_name = student.parent_name;
                infoFromDb.DOB = student.DOB;
                infoFromDb.address = student.address;
                infoFromDb.grade = student.grade;
            }

            _context.SaveChanges();

            return RedirectToAction("StudentList");
        }

        public ActionResult Edit(int? id) 
        {
            if (id == null) 
            {
                return HttpNotFound();
            }

            var student = _context.Student_data.SingleOrDefault(e => e.id == id);//firstorDefault is similar to that of select top 3*

            if (student == null)
            {
                return HttpNotFound();
            }

            return View("studentInfo",student);
        }
        public ActionResult Delete(int id) 
        {
            
            var student = _context.Student_data.SingleOrDefault(e => e.id == id);

            if (student == null) 
            {
                return HttpNotFound();
            }
            _context.Student_data.Remove(student);
            _context.SaveChanges();
            return  RedirectToAction("studentList");
        }
        public ActionResult Details(int id)
        {
            var student = _context.Student_data.SingleOrDefault(c => c.id == id);

            if (student == null) { return HttpNotFound(); }

            return View(student);
        }

        protected override void Dispose(bool disposing)
        {
            _context.Dispose();
        }
    }
}