import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../../components/PostCard';
import blogService from '../../services/blogService';

const LatestBlog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const data = await blogService.getAllPosts();
                setPosts(data);
            } catch (error) {
                console.error("Lỗi khi tải bài viết:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) {
        return (
            <section className="py-5">
                <div className="container text-center">
                    <div className="spinner-border text-info" role="status"></div>
                    <p className="mt-2 text-muted">Đang tải tin tức xu hướng...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-5">
            <div className="container">
                {/* Tiêu đề */}
                <div className="text-center mb-5">
                    <h2 className="fw-bold text-uppercase" style={{ letterSpacing: '2px' }}>
                        <i className="fa-regular fa-newspaper text-info me-2"></i>Xu hướng &amp; Bí quyết mặc đẹp
                    </h2>
                    <p className="text-muted">Cập nhật những xu hướng thời trang công sở, dạ hội mới nhất</p>
                </div>

                {posts.length === 0 ? (
                    <p className="text-center text-muted">Chưa có bài viết nào.</p>
                ) : (
                    <div className="row g-4">
                        {posts.slice(0, 3).map((item) => (
                            <div className="col-md-4" key={item.id}>
                                <PostCard post={item} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Nút xem tất cả */}
                <div className="text-center mt-4">
                    <Link to="/blog" className="btn btn-outline-dark rounded-pill px-5">
                        <i className="fa-regular fa-eye me-2"></i>Xem tất cả bài viết
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default LatestBlog;
