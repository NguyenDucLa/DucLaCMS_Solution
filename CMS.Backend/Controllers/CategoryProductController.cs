using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Hàm khởi tạo để lấy kết nối Database
        public CategoryProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // Lấy dữ liệu từ bảng CategoriesProducts trong SQL
            var data = _context.CategoriesProducts.ToList();
            return View(data);
        }

        // GET: CategoryProduct/Create
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // POST: CategoryProduct/Create
        [HttpPost]
        public IActionResult Create(CategoryProduct model)
        {
            _context.CategoriesProducts.Add(model);
            _context.SaveChanges();

            TempData["Success"] = "Đã thêm danh mục \"" + model.Name + "\" thành công!";
            return RedirectToAction("Index");
        }

        // GET: CategoryProduct/Edit/5
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var category = _context.CategoriesProducts.Find(id);
            if (category == null) return NotFound();

            return View(category);
        }

        // POST: CategoryProduct/Edit/5
        [HttpPost]
        public IActionResult Edit(CategoryProduct model)
        {
            _context.CategoriesProducts.Update(model);
            _context.SaveChanges();

            TempData["Success"] = "Đã cập nhật danh mục \"" + model.Name + "\" thành công!";
            return RedirectToAction("Index");
        }

        // POST: CategoryProduct/Delete/5
        [HttpPost]
        public IActionResult Delete(int id)
        {
            var category = _context.CategoriesProducts.Find(id);
            if (category != null)
            {
                _context.CategoriesProducts.Remove(category);
                _context.SaveChanges();

                TempData["Success"] = "Đã xóa danh mục \"" + category.Name + "\" thành công!";
            }

            return RedirectToAction("Index");
        }
    }
}