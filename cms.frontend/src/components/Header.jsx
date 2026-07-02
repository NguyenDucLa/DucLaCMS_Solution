import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function Header() {
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);
    const [user, setUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const updateCart = () => {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const total = cart.reduce((sum, item) => sum + item.quantity, 0);
            setCartCount(total);
        };
        updateCart();
        window.addEventListener('storage', updateCart);
        window.addEventListener('cartUpdated', updateCart);
        return () => {
            window.removeEventListener('storage', updateCart);
            window.removeEventListener('cartUpdated', updateCart);
        };
    }, []);

    // Kiểm tra trạng thái đăng nhập User (admin/editor)
    const checkAuth = () => {
        authService.getMe()
            .then(data => {
                setUser(data.isAuthenticated ? data : null);
            })
            .catch(() => {
                setUser(null);
            })
            .finally(() => setCheckingAuth(false));
    };

    useEffect(() => {
        checkAuth();
        window.addEventListener('authChanged', checkAuth);
        return () => {
            window.removeEventListener('authChanged', checkAuth);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch { /* ignore */ }
        setUser(null);
        window.dispatchEvent(new Event('authChanged'));
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
            <div className="container">
                {/* Logo thương hiệu */}
                <Link className="navbar-brand fw-bold text-uppercase" to="/" style={{ letterSpacing: '1px' }}>
                    <i className="fa-solid fa-gem me-2 text-warning"></i>Fashion Boutique
                </Link>

                {/* Nút toggle cho mobile */}
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mainNavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Menu điều hướng */}
                <div className="collapse navbar-collapse" id="mainNavbar">
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" to="/">Trang chủ</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/shop">Cửa hàng</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/blog">Tin tức</Link>
                        </li>
                    </ul>

                    {/* Ô tìm kiếm + Giỏ hàng */}
                    <div className="d-flex align-items-center">
                        <form className="d-none d-md-flex me-3" role="search"
                            onSubmit={(e) => {
                                e.preventDefault();
                                const keyword = e.target.searchInput.value.trim();
                                if (keyword) {
                                    navigate(`/search?q=${encodeURIComponent(keyword)}`);
                                }
                            }}
                        >
                            <input name="searchInput" className="form-control form-control-sm me-2" type="search" placeholder="Tìm sản phẩm..." aria-label="Search" style={{ minWidth: '180px' }} />
                            <button className="btn btn-outline-light btn-sm" type="submit">
                                <i className="fa-solid fa-search"></i>
                            </button>
                        </form>
                        <Link to="/cart" className="btn btn-outline-light btn-sm position-relative me-2">
                            <i className="fa-solid fa-cart-shopping"></i>
                            {cartCount > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        {checkingAuth ? (
                            <span className="text-light small">...</span>
                        ) : user ? (
                            <div className="dropdown">
                                <button className="btn btn-warning btn-sm fw-bold dropdown-toggle d-flex align-items-center gap-1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="fa-solid fa-user"></i>
                                    <span>{user.fullName || user.username}</span>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end shadow" style={{ minWidth: '200px' }}>
                                    <li>
                                        <span className="dropdown-item-text small text-muted d-flex align-items-center gap-2">
                                            <i className="fa-solid fa-user-tag"></i>
                                            <span>{user.role}</span>
                                        </span>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <Link className="dropdown-item d-flex align-items-center gap-2" to="/profile">
                                            <i className="fa-solid fa-user-gear"></i>
                                            <span>Hồ sơ cá nhân</span>
                                        </Link>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button className="dropdown-item text-danger d-flex align-items-center gap-2" onClick={handleLogout}>
                                            <i className="fa-solid fa-right-from-bracket"></i>
                                            <span>Đăng xuất</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <div className="d-flex gap-1">
                                <Link to="/register" className="btn btn-outline-light btn-sm">
                                    <i className="fa-solid fa-user-plus me-1"></i>Đăng ký
                                </Link>
                                <Link to="/login" className="btn btn-warning btn-sm fw-bold">
                                    <i className="fa-solid fa-right-to-bracket me-1"></i>Đăng nhập
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header;
