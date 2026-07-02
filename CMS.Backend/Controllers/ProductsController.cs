using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;

namespace CMS.Backend.Controllers
{
    // 1. Định nghĩa đường dẫn để gọi API. [controller] sẽ tự lấy tên là "Products"
    // Khi chạy, địa chỉ truy cập dữ liệu sẽ là: https://localhost:xxxx/api/products
    [Route("api/[controller]")]

    // 2. Đánh dấu đây là một API Controller để hệ thống hỗ trợ các tính năng tự động kiểm tra dữ liệu đầu vào
    [ApiController]

    // 3. API Controller phải kế thừa từ ControllerBase (thay vì kế thừa từ Controller như phân hệ MVC)
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // 4. Hàm khởi tạo (Constructor): "Tiêm" ngữ cảnh dữ liệu SQL Server vào để sử dụng
        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. Chỉ định phương thức GET (Dùng để kéo dữ liệu từ cơ sở dữ liệu)
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 12)
        {
            var query = _context.Products
                .OrderByDescending(p => p.Id)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity,
                    CategoryProductName = p.CategoryProduct.Name
                });

            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var products = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                items = products,
                totalItems,
                totalPages,
                currentPage = page,
                pageSize
            });
        }

        // 2. Định nghĩa đường dẫn chứa tham số động: api/products/categoryproduct/{categoryProductId}
        [HttpGet("categoryproduct/{categoryProductId}")]
        public async Task<IActionResult> GetByCategoryProduct(int categoryProductId, [FromQuery] int page = 1, [FromQuery] int pageSize = 12)
        {
            var query = _context.Products
                .Where(p => p.CategoryProductId == categoryProductId)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity,
                    CategoryProductName = p.CategoryProduct.Name
                });

            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var products = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                items = products,
                totalItems,
                totalPages,
                currentPage = page,
                pageSize
            });
        }

        // API: Tìm kiếm sản phẩm theo từ khóa
        // GET /api/Products/search?keyword=áo&page=1&pageSize=12
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string keyword = "", [FromQuery] int page = 1, [FromQuery] int pageSize = 12)
        {
            if (string.IsNullOrWhiteSpace(keyword))
            {
                return await GetAll(page, pageSize);
            }

            var query = _context.Products
                .Where(p => p.Name.Contains(keyword) || (p.Description != null && p.Description.Contains(keyword)))
                .OrderByDescending(p => p.Id)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity,
                    CategoryProductName = p.CategoryProduct.Name
                });

            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var products = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                items = products,
                totalItems,
                totalPages,
                currentPage = page,
                pageSize,
                keyword
            });
        }

        // API: Lọc sản phẩm theo khoảng giá
        // GET /api/Products/filter?minPrice=100000&maxPrice=5000000&page=1&pageSize=12
        [HttpGet("filter")]
        public async Task<IActionResult> FilterByPrice([FromQuery] decimal? minPrice, [FromQuery] decimal? maxPrice,
            [FromQuery] int? categoryId, [FromQuery] int page = 1, [FromQuery] int pageSize = 12)
        {
            var query = _context.Products.AsQueryable();

            if (categoryId.HasValue)
                query = query.Where(p => p.CategoryProductId == categoryId.Value);

            if (minPrice.HasValue)
                query = query.Where(p => p.Price >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(p => p.Price <= maxPrice.Value);

            query = query.OrderByDescending(p => p.Id);

            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var products = await query
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity,
                    CategoryProductName = p.CategoryProduct.Name
                })
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                items = products,
                totalItems,
                totalPages,
                currentPage = page,
                pageSize
            });
        }

        // API: Lấy 3 sản phẩm mới nhất (cho trang chủ)
        [HttpGet("latest")]
        public async Task<IActionResult> GetLatest()
        {
            var products = await _context.Products
                .OrderByDescending(p => p.Id)
                .Take(3)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity
                })
                .ToListAsync();

            return Ok(products);
        }

        // API: Lấy 3 sản phẩm bán chạy nhất (dựa trên số lượng trong OrderDetails)
        [HttpGet("bestselling")]
        public async Task<IActionResult> GetBestSelling()
        {
            var products = await _context.OrderDetails
                .GroupBy(od => new { od.ProductId, od.Product.Name, od.Product.Price, od.Product.ImageUrl, od.Product.StockQuantity })
                .Select(g => new
                {
                    Id = g.Key.ProductId,
                    g.Key.Name,
                    g.Key.Price,
                    g.Key.ImageUrl,
                    g.Key.StockQuantity,
                    TotalSold = g.Sum(od => od.Quantity)
                })
                .OrderByDescending(p => p.TotalSold)
                .Take(3)
                .ToListAsync();

            return Ok(products);
        }

        // 3. Định nghĩa đường dẫn nhận ID trực tiếp: api/products/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            // 3.1. Quét bảng Products để tìm sản phẩm đầu tiên có Id khớp với tham số
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == id);

            // 3.2 Xử lý kịch bản lỗi bảo vệ hệ thống: ID không tồn tại trong Database
            if (product == null)
            {
                // Trả về mã lỗi 404 kèm một "gói tin" JSON thông báo nhỏ gọn để Frontend tự xử lý UI
                return NotFound(new { message = "Không tìm thấy sản phẩm này trong hệ thống" });
            }

            // 3.3. Trả về toàn bộ đối tượng sản phẩm (bao gồm cả trường Description mô tả chất liệu vải) kèm mã 200 OK
            return Ok(product);
        }
    }
}
