/*
 * Họ và tên: Nguyễn Đức La
 * Mssv: 2123110087
 * ngày tạo: 14/05/2026
 * version: 1.0
 * 
 */


using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Data.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty; // Quản trị viên hoặc Biên tập viên
    }
}

