using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using CMS.Data;
using CMS.Data.Entities;
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

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// POST: /api/auth/login — Đăng nhập từ Frontend React
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO input)
        {
            if (input == null || string.IsNullOrWhiteSpace(input.Username) || string.IsNullOrWhiteSpace(input.Password))
            {
                return BadRequest(new { message = "Vui lòng nhập tên đăng nhập và mật khẩu." });
            }

            var user = _context.Users
                .FirstOrDefault(u => u.Username == input.Username && u.PasswordHash == input.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "Tên đăng nhập hoặc mật khẩu không đúng!" });
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("FullName", user.FullName),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
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

            if (string.IsNullOrWhiteSpace(input.Password) || input.Password.Length < 3)
                return BadRequest(new { message = "Mật khẩu phải có ít nhất 3 ký tự." });

            // Kiểm tra username đã tồn tại chưa
            if (_context.Users.Any(u => u.Username == input.Username))
                return Conflict(new { message = "Tên đăng nhập đã tồn tại." });

            // Kiểm tra email đã tồn tại chưa
            if (_context.Users.Any(u => u.Email == input.Email))
                return Conflict(new { message = "Email đã được sử dụng." });

            var user = new User
            {
                Username = input.Username.Trim(),
                PasswordHash = input.Password,
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
        /// GET: /api/auth/me — Lấy thông tin người dùng hiện tại (kiểm tra session)
        /// </summary>
        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized(new { message = "Chưa đăng nhập." });
            }

            return Ok(new
            {
                id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value,
                username = User.Identity.Name,
                fullName = User.FindFirst("FullName")?.Value,
                role = User.FindFirst(ClaimTypes.Role)?.Value
            });
        }

        /// <summary>
        /// POST: /api/auth/logout — Đăng xuất
        /// </summary>
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(new { message = "Đăng xuất thành công." });
        }
    }

    public class LoginDTO
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterDTO
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}
