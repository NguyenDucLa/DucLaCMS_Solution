using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using CMS.Data;
using CMS.Data.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    public class AccountController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AccountController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Hiển thị trang đăng nhập
        [HttpGet]
        public IActionResult Login(string returnUrl = null)
        {
            // Lưu lại đường dẫn trang cũ vào ViewData để truyền sang Form
            ViewData["ReturnUrl"] = returnUrl;
            return View();
        }

        // POST: Xử lý logic đăng nhập
        [HttpPost]
        public async Task<IActionResult> Login(string username, string password, string returnUrl = null)
        {
            // 1. Kiểm tra tài khoản trong Database
            var user = _context.Users.FirstOrDefault(u => u.Username == username);

            if (user != null && VerifyPassword(password, user))
            {
                // 2. Thiết lập danh tính (Claims)
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role), // Lưu vai trò: Admin/Editor
                    new Claim("FullName", user.FullName)
                };

                var claimsIdentity = new ClaimsIdentity(claims, "BackendAuth");

                // 3. Đăng nhập và lưu Cookie (BackendAuth) vào trình duyệt
                await HttpContext.SignInAsync("BackendAuth", 
                    new ClaimsPrincipal(claimsIdentity));

                // 4. CHỖ QUAN TRỌNG: Chuyển hướng về trang cũ nếu có, không thì về Home
                if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
                {
                    return Redirect(returnUrl);
                }
                return RedirectToAction("Index", "Home");
            }

            // Nếu sai tài khoản, hiện lỗi và giữ lại returnUrl cho lần bấm nút tiếp theo
            ViewBag.Error = "Tên đăng nhập hoặc mật khẩu không đúng!";
            ViewData["ReturnUrl"] = returnUrl;
            return View();
        }

        // Hàm đăng xuất
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync("BackendAuth");
            return RedirectToAction("Login");
        }

        // Trang thông báo khi vào nhầm quyền (ví dụ Editor vào trang Admin)
        [HttpGet]
        public IActionResult AccessDenied()
        {
            return View();
        }

        /// <summary>
        /// Xác thực mật khẩu hỗ trợ cả BCrypt (mới) và Plain Text (cũ)
        /// Nếu là mật khẩu cũ (plain text) -> tự động hash lại bằng BCrypt
        /// </summary>
        private bool VerifyPassword(string password, User user)
        {
            // Kiểm tra nếu PasswordHash bắt đầu bằng $2 => đây là BCrypt hash
            if (user.PasswordHash.StartsWith("$2"))
            {
                return BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
            }

            // Legacy: mật khẩu cũ lưu dạng plain text -> so sánh trực tiếp
            if (user.PasswordHash == password)
            {
                // Tự động nâng cấp lên BCrypt ngay khi đăng nhập thành công
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
                _context.SaveChanges();
                return true;
            }

            return false;
        }
    }
}