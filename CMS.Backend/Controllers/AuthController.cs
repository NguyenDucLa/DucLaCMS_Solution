using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;

        public AuthController(ApplicationDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        /// <summary>
        /// POST: /api/auth/login — Đăng nhập từ Frontend React
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO input)
        {
            if (input == null || string.IsNullOrWhiteSpace(input.Email) || string.IsNullOrWhiteSpace(input.Password))
            {
                return BadRequest(new { message = "Vui lòng nhập email và mật khẩu." });
            }

            // Tìm User theo email
            var user = _context.Users
                .FirstOrDefault(u => u.Email == input.Email);

            if (user == null || !VerifyPassword(input.Password, user))
            {
                return Unauthorized(new { message = "Email hoặc mật khẩu không đúng!" });
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("FullName", user.FullName),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };

            var claimsIdentity = new ClaimsIdentity(claims, "FrontendAuth");

            await HttpContext.SignInAsync("FrontendAuth",
                new ClaimsPrincipal(claimsIdentity));

            return Ok(new
            {
                message = "Đăng nhập thành công!",
                user = new
                {
                    id = user.Id,
                    username = user.Username,
                    fullName = user.FullName,
                    role = user.Role
                }
            });
        }

        /// <summary>
        /// POST: /api/auth/register — Đăng ký tài khoản mới
        /// </summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO input)
        {
            if (input == null)
                return BadRequest(new { message = "Dữ liệu không hợp lệ." });

            if (string.IsNullOrWhiteSpace(input.FullName))
                return BadRequest(new { message = "Họ tên không được để trống." });

            if (string.IsNullOrWhiteSpace(input.Email))
                return BadRequest(new { message = "Email không được để trống." });

            if (!input.Email.Contains('@'))
                return BadRequest(new { message = "Email không hợp lệ." });

            if (string.IsNullOrWhiteSpace(input.Username))
                return BadRequest(new { message = "Tên đăng nhập không được để trống." });

            if (string.IsNullOrWhiteSpace(input.Password) || input.Password.Length < 6)
                return BadRequest(new { message = "Mật khẩu phải có ít nhất 6 ký tự." });

            // Kiểm tra username đã tồn tại chưa
            if (_context.Users.Any(u => u.Username == input.Username))
                return Conflict(new { message = "Tên đăng nhập đã tồn tại." });

            // Kiểm tra email đã tồn tại chưa
            if (_context.Users.Any(u => u.Email == input.Email))
                return Conflict(new { message = "Email đã được sử dụng." });

            // Mã hóa mật khẩu bằng BCrypt trước khi lưu
            var user = new User
            {
                Username = input.Username.Trim(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(input.Password),
                FullName = input.FullName.Trim(),
                Email = input.Email.Trim(),
                Role = "Editor"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return StatusCode(201, new
            {
                message = "Đăng ký tài khoản thành công! Vui lòng đăng nhập."
            });
        }

        /// <summary>
        /// GET: /api/auth/me — Lấy thông tin người dùng hiện tại (kiểm tra FrontendAuth cookie)
        /// </summary>
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var result = await HttpContext.AuthenticateAsync("FrontendAuth");
            if (!result.Succeeded || result.Principal == null)
            {
                return Ok(new { isAuthenticated = false });
            }

            var principal = result.Principal;
            var userId = int.Parse(principal.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var user = _context.Users.Find(userId);
            return Ok(new
            {
                isAuthenticated = true,
                id = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value,
                username = principal.Identity?.Name,
                fullName = principal.FindFirst("FullName")?.Value,
                email = user?.Email ?? "",
                role = principal.FindFirst(ClaimTypes.Role)?.Value
            });
        }

        /// <summary>
        /// POST: /api/auth/logout — Đăng xuất
        /// </summary>
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync("FrontendAuth");
            return Ok(new { message = "Đăng xuất thành công." });
        }

        /// <summary>
        /// PUT: /api/auth/profile — Cập nhật thông tin User (họ tên)
        /// </summary>
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileUserDTO input)
        {
            var result = await HttpContext.AuthenticateAsync("FrontendAuth");
            if (!result.Succeeded || result.Principal == null)
                return Unauthorized(new { message = "Chưa đăng nhập." });

            var userId = int.Parse(result.Principal.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var user = _context.Users.Find(userId);
            if (user == null)
                return NotFound(new { message = "Không tìm thấy người dùng." });

            if (!string.IsNullOrWhiteSpace(input.FullName))
                user.FullName = input.FullName.Trim();

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Cập nhật thông tin thành công!",
                user = new
                {
                    user.Id,
                    user.Username,
                    user.FullName,
                    user.Email,
                    user.Role
                }
            });
        }

        /// <summary>
        /// PUT: /api/auth/change-password — Đổi mật khẩu User
        /// </summary>
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordUserDTO input)
        {
            var result = await HttpContext.AuthenticateAsync("FrontendAuth");
            if (!result.Succeeded || result.Principal == null)
                return Unauthorized(new { message = "Chưa đăng nhập." });

            var userId = int.Parse(result.Principal.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var user = _context.Users.Find(userId);
            if (user == null)
                return NotFound(new { message = "Không tìm thấy người dùng." });

            if (string.IsNullOrWhiteSpace(input.OldPassword))
                return BadRequest(new { message = "Vui lòng nhập mật khẩu cũ." });

            if (string.IsNullOrWhiteSpace(input.NewPassword) || input.NewPassword.Length < 6)
                return BadRequest(new { message = "Mật khẩu mới phải có ít nhất 6 ký tự." });

            // Kiểm tra mật khẩu cũ
            bool validOldPassword;
            if (user.PasswordHash.StartsWith("$2"))
                validOldPassword = BCrypt.Net.BCrypt.Verify(input.OldPassword, user.PasswordHash);
            else
                validOldPassword = user.PasswordHash == input.OldPassword;

            if (!validOldPassword)
                return Unauthorized(new { message = "Mật khẩu cũ không đúng." });

            // Hash và lưu mật khẩu mới
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(input.NewPassword);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đổi mật khẩu thành công!" });
        }

        /// <summary>
        /// POST: /api/auth/forgot-password
        /// Xử lý quên mật khẩu cho tài khoản Admin/Editor (bảng Users)
        /// </summary>
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDTO input)
        {
            if (input == null || string.IsNullOrWhiteSpace(input.Email))
                return BadRequest(new { message = "Vui lòng nhập email." });

            var user = _context.Users
                .FirstOrDefault(u => u.Email.ToLower() == input.Email.Trim().ToLower());

            if (user == null)
                return NotFound(new { message = "Email không tồn tại trong hệ thống." });

            // Tạo mật khẩu ngẫu nhiên 8 ký tự
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new Random();
            var newPassword = new string(Enumerable.Range(0, 8).Select(_ => chars[random.Next(chars.Length)]).ToArray());

            // Hash mật khẩu mới
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            await _context.SaveChangesAsync();

            // Gửi email chứa mật khẩu mới
            try
            {
                await _emailService.SendForgotPasswordEmailAsync(
                    user.Email,
                    user.FullName,
                    newPassword
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi gửi email forgot password: {ex.Message}");
            }

            return Ok(new
            {
                message = "Mật khẩu mới đã được gửi qua email. Vui lòng kiểm tra hộp thư đến (hoặc thư mục Spam).",
            });
        }

        /// <summary>
        /// Xác thực mật khẩu hỗ trợ cả BCrypt (mới) và Plain Text (cũ)
        /// Nếu là mật khẩu cũ (plain text) -> tự động hash lại bằng BCrypt
        /// </summary>
        private bool VerifyPassword(string password, User user)
        {
            if (user.PasswordHash.StartsWith("$2"))
            {
                return BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
            }

            if (user.PasswordHash == password)
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
                _context.SaveChanges();
                return true;
            }

            return false;
        }
    }

    public class LoginDTO
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterDTO
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }

    public class ChangePasswordUserDTO
    {
        public string OldPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }

    public class UpdateProfileUserDTO
    {
        public string? FullName { get; set; }
    }
}
