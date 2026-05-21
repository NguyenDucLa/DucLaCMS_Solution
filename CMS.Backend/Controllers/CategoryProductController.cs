using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
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
    }
}