import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=100&q=80';

function Cart() {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(saved);
    }, []);

    const saveCart = (newCart) => {
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const updateQuantity = (productId, delta) => {
        const newCart = cart.map(item => {
            if (item.productId === productId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        });
        saveCart(newCart);
    };

    const removeItem = (productId) => {
        const newCart = cart.filter(item => item.productId !== productId);
        saveCart(newCart);
    };

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div>
            <Header />
            <div className="container py-4">
                <h2 className="fw-bold mb-4">
                    <i className="fa-solid fa-cart-shopping me-2"></i>Giỏ hàng
                    {totalItems > 0 && <span className="text-muted fs-6 ms-2">({totalItems} sản phẩm)</span>}
                </h2>

                {cart.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="fa-solid fa-cart-empty" style={{ fontSize: '4rem', color: '#ccc' }}></i>
                        <p className="text-muted mt-3 fs-5">Giỏ hàng của bạn đang trống.</p>
                        <Link to="/shop" className="btn btn-warning btn-lg fw-bold rounded-pill px-5">
                            <i className="fa-solid fa-bag-shopping me-2"></i>Mua sắm ngay
                        </Link>
                    </div>
                ) : (
                    <div className="row g-4">
                        {/* Danh sách sản phẩm */}
                        <div className="col-lg-8">
                            <div className="card shadow-sm border-0">
                                <div className="card-body p-4">
                                    {cart.map((item, index) => (
                                        <div key={item.productId} className={`d-flex align-items-center gap-3 ${index > 0 ? 'border-top pt-3 mt-3' : ''}`}>
                                            <img
                                                src={item.imageUrl || DEFAULT_IMAGE}
                                                alt={item.name}
                                                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                                                onError={(e) => e.target.src = DEFAULT_IMAGE}
                                            />
                                            <div className="flex-grow-1">
                                                <h6 className="fw-bold mb-1">
                                                    <Link to={`/product/${item.productId}`} className="text-dark text-decoration-none">
                                                        {item.name}
                                                    </Link>
                                                </h6>
                                                <p className="text-danger fw-bold mb-0">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                                </p>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <button className="btn btn-outline-secondary btn-sm" onClick={() => updateQuantity(item.productId, -1)}>-</button>
                                                <span className="mx-2 fw-bold" style={{ minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                                                <button className="btn btn-outline-secondary btn-sm" onClick={() => updateQuantity(item.productId, 1)}>+</button>
                                            </div>
                                            <div style={{ minWidth: '100px', textAlign: 'right' }}>
                                                <span className="fw-bold text-danger">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                                                </span>
                                            </div>
                                            <button className="btn btn-outline-danger btn-sm" onClick={() => removeItem(item.productId)} title="Xóa">
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Tổng tiền */}
                        <div className="col-lg-4">
                            <div className="card shadow-sm border-0">
                                <div className="card-body p-4">
                                    <h5 className="fw-bold mb-4">Tổng giỏ hàng</h5>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Tạm tính:</span>
                                        <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Phí vận chuyển:</span>
                                        <span className="text-success">Miễn phí</span>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between mb-4">
                                        <span className="fw-bold fs-5">Tổng cộng:</span>
                                        <span className="fw-bold fs-5 text-danger">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
                                        </span>
                                    </div>
                                    <Link to="/checkout" className="btn btn-warning w-100 fw-bold py-2 rounded-pill">
                                        <i className="fa-solid fa-credit-card me-2"></i>Tiến hành thanh toán
                                    </Link>
                                    <Link to="/shop" className="btn btn-outline-secondary w-100 mt-2 rounded-pill">
                                        <i className="fa-solid fa-arrow-left me-2"></i>Tiếp tục mua sắm
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Cart;
