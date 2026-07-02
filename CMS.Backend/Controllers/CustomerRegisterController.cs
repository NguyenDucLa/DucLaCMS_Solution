using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerRegisterController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;

        public CustomerRegisterController(ApplicationDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        /// <summary>
        /// POST: /api/CustomerRegister
        /// Đăng ký tài khoản khách hàng với kiểm tra email trùng và mã hóa mật khẩu
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterCustomerDTO input)
        {
            if (input == null)
                return BadRequest(new { message = "Dữ liệu không hợp lệ." });

            // Validate các trường bắt buộc
            if (string.IsNullOrWhiteSpace(input.FullName))
                return BadRequest(new { message = "Họ tên không được để trống." });

            if (string.IsNullOrWhiteSpace(input.Email))
                return BadRequest(new { message = "Email không được để trống." });

            if (!new EmailAddressAttribute().IsValid(input.Email))
                return BadRequest(new { message = "Email không hợp lệ." });

            if (string.IsNullOrWhiteSpace(input.Password) || input.Password.Length < 6)
                return BadRequest(new { message = "Mật khẩu phải có ít nhất 6 ký tự." });

            // Kiểm tra email đã tồn tại trong hệ thống chưa
            var existingCustomer = _context.Customers
                .FirstOrDefault(c => c.Email.ToLower() == input.Email.Trim().ToLower());

            if (existingCustomer != null)
                return Conflict(new { message = "Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập." });

            // Mã hóa mật khẩu bằng BCrypt trước khi lưu
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(input.Password);

            var customer = new Customer
            {
                FullName = input.FullName.Trim(),
                Email = input.Email.Trim().ToLower(),
                Phone = input.Phone?.Trim(),
                Address = input.Address?.Trim(),
                PasswordHash = passwordHash
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return StatusCode(201, new
            {
                message = "Đăng ký tài khoản khách hàng thành công!",
                customer = new
                {
                    customer.Id,
                    customer.FullName,
                    customer.Email
                }
            });
        }

        /// <summary>
        /// POST: /api/CustomerRegister/login
        /// Đăng nhập cho khách hàng (kiểm tra mật khẩu đã mã hóa)
        /// </summary>
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginCustomerDTO input)
        {
            if (input == null || string.IsNullOrWhiteSpace(input.Email) || string.IsNullOrWhiteSpace(input.Password))
                return BadRequest(new { message = "Vui lòng nhập email và mật khẩu." });

            var customer = _context.Customers
                .FirstOrDefault(c => c.Email.ToLower() == input.Email.Trim().ToLower());

            if (customer == null)
                return Unauthorized(new { message = "Email hoặc mật khẩu không đúng." });

            // Kiểm tra mật khẩu (hỗ trợ cả BCrypt mới và Plain Text cũ)
            if (!VerifyPassword(input.Password, customer))
                return Unauthorized(new { message = "Email hoặc mật khẩu không đúng." });

            return Ok(new
            {
                message = "Đăng nhập thành công!",
                customer = new
                {
                    customer.Id,
                    customer.FullName,
                    customer.Email,
                    customer.Phone,
                    customer.Address
                }
            });
        }

        /// <summary>
        /// Xác thực mật khẩu hỗ trợ cả BCrypt (mới) và Plain Text (cũ)
        /// </summary>
        private bool VerifyPassword(string password, Customer customer)
        {
            if (customer.PasswordHash.StartsWith("$2"))
            {
                return BCrypt.Net.BCrypt.Verify(password, customer.PasswordHash);
            }

            if (customer.PasswordHash == password)
            {
                customer.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
                _context.SaveChanges();
                return true;
            }

            return false;
        }

        /// <summary>
        /// GET: /api/CustomerRegister/profile/{id}
        /// Lấy thông tin hồ sơ khách hàng theo ID
        /// </summary>
        [HttpGet("profile/{id}")]
        public IActionResult GetProfile(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null)
                return NotFound(new { message = "Không tìm thấy khách hàng." });

            return Ok(new
            {
                customer.Id,
                customer.FullName,
                customer.Email,
                customer.Phone,
                customer.Address
            });
        }

        /// <summary>
        /// PUT: /api/CustomerRegister/profile
        /// Cập nhật thông tin hồ sơ khách hàng
        /// </summary>
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDTO input)
        {
            if (input == null || input.Id <= 0)
                return BadRequest(new { message = "Dữ liệu không hợp lệ." });

            var customer = _context.Customers.Find(input.Id);
            if (customer == null)
                return NotFound(new { message = "Không tìm thấy khách hàng." });

            if (!string.IsNullOrWhiteSpace(input.FullName))
                customer.FullName = input.FullName.Trim();

            if (!string.IsNullOrWhiteSpace(input.Phone))
                customer.Phone = input.Phone.Trim();

            if (!string.IsNullOrWhiteSpace(input.Address))
                customer.Address = input.Address.Trim();

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Cập nhật thông tin thành công!",
                customer = new
                {
                    customer.Id,
                    customer.FullName,
                    customer.Email,
                    customer.Phone,
                    customer.Address
                }
            });
        }

        /// <summary>
        /// PUT: /api/CustomerRegister/change-password
        /// Đổi mật khẩu cho khách hàng
        /// </summary>
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO input)
        {
            if (input == null || input.Id <= 0)
                return BadRequest(new { message = "Dữ liệu không hợp lệ." });

            if (string.IsNullOrWhiteSpace(input.OldPassword))
                return BadRequest(new { message = "Vui lòng nhập mật khẩu cũ." });

            if (string.IsNullOrWhiteSpace(input.NewPassword) || input.NewPassword.Length < 6)
                return BadRequest(new { message = "Mật khẩu mới phải có ít nhất 6 ký tự." });

            var customer = _context.Customers.Find(input.Id);
            if (customer == null)
                return NotFound(new { message = "Không tìm thấy khách hàng." });

            // Kiểm tra mật khẩu cũ
            bool validOldPassword;
            if (customer.PasswordHash.StartsWith("$2"))
                validOldPassword = BCrypt.Net.BCrypt.Verify(input.OldPassword, customer.PasswordHash);
            else
                validOldPassword = customer.PasswordHash == input.OldPassword;

            if (!validOldPassword)
                return Unauthorized(new { message = "Mật khẩu cũ không đúng." });

            // Hash và lưu mật khẩu mới
            customer.PasswordHash = BCrypt.Net.BCrypt.HashPassword(input.NewPassword);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đổi mật khẩu thành công!" });
        }

        /// <summary>
        /// POST: /api/CustomerRegister/forgot-password
        /// Xử lý quên mật khẩu: tạo mật khẩu mới ngẫu nhiên, hash BCrypt và cập nhật
        /// </summary>
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDTO input)
        {
            if (input == null || string.IsNullOrWhiteSpace(input.Email))
                return BadRequest(new { message = "Vui lòng nhập email." });

            var customer = _context.Customers
                .FirstOrDefault(c => c.Email.ToLower() == input.Email.Trim().ToLower());

            if (customer == null)
                return NotFound(new { message = "Email không tồn tại trong hệ thống." });

            // Tạo mật khẩu ngẫu nhiên 8 ký tự
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new Random();
            var newPassword = new string(Enumerable.Range(0, 8).Select(_ => chars[random.Next(chars.Length)]).ToArray());

            // Hash mật khẩu mới
            customer.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            await _context.SaveChangesAsync();

            // Gửi email chứa mật khẩu mới
            try
            {
                await _emailService.SendForgotPasswordEmailAsync(
                    customer.Email,
                    customer.FullName,
                    newPassword
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi gửi email forgot password: {ex.Message}");
                // Không block - mật khẩu đã được đặt lại thành công dù email lỗi
            }

            return Ok(new
            {
                message = "Mật khẩu mới đã được gửi qua email. Vui lòng kiểm tra hộp thư đến (hoặc thư mục Spam).",
            });
        }
    }

    public class RegisterCustomerDTO
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Address { get; set; }
    }

    public class LoginCustomerDTO
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class ForgotPasswordDTO
    {
        public string Email { get; set; } = string.Empty;
    }

    public class UpdateProfileDTO
    {
        public int Id { get; set; }
        public string? FullName { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
    }

    public class ChangePasswordDTO
    {
        public int Id { get; set; }
        public string OldPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
