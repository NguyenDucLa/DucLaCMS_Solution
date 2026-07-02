using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class OrderDetailController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderDetailController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // Lấy danh sách chi tiết đơn hàng, kèm thông tin Sản phẩm để hiện tên
            var details = _context.OrderDetails
                .Include(od => od.Product)
                .Include(od => od.Order)
                .ToList();
            return View(details);
        }
    }
}