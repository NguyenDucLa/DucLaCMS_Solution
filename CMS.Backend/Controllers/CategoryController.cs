using CMS.Data.Entities; // Kết nối tới lớp dữ liệu bạn vừa tạo
using Microsoft.AspNetCore.Mvc;
using CMS.Data;

public class CategoryController : Controller
{
    private readonly ApplicationDbContext _context;

    // "Tiêm" kết nối vào Controller
    public CategoryController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        // Lấy dữ liệu THẬT từ bảng Categories trong SQL
        var data = _context.Categories.ToList();
        return View(data);
    }
}


