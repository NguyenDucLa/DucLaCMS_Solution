import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

function ProductDetail() {
    return (
        <div>
            <Header />
            <div className="container py-4">
                <h2 className="fw-bold">Chi tiết sản phẩm</h2>
                <p className="text-muted">Trang chi tiết sản phẩm (Đang phát triển...)</p>
            </div>
            <Footer />
        </div>
    );
}

export default ProductDetail;
