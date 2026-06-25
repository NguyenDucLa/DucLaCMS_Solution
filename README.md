# DucLaCMS - Hệ thống Quản lý Nội dung Thời trang

Dự án CMS thời trang với **Backend ASP.NET Core 8 MVC + Web API** và **Frontend ReactJS**.

## 🚀 Công nghệ sử dụng

### Backend (`CMS.Backend`)
- **ASP.NET Core 8** (MVC + Web API)
- **Entity Framework Core 8** + SQL Server
- **Swagger/OpenAPI** tại `/swagger`
- **Authentication**: Cookie-based Authentication
- **CORS**: Cho phép ReactJS frontend tại `http://localhost:3000`

### Frontend (`cms.frontend`)
- **React 18** + React Router 6
- **Bootstrap 5** (qua CDN)
- **Axios** gọi API
- **Font Awesome 6** icons

## 📋 Yêu cầu hệ thống

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/sql-server) (LocalDB, Express, hoặc Developer)

## 🔧 Cài đặt & Chạy

### 1. Backend

```bash
# Di chuyển vào thư mục Backend
cd CMS.Backend

# Cập nhật connection string trong appsettings.json
# Mặc định: Server=(localdb)\\mssqllocaldb;Database=DucLaCMS;Trusted_Connection=True;TrustServerCertificate=True

# Chạy migration (tạo database)
dotnet ef database update

# Khởi chạy (F5 trong VS Code hoặc dùng CLI)
dotnet run
```

Backend sẽ chạy tại: **https://localhost:5001** hoặc **http://localhost:5000**

> **Swagger UI**: Mở trình duyệt tại `http://localhost:5000/swagger`

### 2. Frontend

```bash
# Di chuyển vào thư mục Frontend
cd cms.frontend

# Cài đặt dependencies
npm install

# Khởi chạy
npm start
```

Frontend sẽ chạy tại: **http://localhost:3000**

> Frontend tự động gọi API Backend tại `http://localhost:5000/api`

## 🗂️ Cấu trúc dự án

```
├── CMS.Backend/              # ASP.NET Core Backend
│   ├── Controllers/          # API + MVC Controllers
│   │   ├── ProductsController.cs      # API: /api/products
│   │   ├── CategoriesController.cs    # API: /api/categories
│   │   ├── PostsController.cs         # API: /api/posts
│   │   ├── CategoriesProductsController.cs  # API: /api/categoriesproducts
│   │   ├── OrdersController.cs        # API: /api/orders (POST)
│   │   ├── HomeController.cs          # MVC: trang chủ
│   │   ├── AccountController.cs       # Đăng nhập/đăng xuất
│   │   ├── CategoryController.cs      # Quản trị danh mục bài viết
│   │   ├── PostController.cs          # Quản trị bài viết
│   │   ├── ProductController.cs       # Quản trị sản phẩm
│   │   ├── UserController.cs          # Quản trị người dùng
│   │   ├── CustomerController.cs      # Quản trị khách hàng
│   │   └── OrderController.cs         # Quản trị đơn hàng
│   ├── Models/               # ViewModels
│   ├── Views/                # Razor Views (Admin panel)
│   └── Program.cs            # Cấu trúc Middleware
├── CMS.Data/                 # Entity Framework Models + DbContext
│   ├── Entities/             # Thực thể: Post, Product, Category, ...
│   └── ApplicationDbContext.cs
├── cms.frontend/             # ReactJS Frontend
│   ├── src/
│   │   ├── api/              # Axios client
│   │   ├── components/       # Component dùng chung
│   │   │   ├── Header.jsx    # Navigation + Cart
│   │   │   ├── Footer.jsx    # Footer
│   │   │   ├── ProductCard.jsx
│   │   │   └── PostCard.jsx
│   │   ├── pages/            # Trang chức năng
│   │   │   ├── home/         # Trang chủ (HeroBanner, ProductGrid, ...)
│   │   │   ├── shop/         # Cửa hàng
│   │   │   ├── product-detail/ # Chi tiết sản phẩm
│   │   │   ├── blog/         # Danh sách bài viết
│   │   │   ├── blog-detail/  # Chi tiết bài viết
│   │   │   ├── cart/         # Giỏ hàng
│   │   │   ├── checkout/     # Thanh toán
│   │   │   └── login/        # Đăng nhập
│   │   └── services/         # API service layer
│   └── package.json
└── README.md
```

## 🌐 Web API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/products` | Danh sách sản phẩm (kèm tên danh mục) |
| GET | `/api/products/{id}` | Chi tiết sản phẩm |
| GET | `/api/products/categoryproduct/{id}` | Sản phẩm theo danh mục |
| GET | `/api/categories` | Danh sách chuyên mục bài viết |
| GET | `/api/categories/{id}` | Chi tiết chuyên mục |
| GET | `/api/posts` | Danh sách bài viết (kèm tên chuyên mục) |
| GET | `/api/posts/{id}` | Chi tiết bài viết |
| GET | `/api/posts/category/{id}` | Bài viết theo chuyên mục |
| GET | `/api/categoriesproducts` | Danh sách danh mục sản phẩm |
| POST | `/api/orders` | Tạo đơn hàng (checkout) |

## 📄 Giấy phép

Dự án cá nhân - Nguyễn Đức La
