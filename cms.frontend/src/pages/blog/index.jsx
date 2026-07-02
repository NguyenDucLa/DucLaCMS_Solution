import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PostCard from '../../components/PostCard';
import blogService from '../../services/blogService';
import categoryService from '../../services/categoryService';

function Blog() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        categoryService.getAllCategories()
            .then(setCategories)
            .catch(() => {});
    }, []);

    useEffect(() => {
        setLoading(true);
        const fetch = activeCategory !== null && activeCategory !== undefined
            ? blogService.getPostsByCategory(activeCategory)
            : blogService.getAllPosts();
        fetch
            .then(setPosts)
            .catch(() => setPosts([]))
            .finally(() => setLoading(false));
    }, [activeCategory]);

    const handleCategoryClick = (catId) => {
        setActiveCategory(catId);
        if (catId !== null && catId !== undefined) {
            navigate(`/blog?category=${catId}`, { replace: true });
        } else {
            navigate('/blog', { replace: true });
        }
    };

    return (
        <div>
            <Header />
            <div className="container py-4">
                <h2 className="fw-bold mb-4">
                    <i className="fa-regular fa-newspaper me-2"></i>Tin tức & Xu hướng
                </h2>

                {/* Bộ lọc danh mục dạng pills */}
                <div className="d-flex flex-wrap gap-2 mb-4">
                    <button
                        className={`btn btn-sm rounded-pill px-3 ${activeCategory === null ? 'btn-dark' : 'btn-outline-secondary'}`}
                        onClick={() => handleCategoryClick(null)}
                    >
                        <i className="fa-solid fa-th-list me-1"></i>Tất cả
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`btn btn-sm rounded-pill px-3 ${activeCategory === cat.id ? 'btn-dark' : 'btn-outline-secondary'}`}
                            onClick={() => handleCategoryClick(cat.id)}
                        >
                            <i className="fa-solid fa-tag me-1"></i>{cat.name}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-info" role="status"></div>
                        <p className="mt-2 text-muted">Đang tải bài viết...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <p className="text-center text-muted py-5">Chưa có bài viết nào.</p>
                ) : (
                    <div className="row g-4">
                        {posts.map(item => (
                            <div className="col-md-4" key={item.id}>
                                <PostCard post={item} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Blog;
