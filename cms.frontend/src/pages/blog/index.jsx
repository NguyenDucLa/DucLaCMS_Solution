import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

function Blog() {
    return (
        <div>
            <Header />
            <div className="container py-4">
                <h2 className="fw-bold">Tin tức & Xu hướng</h2>
                <p className="text-muted">Trang danh sách bài viết (Đang phát triển...)</p>
            </div>
            <Footer />
        </div>
    );
}

export default Blog;
