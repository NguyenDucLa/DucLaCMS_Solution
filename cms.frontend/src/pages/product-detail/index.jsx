import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import productService from '../../services/productService';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=500&q=80';

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        setLoading(true);
        productService.getProductById(id)
            .then(data => setProduct(data))
            .catch(() => setProduct(null))
            .finally(() => setLoading(false));
    }, [id]);

    const handleAddToCart = () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find(item => item.productId === product.id);
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                quantity: quantity
            });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) {
        return (
            <div>
                <Header />
                <div className="container text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-2 text-muted">Đang tải thông tin sản phẩm...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div>
                <Header />
                <div className="container text-center py-5">
                    <h3 className="text-muted">Không tìm thấy sản phẩm</h3>
                    <Link to="/shop" className="btn btn-dark mt-3">Quay lại cửa hàng</Link>
                </div>
                <Footer />
            </div>
        );
    }

    const imgSrc = product.imageUrl || DEFAULT_IMAGE;

    return (
        <div>
            <Header />
            <div className="container py-4">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                        <li className="breadcrumb-item"><Link to="/shop">Cửa hàng</Link></li>
                        <li className="breadcrumb-item active">{product.name}</li>
                    </ol>
                </nav>

                <div className="row g-5">
                    {/* Hình ảnh */}
                    <div className="col-md-6">
                        <div className="rounded-3 overflow-hidden shadow-sm">
                            <img src={imgSrc} alt={product.name} className="w-100" style={{ objectFit: 'cover', maxHeight: '500px' }} />
                        </div>
                    </div>

                    {/* Thông tin */}
                    <div className="col-md-6">
                        <h2 className="fw-bold mb-3">{product.name}</h2>
                        <h3 className="text-danger fw-bold mb-3">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </h3>

                        {product.categoryProductName && (
                            <p className="text-muted mb-3">
                                <i className="fa-regular fa-folder-open me-1"></i>Danh mục: {product.categoryProductName}
                            </p>
                        )}

                        <p className="mb-3">
                            <span className={`badge ${product.stockQuantity > 0 ? 'bg-success' : 'bg-danger'} me-2`}>
                                {product.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                            </span>
                            {product.stockQuantity > 0 && (
                                <span className="text-muted small">Kho: {product.stockQuantity} sản phẩm</span>
                            )}
                        </p>

                        {/* Mô tả chi tiết */}
                        {product.description && (
                            <div className="mb-4">
                                <h5 className="fw-bold">Mô tả sản phẩm</h5>
                                <p className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>{product.description}</p>
                            </div>
                        )}

                        {/* Chọn số lượng */}
                        {product.stockQuantity > 0 && (
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="input-group" style={{ width: '140px' }}>
                                    <button className="btn btn-outline-secondary" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                    <input type="text" className="form-control text-center" value={quantity} readOnly />
                                    <button className="btn btn-outline-secondary" onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}>+</button>
                                </div>
                            </div>
                        )}

                        {/* Nút thêm giỏ hàng */}
                        <button
                            className={`btn ${added ? 'btn-success' : 'btn-warning'} btn-lg fw-bold px-5 rounded-pill shadow-sm`}
                            onClick={handleAddToCart}
                            disabled={product.stockQuantity === 0}
                        >
                            {added ? (
                                <><i className="fa-solid fa-check me-2"></i>Đã thêm vào giỏ</>
                            ) : (
                                <><i className="fa-solid fa-cart-plus me-2"></i>Thêm vào giỏ hàng</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ProductDetail;
