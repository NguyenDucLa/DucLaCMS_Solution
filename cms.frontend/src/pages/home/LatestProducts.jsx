import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import productService from '../../services/productService';

const LatestProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                setLoading(true);
                const data = await productService.getLatestProducts();
                setProducts(data || []);
            } catch (error) {
                console.error('Lỗi khi tải sản phẩm mới nhất:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchLatest();
    }, []);

    if (loading) {
        return (
            <section className="py-5">
                <div className="container text-center">
                    <div className="spinner-border text-danger" role="status"></div>
                    <p className="mt-2 text-muted">Đang tải sản phẩm mới...</p>
                </div>
            </section>
        );
    }

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <section className="py-5" style={{ background: 'linear-gradient(135deg, #fff5f5 0%, #fff 100%)' }}>
            <div className="container">
                <div className="text-center mb-5">
                    <span className="badge bg-danger px-3 py-2 mb-2" style={{ fontSize: '0.8rem' }}>
                        <i className="fa-solid fa-bolt me-1"></i>VỪA RA MẮT
                    </span>
                    <h2 className="fw-bold text-uppercase" style={{ letterSpacing: '2px' }}>
                        <i className="fa-solid fa-star text-danger me-2"></i>Sản phẩm mới nhất
                    </h2>
                    <p className="text-muted">Những thiết kế mới nhất vừa được cập nhật</p>
                </div>

                <div className="row g-4 justify-content-center">
                    {products.map((item) => (
                        <div className="col-6 col-md-4 col-lg-4" key={item.id}>
                            <ProductCard product={item} />
                        </div>
                    ))}
                </div>

                <div className="text-center mt-4">
                    <Link to="/shop" className="btn btn-outline-danger rounded-pill px-5">
                        <i className="fa-solid fa-arrow-right me-2"></i>Khám phá thêm
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default LatestProducts;
