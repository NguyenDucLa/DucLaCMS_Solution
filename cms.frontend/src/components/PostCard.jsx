import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageHelper';

// Ảnh mặc định từ Unsplash (blog thời trang) khi bài viết không có ảnh
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?auto=format&fit=crop&w=500&q=80';

const PostCard = ({ post }) => {
    const [imgError, setImgError] = useState(false);

    // Xác định URL ảnh: ưu tiên imageUrl từ API, fallback về ảnh mặc định
    const imgSrc = !imgError ? getImageUrl(post.imageUrl, DEFAULT_IMAGE) : DEFAULT_IMAGE;

    return (
        <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
            {/* Ảnh thumbnail */}
            <div className="overflow-hidden" style={{ height: '200px' }}>
                <img
                    src={imgSrc}
                    alt={post.title}
                    className="card-img-top h-100 w-100"
                    style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
                    onError={() => setImgError(true)}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
            </div>
            <div className="card-body d-flex flex-column">
                {/* Tiêu đề bài viết */}
                <h5 className="card-title fw-bold">
                    <Link to={`/blog/${post.id}`} className="text-dark text-decoration-none">
                        {post.title}
                    </Link>
                </h5>
                {/* Mô tả ngắn */}
                <p className="card-text text-muted small flex-grow-1">
                    {post.shortDescription || 'Nhấn để đọc bài viết chia sẻ về xu hướng phối đồ...'}
                </p>
                {/* Ngày tháng + nút đọc tiếp */}
                <div className="d-flex justify-content-between align-items-center text-muted small pt-2 border-top">
                    <span>
                        <i className="fa-regular fa-calendar me-1"></i>
                        {post.createdDate ? new Date(post.createdDate).toLocaleDateString('vi-VN') : ''}
                    </span>
                    <Link to={`/blog/${post.id}`} className="btn btn-outline-info btn-sm rounded-pill">
                        Đọc tiếp <i className="fa-solid fa-angle-right ms-1"></i>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
