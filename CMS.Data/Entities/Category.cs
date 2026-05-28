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
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty; // Tên danh mục (vd: Tin Giáo Dục)
        public string Description { get; set; } = string.Empty;

        // Quan hệ: Một danh mục có nhiều bài viết
        public virtual ICollection<Post>? Posts { get; set; }
    }
}

