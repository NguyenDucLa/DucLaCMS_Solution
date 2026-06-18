import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

function BlogDetail() {
    return (
        <div>
            <Header />
            <div className="container py-4">
                <h2 className="fw-bold">Chi tiết bài viết</h2>
                <p className="text-muted">Trang chi tiết bài viết (Đang phát triển...)</p>
            </div>
            <Footer />
        </div>
    );
}

export default BlogDetail;
