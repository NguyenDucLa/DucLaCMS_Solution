using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // Lấy danh sách sản phẩm và kèm theo thông tin Danh mục của nó
            var products = _context.Products.Include(p => p.CategoryProduct).ToList();
            return View(products);
        }

        // GET: Product/Create
        [HttpGet]
        public IActionResult Create()
        {
            // Đổ danh sách CategoryProduct vào ViewBag để hiển thị dropdown
            ViewBag.CategoryProductList = new SelectList(_context.CategoriesProducts, "Id", "Name");
            return View();
        }

        // POST: Product/Create (Xử lý lưu sản phẩm mới)
        [HttpPost]
        public IActionResult Create(Product model, IFormFile? uploadImage)
        {
            // Xử lý upload ảnh nếu có file được chọn
            if (uploadImage != null && uploadImage.Length > 0)
            {
                // 1. Định nghĩa đường dẫn lưu file: wwwroot/uploads
                string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

                // Tạo thư mục nếu chưa tồn tại
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                // 2. Tạo tên file duy nhất để không bị đè dữ liệu
                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                string filePath = Path.Combine(folder, fileName);

                // 3. Chép file vào thư mục
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }

                // 4. Lưu đường dẫn vào CSDL để sau này hiển thị
                model.ImageUrl = "/uploads/" + fileName;
            }

            // Lưu sản phẩm vào Database
            _context.Products.Add(model);
            _context.SaveChanges();

            // Sau khi lưu thành công, quay về trang danh sách
            return RedirectToAction("Index");
        }

        // GET: Product/Edit/5
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound();

            // Đổ danh sách CategoryProduct vào ViewBag để hiển thị dropdown
            ViewBag.CategoryProductList = new SelectList(_context.CategoriesProducts, "Id", "Name", product.CategoryProductId);
            return View(product);
        }

        // POST: Product/Edit/5 (Xử lý cập nhật sản phẩm)
        [HttpPost]
        public IActionResult Edit(Product model, IFormFile? uploadImage)
        {
            // Xử lý upload ảnh mới nếu có
            if (uploadImage != null && uploadImage.Length > 0)
            {
                string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }

                model.ImageUrl = "/uploads/" + fileName;
            }

            // Cập nhật đối tượng vào bộ nhớ tạm
            _context.Products.Update(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // POST: Product/Delete/5 (Xử lý xóa sản phẩm)
        [HttpPost]
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);
            if (product != null)
            {
                _context.Products.Remove(product);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}