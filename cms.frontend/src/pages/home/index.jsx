import React from 'react';

// IMPORT ĐỦ 6 TẦNG THEO ĐÚNG THỨ TỰ HƯỚNG DẪN
import Header from '../../components/Header';
import HeroBanner from './HeroBanner';
import CategoryMenu from './CategoryMenu';
import LatestProducts from './LatestProducts';
import BestSellingProducts from './BestSellingProducts';
import LatestBlog from './LatestBlog';
import Footer from '../../components/Footer';

function Home() {
    return (
        <div className="homepage-container">
            {/* TẦNG 1: Thanh tiện ích, logo, ô tìm kiếm và giỏ hàng nhanh */}
            <Header />

            {/* TẦNG 2: Banner quảng cáo lớn, hình khối trang trí và nút kêu gọi mua hàng */}
            <HeroBanner />

            {/* TẦNG 3: Menu ngang hiển thị danh mục sản phẩm (Gọi API /api/CategoriesProducts) */}
            <CategoryMenu />

            {/* KHU VỰC 4: 3 Sản phẩm mới nhất - Gọi API /api/Products/latest */}
            <LatestProducts />

            {/* KHU VỰC 5: 3 Sản phẩm bán chạy - Gọi API /api/Products/bestselling */}
            <BestSellingProducts />

            {/* TẦNG 6: Khối hiển thị các bài viết tin tức xu hướng mặc đẹp (Gọi API /api/Posts) */}
            <LatestBlog />

            {/* TẦNG 7: Chân trang quản trị thông tin liên hệ, hotline và chính sách cửa hàng */}
            <Footer />
        </div>
    );
}

export default Home;
