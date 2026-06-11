import React, { useState } from 'react';
import CategoryProductList from './components/CategoryProductList';
import ProductList from './components/ProductList';
import PostList from './components/PostList';
import './App.css';

function App() {
    // State lưu ID danh mục đang được chọn (null = tất cả sản phẩm)
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    return (
        <div className="container mt-5">
            {/* Phần Header của Website */}
            <header className="pb-3 mb-4 border-bottom">
                <span className="fs-4 font-weight-bold text-dark text-uppercase">
                    👗 FASHION BOUTIQUE - THỜI TRANG CÔNG SỞ &amp; DẠ HỘI
                </span>
            </header>

            {/* KHU VỰC 1: SHOPPING (Sản phẩm và Bộ lọc danh mục) */}
            <div className="row">
                {/* Cột bên trái (Sidebar): Bộ lọc danh mục sản phẩm */}
                <div className="col-md-3">
                    <CategoryProductList
                        selectedCategoryId={selectedCategoryId}
                        onSelectCategory={setSelectedCategoryId}
                    />
                </div>

                {/* Cột bên phải (Content): Danh sách sản phẩm thời trang */}
                <div className="col-md-9">
                    <h4 className="mb-4 text-uppercase text-secondary font-weight-bold">
                        {selectedCategoryId ? 'Sản phẩm theo danh mục' : 'Bộ sưu tập mới nhất'}
                    </h4>
                    <ProductList selectedCategoryId={selectedCategoryId} />
                </div>
            </div>

            {/* KHU VỰC 2: BLOG & TIN TỨC (Xu hướng thời trang công sở, dạ hội) */}
            <div className="row mt-5">
                <div className="col-12">
                    <PostList />
                </div>
            </div>
        </div>
    );
}

export default App;
