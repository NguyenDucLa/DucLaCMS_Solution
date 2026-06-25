import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';
import { getImageUrl } from '../../utils/imageHelper';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80';

function HeroBanner() {
    const [products, setProducts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        productService.getAllProducts(1, 50)
            .then(data => setProducts(data?.items || []))
            .catch(() => {});
    }, []);

    const totalSlides = Math.min(products.length, 5);

    useEffect(() => {
        if (totalSlides < 2) return;
        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % totalSlides);
        }, 2000);
        return () => clearInterval(timer);
    }, [totalSlides]);

    const current = products.length > 0 ? products[currentIndex] : null;

    return (
        <section className="hero-banner position-relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                minHeight: '480px',
            }}>

            <div className="container h-100 position-relative" style={{ zIndex: 2 }}>
                <div className="row align-items-center" style={{ minHeight: '480px' }}>
                    {/* Cột trái: Nội dung quảng bá */}
                    <div className="col-lg-7 text-white">
                        <p className="text-uppercase small mb-3 fw-semibold" style={{ letterSpacing: '4px', opacity: 0.8 }}>
                            <i className="fa-solid fa-star me-2 text-warning"></i>
                            Bộ sưu tập mới 2026
                        </p>
                        <h1 className="display-4 fw-bold mb-3 lh-1">
                            Thời trang <span className="text-warning">Công sở</span><br />&amp; Dạ hội
                        </h1>
                        <p className="lead mb-4" style={{ opacity: 0.9, maxWidth: '520px' }}>
                            Khám phá phong cách thanh lịch, sang trọng dành cho quý cô hiện đại.
                            Ưu đãi lên đến <strong className="text-warning">50%</strong> cho đơn hàng đầu tiên.
                        </p>
                        <div className="d-flex gap-3 flex-wrap">
                            <Link to="/shop" className="btn btn-warning btn-lg fw-bold px-5 py-3 rounded-pill shadow-lg">
                                <i className="fa-solid fa-bag-shopping me-2"></i>Mua ngay
                            </Link>
                            <Link to="/blog" className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill">
                                <i className="fa-regular fa-newspaper me-2"></i>Khám phá
                            </Link>
                        </div>

                        {/* Dots điều hướng slide */}
                        {totalSlides > 1 && (
                            <div className="d-flex align-items-center gap-3 mt-4">
                                <div className="d-flex gap-2">
                                    {products.slice(0, totalSlides).map((_, idx) => (
                                        <button
                                            key={idx}
                                            className="rounded-circle border-0 p-0"
                                            style={{
                                                width: idx === currentIndex ? '28px' : '10px',
                                                height: '10px',
                                                background: idx === currentIndex ? '#ffc107' : 'rgba(255,255,255,0.4)',
                                                borderRadius: '5px !important',
                                                transition: 'all 0.3s ease',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => setCurrentIndex(idx)}
                                        ></button>
                                    ))}
                                </div>
                                {current && (
                                    <span className="small text-white-50">
                                        <i className="fa-solid fa-tag me-1"></i>{current.name}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Cột phải: Slider sản phẩm với hiệu ứng chuyển động */}
                    <div className="col-lg-5 d-none d-lg-block text-center">
                        <div className="position-relative" style={{ perspective: '1000px' }}>
                            {/* Ảnh sản phẩm dạng card nổi */}
                            <div className="position-relative d-inline-block"
                                style={{
                                    transform: 'rotateY(-5deg) rotateX(5deg)',
                                }}>
                                <div className="position-relative" style={{ width: '340px', height: '340px' }}>
                                    {/* Ảnh nền cũ - fade out */}
                                    {products.length > 1 && (
                                        <img
                                            key={'prev-' + currentIndex}
                                            src={getImageUrl(products[(currentIndex - 1 + products.length) % products.length]?.imageUrl, DEFAULT_IMAGE)}
                                            alt=""
                                            className="rounded-3 position-absolute"
                                            style={{
                                                width: '100%', height: '100%', objectFit: 'cover',
                                                border: '4px solid rgba(255,255,255,0.15)',
                                                opacity: 0,
                                                transition: 'opacity 0.8s ease',
                                            }}
                                        />
                                    )}
                                    {/* Ảnh hiện tại - fade in */}
                                    <img
                                        key={currentIndex}
                                        src={getImageUrl(current?.imageUrl, DEFAULT_IMAGE)}
                                        alt={current?.name || 'Sản phẩm'}
                                        className="rounded-3 shadow-lg position-absolute"
                                        style={{
                                            width: '100%', height: '100%', objectFit: 'cover',
                                            border: '4px solid rgba(255,255,255,0.15)',
                                            opacity: 1,
                                            transition: 'opacity 0.8s ease',
                                        }}
                                        onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
                                    />

                                    {/* Giá sản phẩm */}
                                    {current && (
                                        <div className="position-absolute bottom-0 start-0 end-0 p-3"
                                            style={{
                                                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                                                borderRadius: '0 0 10px 10px',
                                                zIndex: 2,
                                                animation: 'fadeInUp 0.5s ease',
                                            }}>
                                            <span className="text-white fw-bold fs-5">{current.name}</span>
                                            <br />
                                            <span className="text-warning fw-bold">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(current.price)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Badge giảm giá */}
                            <div className="position-absolute" style={{ top: '-10px', right: '20px' }}>
                                <span className="badge bg-danger rounded-pill px-3 py-2 shadow-lg" style={{ fontSize: '0.9rem' }}>
                                    <i className="fa-solid fa-tag me-1"></i>-50%
                                </span>
                            </div>

                            {/* Decoration circles */}
                            <div className="position-absolute rounded-circle"
                                style={{
                                    width: '100px', height: '100px',
                                    background: 'rgba(255,193,7,0.08)',
                                    bottom: '-20px', left: '-30px',
                                    zIndex: -1
                                }}></div>
                            <div className="position-absolute rounded-circle"
                                style={{
                                    width: '60px', height: '60px',
                                    background: 'rgba(233,69,96,0.1)',
                                    top: '20px', right: '-10px',
                                    zIndex: -1
                                }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Wave decoration */}
            <div className="position-absolute bottom-0 start-0 end-0" style={{ zIndex: 2 }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 70" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '70px' }}>
                    <path fill="#ffffff" d="M0,40L48,42.7C96,45,192,51,288,53.3C384,56,480,54,576,48C672,42,768,32,864,32C960,32,1056,42,1152,48C1248,54,1344,56,1392,53.3L1440,51L1440,70L1392,70C1344,70,1248,70,1152,70C1056,70,960,70,864,70C768,70,672,70,576,70C480,70,384,70,288,70C192,70,96,70,48,70L0,70Z"></path>
                </svg>
            </div>
        </section>
    );
}

export default HeroBanner;
