import React from 'react';
import { Link } from 'react-router-dom';

function HeroBanner() {
    return (
        <section className="hero-banner position-relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                minHeight: '420px',
            }}>
            <div className="container h-100">
                <div className="row align-items-center" style={{ minHeight: '420px' }}>
                    {/* Cột trái: Nội dung quảng bá */}
                    <div className="col-lg-7 text-white">
                        <p className="text-uppercase small mb-2" style={{ letterSpacing: '3px', opacity: 0.8 }}>
                            <i className="fa-solid fa-star me-2 text-warning"></i>Bộ sưu tập mới 2026
                        </p>
                        <h1 className="display-4 fw-bold mb-3">
                            Thời trang Công sở <br />&amp; Dạ hội
                        </h1>
                        <p className="lead mb-4" style={{ opacity: 0.9 }}>
                            Khám phá phong cách thanh lịch, sang trọng dành cho quý cô hiện đại.
                            Ưu đãi lên đến <strong className="text-warning">50%</strong> cho đơn hàng đầu tiên.
                        </p>
                        <div className="d-flex gap-3">
                            <Link to="/shop" className="btn btn-warning btn-lg fw-bold px-5 py-3 rounded-pill shadow-lg">
                                <i className="fa-solid fa-bag-shopping me-2"></i>Mua ngay
                            </Link>
                            <Link to="/blog" className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill">
                                <i className="fa-regular fa-newspaper me-2"></i>Khám phá
                            </Link>
                        </div>
                    </div>

                    {/* Cột phải: Hình ảnh trang trí */}
                    <div className="col-lg-5 d-none d-lg-block text-center">
                        <div className="position-relative">
                            <i className="fa-solid fa-vest" style={{ fontSize: '12rem', opacity: 0.15, color: '#e94560' }}></i>
                            <div className="position-absolute top-50 start-50 translate-middle">
                                <span className="badge bg-danger rounded-pill px-4 py-3 shadow-lg" style={{ fontSize: '1.2rem' }}>
                                    <i className="fa-solid fa-tag me-2"></i>Giảm 50%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Wave decoration ở cuối banner */}
            <div className="position-absolute bottom-0 start-0 end-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '60px' }}>
                    <path fill="#ffffff" d="M0,32L48,37.3C96,43,192,53,288,53.3C384,53,480,43,576,37.3C672,32,768,32,864,37.3C960,43,1056,53,1152,53.3C1248,53,1344,43,1392,37.3L1440,32L1440,60L1392,60C1344,60,1248,60,1152,60C1056,60,960,60,864,60C768,60,672,60,576,60C480,60,384,60,288,60C192,60,96,60,48,60L0,60Z"></path>
                </svg>
            </div>
        </section>
    );
}

export default HeroBanner;
