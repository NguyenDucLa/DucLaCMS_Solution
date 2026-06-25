using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// API: Tiếp nhận đơn đặt hàng từ giỏ hàng FrontEnd gửi lên
        /// Đường dẫn: POST https://localhost:xxxx/api/Orders
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CheckoutInputDTO input)
        {
            if (input == null || input.Customer == null || input.Items == null || input.Items.Count == 0)
            {
                return BadRequest(new { message = "Dữ liệu đơn hàng không hợp lệ. Vui lòng điền đầy đủ thông tin." });
            }

            try
            {
                // Bước 1: Tìm hoặc tạo mới khách hàng
                var customer = _context.Customers
                    .FirstOrDefault(c => c.Email == input.Customer.Email);

                if (customer == null)
                {
                    customer = new Customer
                    {
                        FullName = input.Customer.FullName,
                        Email = input.Customer.Email,
                        Phone = input.Customer.Phone,
                        Address = input.Customer.Address,
                        Password = "temp" // Mật khẩu tạm cho khách vãng lai
                    };
                    _context.Customers.Add(customer);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    // Cập nhật thông tin nếu khách cũ
                    customer.FullName = input.Customer.FullName;
                    customer.Phone = input.Customer.Phone;
                    customer.Address = input.Customer.Address;
                }

                // Bước 2: Tạo đơn hàng mới
                var newOrder = new Order
                {
                    OrderDate = DateTime.Now,
                    CustomerId = customer.Id,
                    Status = 0,
                    Notes = input.Notes
                };
                _context.Orders.Add(newOrder);
                await _context.SaveChangesAsync();

                // Bước 3: Tạo chi tiết đơn hàng + cập nhật tồn kho
                foreach (var item in input.Items)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product == null)
                    {
                        return BadRequest(new { message = $"Sản phẩm ID {item.ProductId} không tồn tại" });
                    }
                    if (product.StockQuantity < item.Quantity)
                    {
                        return BadRequest(new { message = $"Sản phẩm \"{product.Name}\" không đủ hàng. Còn lại: {product.StockQuantity}" });
                    }

                    var detail = new OrderDetail
                    {
                        OrderId = newOrder.Id,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice > 0 ? item.UnitPrice : product.Price
                    };
                    _context.OrderDetails.Add(detail);

                    // Trừ tồn kho
                    product.StockQuantity -= item.Quantity;
                }
                await _context.SaveChangesAsync();

                return StatusCode(201, new
                {
                    message = "Đặt hàng thành công!",
                    orderId = newOrder.Id
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi xử lý tạo đơn hàng", detail = ex.Message });
            }
        }
    }

    // DTO: Thông tin khách hàng từ form Checkout
    public class CheckoutCustomerDTO
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
    }

    // DTO: Một sản phẩm trong giỏ hàng
    public class CheckoutItemDTO
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }

    // DTO: Toàn bộ dữ liệu checkout từ Frontend
    public class CheckoutInputDTO
    {
        public CheckoutCustomerDTO Customer { get; set; } = new();
        public List<CheckoutItemDTO> Items { get; set; } = new();
        public string? Notes { get; set; }
    }
}
