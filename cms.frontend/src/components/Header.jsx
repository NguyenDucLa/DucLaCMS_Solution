import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
            <div className="container">
                {/* Logo thương hiệu */}
                <Link className="navbar-brand fw-bold text-uppercase" to="/" style={{ letterSpacing: '1px' }}>
                    <i className="fa-solid fa-gem me-2 text-warning"></i>Fashion Boutique
                </Link>

                {/* Nút toggle cho mobile */}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar">
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
                        <form className="d-none d-md-flex me-3" role="search">
                            <input className="form-control form-control-sm me-2" type="search" placeholder="Tìm sản phẩm..." aria-label="Search" style={{ minWidth: '180px' }} />
                            <button className="btn btn-outline-light btn-sm" type="submit">
                                <i className="fa-solid fa-search"></i>
                            </button>
                        </form>
                        <Link to="/cart" className="btn btn-outline-light btn-sm position-relative me-2">
                            <i className="fa-solid fa-cart-shopping"></i>
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                                0
                            </span>
                        </Link>
                        <Link to="/checkout" className="btn btn-warning btn-sm fw-bold">
                            <i className="fa-solid fa-right-to-bracket me-1"></i>Đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header;
