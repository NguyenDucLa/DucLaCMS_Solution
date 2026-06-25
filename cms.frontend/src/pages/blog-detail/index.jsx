import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import blogService from '../../services/blogService';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?auto=format&fit=crop&w=800&q=80';

function BlogDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        setLoading(true);
        blogService.getPostById(id)
            .then(data => setPost(data))
            .catch(() => setPost(null))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div>
                <Header />
                <div className="container text-center py-5">
                    <div className="spinner-border text-info" role="status"></div>
                    <p className="mt-2 text-muted">Đang tải bài viết...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!post) {
        return (
            <div>
                <Header />
                <div className="container text-center py-5">
                    <h3 className="text-muted">Không tìm thấy bài viết</h3>
                    <Link to="/blog" className="btn btn-dark mt-3">Quay lại tin tức</Link>
                </div>
                <Footer />
            </div>
        );
    }

    const imgSrc = post.imageUrl && !imgError ? post.imageUrl : DEFAULT_IMAGE;

    return (
        <div>
            <Header />
            <div className="container py-4">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                        <li className="breadcrumb-item"><Link to="/blog">Tin tức</Link></li>
                        <li className="breadcrumb-item active">{post.title}</li>
                    </ol>
                </nav>

                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <article>
                            <h1 className="fw-bold mb-3">{post.title}</h1>

                            <p className="text-muted mb-4">
                                <i className="fa-regular fa-calendar me-1"></i>
                                {post.createdDate ? new Date(post.createdDate).toLocaleDateString('vi-VN') : ''}
                                {post.categoryName && (
                                    <span className="ms-3">
                                        <i className="fa-regular fa-folder-open me-1"></i>{post.categoryName}
                                    </span>
                                )}
                            </p>

                            {post.imageUrl && (
                                <div className="mb-4 rounded-3 overflow-hidden shadow-sm">
                                    <img
                                        src={imgSrc}
                                        alt={post.title}
                                        className="w-100"
                                        style={{ objectFit: 'cover', maxHeight: '450px' }}
                                        onError={() => setImgError(true)}
                                    />
                                </div>
                            )}

                            {/* Nội dung chi tiết với HTML */}
                            <div className="blog-content fs-5 lh-lg" style={{ lineHeight: '1.8' }}>
                                {post.content ? (
                                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                                ) : (
                                    <p className="text-muted">Nội dung bài viết chưa được cập nhật.</p>
                                )}
                            </div>
                        </article>

                        <div className="mt-5 text-center">
                            <Link to="/blog" className="btn btn-outline-dark rounded-pill px-5">
                                <i className="fa-solid fa-arrow-left me-2"></i>Quay lại danh sách
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default BlogDetail;
