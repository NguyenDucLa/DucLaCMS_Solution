import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageHelper';

// Ảnh mặc định từ Unsplash (quần áo thời trang) khi sản phẩm không có ảnh
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=500&q=80';

const ProductCard = ({ product }) => {
    const [imgError, setImgError] = useState(false);

    // Xác định URL ảnh: ưu tiên imageUrl từ API, fallback về ảnh mặc định
    const imgSrc = !imgError ? getImageUrl(product.imageUrl, DEFAULT_IMAGE) : DEFAULT_IMAGE;

    return (
        <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
            {/* Ảnh sản phẩm */}
            <div className="overflow-hidden" style={{ height: '220px' }}>
                <img
                    src={imgSrc}
                    alt={product.name}
                    className="card-img-top h-100 w-100"
                    style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
                    onError={() => setImgError(true)}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
            </div>
            <div className="card-body d-flex flex-column">
                {/* Tên sản phẩm */}
                <h6 className="card-title fw-bold mb-2" style={{ fontSize: '0.95rem' }}>
                    <Link to={`/product/${product.id}`} className="text-dark text-decoration-none">
                        {product.name}
                    </Link>
                </h6>
                {/* Giá tiền */}
                <p className="text-danger fw-bold mb-2">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                </p>
                {/* Danh mục */}
                {product.categoryProductName && (
                    <p className="small text-muted mb-2">
                        <i className="fa-regular fa-folder-open me-1"></i>{product.categoryProductName}
                    </p>
                )}
                {/* Nút Xem chi tiết */}
                <div className="mt-auto">
                    <Link to={`/product/${product.id}`} className="btn btn-outline-primary btn-sm w-100 rounded-pill">
                        <i className="fa-solid fa-eye me-1"></i>Xem chi tiết
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
