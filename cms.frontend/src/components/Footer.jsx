import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-dark text-light pt-5 pb-3 mt-auto">
            <div className="container">
                <div className="row">
                    {/* Cột 1: Thông tin cửa hàng */}
                    <div className="col-md-4 mb-4">
                        <h5 className="text-uppercase fw-bold mb-3" style={{ letterSpacing: '1px' }}>
                            <i className="fa-solid fa-gem text-warning me-2"></i>Fashion Boutique
                        </h5>
                        <p className="small text-secondary mb-1">
                            <i className="fa-solid fa-location-dot me-2"></i>123 Nguyễn Huệ, Quận 1, TP.HCM
                        </p>
                        <p className="small text-secondary mb-1">
                            <i className="fa-solid fa-phone me-2"></i>Hotline: 1900 1234
                        </p>
                        <p className="small text-secondary mb-1">
                            <i className="fa-solid fa-envelope me-2"></i>info@fashionboutique.vn
                        </p>
                    </div>

                    {/* Cột 2: Liên kết nhanh */}
                    <div className="col-md-4 mb-4">
                        <h6 className="text-uppercase fw-bold mb-3">Chính sách</h6>
                        <ul className="list-unstyled small">
                            <li className="mb-2"><Link to="/" className="text-secondary text-decoration-none">Chính sách bảo mật</Link></li>
                            <li className="mb-2"><Link to="/" className="text-secondary text-decoration-none">Chính sách đổi trả</Link></li>
                            <li className="mb-2"><Link to="/" className="text-secondary text-decoration-none">Hướng dẫn chọn size</Link></li>
                            <li className="mb-2"><Link to="/" className="text-secondary text-decoration-none">Vận chuyển & giao hàng</Link></li>
                        </ul>
                    </div>

                    {/* Cột 3: Mạng xã hội */}
                    <div className="col-md-4 mb-4">
                        <h6 className="text-uppercase fw-bold mb-3">Kết nối với chúng tôi</h6>
                        <div className="d-flex gap-3">
                            <a href="https://facebook.com" className="btn btn-outline-light btn-sm rounded-circle" target="_blank" rel="noreferrer">
                                <i className="fa-brands fa-facebook-f"></i>
                            </a>
                            <a href="https://instagram.com" className="btn btn-outline-light btn-sm rounded-circle" target="_blank" rel="noreferrer">
                                <i className="fa-brands fa-instagram"></i>
                            </a>
                            <a href="https://tiktok.com" className="btn btn-outline-light btn-sm rounded-circle" target="_blank" rel="noreferrer">
                                <i className="fa-brands fa-tiktok"></i>
                            </a>
                        </div>
                        <p className="small text-secondary mt-3 mb-0">
                            <i className="fa-regular fa-clock me-2"></i>8:00 - 21:00 (T2 - CN)
                        </p>
                    </div>
                </div>

                <hr className="border-secondary" />
                <p className="text-center small text-secondary mb-0">
                    © 2026 Fashion Boutique - Đồ án thực hành ASP.NET Core + ReactJS
                </p>
            </div>
        </footer>
    );
}

export default Footer;
