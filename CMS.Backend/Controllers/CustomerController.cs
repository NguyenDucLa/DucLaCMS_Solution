using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // Lấy toàn bộ danh sách khách hàng từ Database
            var customers = _context.Customers.ToList();
            return View(customers);
        }

        // GET: Hiển thị đơn hàng của một khách hàng
        public IActionResult Orders(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null) return NotFound();

            var orders = _context.Orders
                .Where(o => o.CustomerId == id)
                .Include(o => o.Customer)
                .OrderByDescending(o => o.OrderDate)
                .ToList();

            ViewBag.CustomerName = customer.FullName;
            return View(orders);
        }

        // POST: Xóa khách hàng
        [HttpPost]
        public IActionResult Delete(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer != null)
            {
                // Kiểm tra xem khách hàng có đơn hàng không
                var hasOrders = _context.Orders.Any(o => o.CustomerId == id);
                if (hasOrders)
                {
                    TempData["Error"] = "Không thể xóa khách hàng này vì có đơn hàng liên quan.";
                    return RedirectToAction("Index");
                }

                _context.Customers.Remove(customer);
                _context.SaveChanges();
                TempData["Success"] = "Xóa khách hàng thành công!";
            }
            return RedirectToAction("Index");
        }
    }
}