using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using Microsoft.EntityFrameworkCore; // Cần dòng này để dùng .Include
using System.Linq;

namespace CMS.Backend.Controllers
{
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
    }
}