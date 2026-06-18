using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;

namespace CMS.Backend.Controllers
{
    // 1. Định nghĩa đường dẫn để gọi API: api/Categories
    [Route("api/[controller]")]

    // 2. Đánh dấu đây là một API Controller
    [ApiController]

    // 3. API Controller kế thừa từ ControllerBase
    public class CategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // 4. Hàm khởi tạo: Inject db context
        public CategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// API lấy danh sách tất cả chuyên mục tin tức (Category)
        /// GET: api/Categories
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _context.Categories
                .OrderBy(c => c.Id)
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Description
                })
                .ToListAsync();

            return Ok(categories);
        }

        /// <summary>
        /// API lấy chi tiết 1 chuyên mục theo ID
        /// GET: api/Categories/{id}
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
            {
                return NotFound(new { message = "Không tìm thấy chuyên mục tin tức này" });
            }

            return Ok(category);
        }
    }
}
