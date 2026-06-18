import React, { useState } from 'react';
import CategoryProductList from './components/CategoryProductList';
import ProductList from './components/ProductList';
import PostList from './components/PostList';
import BlogCategoryList from './components/BlogCategoryList';
import './App.css';

function App() {
    // State lưu ID danh mục sản phẩm đang được chọn
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    return (
        <div className="container mt-5">
            {/* Phần Header sang trọng */}
            <header className="pb-4 mb-4 border-bottom d-flex justify-content-between align-items-center"
                    style={{
                        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                        borderRadius: '12px',
                        padding: '20px 28px',
                        color: '#fff',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                    }}>
                <div>
                    <h1 className="h4 font-weight-bold mb-1" style={{ letterSpacing: '1px' }}>
                        👗 Fashion Boutique
                    </h1>
                    <small className="text-light" style={{ opacity: 0.8 }}>
                        <i className="fa-regular fa-gem mr-1"></i> Thời trang Công sở &amp; Dạ hội
                    </small>
                </div>
                <span className="badge badge-light px-3 py-2 font-weight-normal"
                      style={{ fontSize: '0.8rem', color: '#1a1a2e', borderRadius: '20px' }}>
                    <i className="fa-regular fa-graduation-cap mr-1"></i> ASP.NET + ReactJS
                </span>
            </header>

            {/* Layout chính: Cột trái (Bộ lọc) + Cột phải (Nội dung) */}
            <div className="row">
                {/* CỘT TRÁI: CHỨA CÁC BỘ LỌC PHÂN LOẠI DỮ LIỆU */}
                <div className="col-md-3">
                    {/* Danh mục sản phẩm thời trang */}
                    <CategoryProductList
                        selectedCategoryId={selectedCategoryId}
                        onSelectCategory={setSelectedCategoryId}
                    />

                    {/* Chuyên mục tin tức blog */}
                    <BlogCategoryList />
                </div>

                {/* CỘT PHẢI: DANH SÁCH SẢN PHẨM & BÀI VIẾT XU HƯỚNG */}
                <div className="col-md-9">
                    {/* KHU VỰC SẢN PHẨM */}
                    <h4 className="mb-4 text-uppercase text-secondary font-weight-bold">
                        {selectedCategoryId ? 'Sản phẩm theo danh mục' : 'Bộ sưu tập mới nhất'}
                    </h4>
                    <ProductList selectedCategoryId={selectedCategoryId} />

                    {/* KHU VỰC BLOG & TIN TỨC */}
                    <div className="mt-5">
                        <PostList />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="pt-4 mt-5 text-muted border-top text-center small">
                <p className="mb-1">© 2026 - Đồ án thực hành phân tầng ASP.NET Core Web API kết hợp ReactJS Client-side</p>
                <p className="mb-0" style={{ opacity: 0.6 }}>
                    <i className="fa-regular fa-heart mr-1"></i> Fashion Boutique - Hệ Thống Quản Trị Nội Dung &amp; Bán Hàng
                </p>
            </footer>
        </div>
    );
}

export default App;
