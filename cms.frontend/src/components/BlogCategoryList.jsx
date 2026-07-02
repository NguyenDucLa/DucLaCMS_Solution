import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import blogService from '../services/blogService';

const BlogCategoryList = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [blogCategories, setBlogCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const activeCategory = searchParams.get('category');

    useEffect(() => {
        const fetchBlogCategories = async () => {
            try {
                setLoading(true);
                const data = await blogService.getBlogCategories();
                setBlogCategories(data);
            } catch (error) {
                console.error("Lỗi khi gọi API chuyên mục tin tức:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogCategories();
    }, []);

    const handleFilter = (catId) => {
        if (catId) {
            navigate(`/blog?category=${catId}`);
        } else {
            navigate('/blog');
        }
    };

    if (loading) {
        return (
            <div className="text-center my-3 text-muted small">
                <div className="spinner-border spinner-border-sm text-info" role="status"></div>
                Đang nạp chuyên mục...
            </div>
        );
    }

    return (
        <div className="card shadow-sm border-0 rounded-lg">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-2 px-4">
                <h5 className="card-title text-uppercase fw-bold text-dark d-flex align-items-center mb-0" style={{ letterSpacing: '0.5px', fontSize: '1.1rem' }}>
                    <i className="fa-solid fa-tags text-info me-2"></i> Chủ đề bài viết
                </h5>
            </div>
            <div className="card-body p-0">
                <div className="list-group list-group-flush">
                    <button
                        type="button"
                        className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center px-4 py-3 ${!activeCategory ? 'active' : ''}`}
                        onClick={() => handleFilter(null)}
                    >
                        <span className="fw-bold"><i className="fa-solid fa-th-list me-2"></i>Tất cả</span>
                        <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.8rem', opacity: 0.5 }}></i>
                    </button>
                    {blogCategories.length === 0 ? (
                        <div className="p-4 text-center text-muted">Chưa có chủ đề nào.</div>
                    ) : (
                        blogCategories.map((cate) => (
                            <button
                                key={cate.id}
                                type="button"
                                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center px-4 py-3 ${activeCategory === String(cate.id) ? 'active' : ''}`}
                                onClick={() => handleFilter(cate.id)}
                            >
                                <span><i className="fa-regular fa-hashtag me-2 text-muted"></i>{cate.name}</span>
                                <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.8rem', opacity: 0.5 }}></i>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogCategoryList;
