using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        // "Tiêm" kết nối Database vào Controller
        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index(int? id)
        {
            // 1. Kiểm tra nếu không có id truyền vào thì lấy toàn bộ bài viết
            if (id == null)
            {
                var allPosts = _context.Posts
                            .OrderByDescending(p => p.CreatedDate)
                            .Include(p => p.Category)
                            .ToList();
                return View(allPosts);
            }

            // 2. Nếu có id thì lọc theo danh mục
            var posts = _context.Posts
                        .Where(p => p.CategoryId == id)
                        .OrderByDescending(p => p.CreatedDate)
                        .Include(p => p.Category)
                        .ToList();

            // 3. Truyền dữ liệu ra View
            return View(posts);
        }

        // GET: Post/Details/5
        public IActionResult Details(int id)
        {
            // 1. Truy vấn bài viết theo ID
            // Sử dụng .Include(p => p.Category) để lấy kèm thông tin Danh mục (Join bảng)
            var post = _context.Posts
                .Include(p => p.Category)
                .FirstOrDefault(p => p.Id == id);

            // 2. Kiểm tra nếu không tìm thấy bài viết (tránh lỗi màn hình trắng)
            if (post == null)
            {
                return NotFound(); // Trả về trang lỗi 404
            }

            // 3. Truyền dữ liệu sang View
            return View(post);
        }
    }
}