using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Options;

namespace CMS.Backend.Services
{
    public class EmailSettings
    {
        public string SmtpServer { get; set; } = "smtp.gmail.com";
        public int SmtpPort { get; set; } = 587;
        public string SenderName { get; set; } = "Fashion Boutique";
        public string SenderEmail { get; set; } = "";
        public string Username { get; set; } = "";
        public string Password { get; set; } = "";
    }

    public interface IEmailService
    {
        Task SendOrderConfirmationAsync(string toEmail, string customerName, int orderId, List<OrderItemInfo> items, decimal totalAmount);
        Task SendForgotPasswordEmailAsync(string toEmail, string customerName, string newPassword);
    }

    public class OrderItemInfo
    {
        public string ProductName { get; set; } = "";
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal SubTotal => Quantity * UnitPrice;
    }

    public class EmailService : IEmailService
    {
        private readonly EmailSettings _settings;

        public EmailService(IOptions<EmailSettings> settings)
        {
            _settings = settings.Value;
        }

        public async Task SendOrderConfirmationAsync(string toEmail, string customerName, int orderId, List<OrderItemInfo> items, decimal totalAmount)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_settings.SenderName, _settings.SenderEmail));
            message.To.Add(new MailboxAddress(customerName, toEmail));
            message.Subject = $"Xác nhận đơn hàng #{orderId} - Fashion Boutique";

            var bodyBuilder = new BodyBuilder();

            // Tạo nội dung HTML cho email
            var itemsHtml = string.Join("", items.Select(item => $@"
                <tr>
                    <td style='padding:10px;border-bottom:1px solid #eee;'>{item.ProductName}</td>
                    <td style='padding:10px;border-bottom:1px solid #eee;text-align:center;'>{item.Quantity}</td>
                    <td style='padding:10px;border-bottom:1px solid #eee;text-align:right;'>{item.UnitPrice:N0} VNĐ</td>
                    <td style='padding:10px;border-bottom:1px solid #eee;text-align:right;'>{item.SubTotal:N0} VNĐ</td>
                </tr>
            "));

            bodyBuilder.HtmlBody = $@"
            <!DOCTYPE html>
            <html>
            <head><meta charset='UTF-8'></head>
            <body style='font-family:Arial,sans-serif;background:#f4f4f4;padding:20px;'>
                <div style='max-width:600px;margin:auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);'>
                    <div style='background:#ffc107;padding:20px;text-align:center;'>
                        <h2 style='margin:0;color:#333;'>Đặt hàng thành công!</h2>
                    </div>
                    <div style='padding:20px;'>
                        <p>Xin chào <strong>{customerName}</strong>,</p>
                        <p>Cảm ơn bạn đã đặt hàng tại <strong>Fashion Boutique</strong>. Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.</p>
                        
                        <div style='background:#f8f9fa;padding:15px;border-radius:5px;margin:15px 0;'>
                            <p style='margin:5px 0;'><strong>Mã đơn hàng:</strong> #{orderId}</p>
                        </div>

                        <h3 style='border-bottom:2px solid #ffc107;padding-bottom:8px;'>Chi tiết đơn hàng</h3>
                        <table style='width:100%;border-collapse:collapse;'>
                            <thead>
                                <tr style='background:#f8f9fa;'>
                                    <th style='padding:10px;text-align:left;'>Sản phẩm</th>
                                    <th style='padding:10px;text-align:center;'>SL</th>
                                    <th style='padding:10px;text-align:right;'>Đơn giá</th>
                                    <th style='padding:10px;text-align:right;'>Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itemsHtml}
                            </tbody>
                        </table>

                        <div style='text-align:right;margin-top:15px;padding-top:15px;border-top:2px solid #ffc107;'>
                            <p style='font-size:18px;font-weight:bold;'>
                                Tổng cộng: <span style='color:#dc3545;'>{totalAmount:N0} VNĐ</span>
                            </p>
                        </div>

                        <div style='background:#fff3cd;padding:15px;border-radius:5px;margin-top:20px;'>
                            <p style='margin:0;'><strong>📞 Hotline hỗ trợ:</strong> 1900.xxxx.xx</p>
                            <p style='margin:5px 0 0;'><strong>📧 Email:</strong> support@fashionboutique.com</p>
                        </div>
                    </div>
                    <div style='background:#333;color:#fff;padding:15px;text-align:center;font-size:12px;'>
                        <p style='margin:0;'>&copy; 2026 Fashion Boutique. Tất cả quyền được bảo lưu.</p>
                    </div>
                </div>
            </body>
            </html>";

            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync(_settings.SmtpServer, _settings.SmtpPort, MailKit.Security.SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_settings.Username, _settings.Password);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }

        public async Task SendForgotPasswordEmailAsync(string toEmail, string customerName, string newPassword)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_settings.SenderName, _settings.SenderEmail));
            message.To.Add(new MailboxAddress(customerName, toEmail));
            message.Subject = "Yêu cầu đặt lại mật khẩu - Fashion Boutique";

            var bodyBuilder = new BodyBuilder();
            bodyBuilder.HtmlBody = $@"
            <!DOCTYPE html>
            <html>
            <head><meta charset='UTF-8'></head>
            <body style='font-family:Arial,sans-serif;background:#f4f4f4;padding:20px;'>
                <div style='max-width:600px;margin:auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);'>
                    <div style='background:#ffc107;padding:20px;text-align:center;'>
                        <h2 style='margin:0;color:#333;'>Đặt lại mật khẩu</h2>
                    </div>
                    <div style='padding:20px;'>
                        <p>Xin chào <strong>{customerName}</strong>,</p>
                        <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại <strong>Fashion Boutique</strong>.</p>
                        
                        <div style='background:#fff3cd;padding:20px;border-radius:5px;margin:20px 0;text-align:center;'>
                            <p style='margin:0 0 10px;font-size:14px;'>Mật khẩu mới của bạn là:</p>
                            <p style='font-size:24px;font-weight:bold;color:#d32f2f;letter-spacing:2px;margin:0;font-family:monospace;'>{newPassword}</p>
                        </div>

                        <p>Vui lòng <strong>đăng nhập</strong> bằng mật khẩu mới này và đổi lại mật khẩu cá nhân.</p>
                        
                        <div style='text-align:center;margin:25px 0;'>
                            <a href='http://localhost:3000/login' style='background:#ffc107;color:#333;padding:12px 30px;text-decoration:none;border-radius:50px;font-weight:bold;display:inline-block;'>Đăng nhập ngay</a>
                        </div>

                        <p style='color:#999;font-size:12px;'>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                    </div>
                    <div style='background:#333;color:#fff;padding:15px;text-align:center;font-size:12px;'>
                        <p style='margin:0;'>&copy; 2026 Fashion Boutique. Tất cả quyền được bảo lưu.</p>
                    </div>
                </div>
            </body>
            </html>";

            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync(_settings.SmtpServer, _settings.SmtpPort, MailKit.Security.SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_settings.Username, _settings.Password);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}
