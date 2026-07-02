import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import productService from '../../services/productService';

const BestSellingProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBestSelling = async () => {
            try {
                setLoading(true);
                const data = await productService.getBestSellingProducts();
                setProducts(data || []);
            } catch (error) {
                console.error('Lỗi khi tải sản phẩm bán chạy:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchBestSelling();
    }, []);

    if (loading) {
        return (
            <section className="py-5 bg-dark">
                <div className="container text-center">
                    <div className="spinner-border text-warning" role="status"></div>
                    <p className="mt-2 text-light">Đang tải sản phẩm bán chạy...</p>
                </div>
            </section>
        );
    }

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <section className="py-5" style={{ background: '#1a1a2e' }}>
            <div className="container">
                <div className="text-center mb-5">
                    <span className="badge bg-warning text-dark px-3 py-2 mb-2" style={{ fontSize: '0.8rem' }}>
                        <i className="fa-solid fa-fire me-1"></i>HOT
                    </span>
                    <h2 className="fw-bold text-uppercase text-white" style={{ letterSpacing: '2px' }}>
                        <i className="fa-solid fa-crown text-warning me-2"></i>Sản phẩm bán chạy
                    </h2>
                    <p className="text-white-50">Những sản phẩm được yêu thích nhất</p>
                </div>

                <div className="row g-4 justify-content-center">
                    {products.map((item, index) => (
                        <div className="col-6 col-md-4 col-lg-4 position-relative" key={item.productId || item.id}>
                            {/* Huy hiệu thứ hạng */}
                            <div className="position-absolute top-0 start-0 z-1" style={{ marginLeft: '-5px', marginTop: '-5px' }}>
                                <span className={`badge fs-6 px-3 py-2 ${
                                    index === 0 ? 'bg-warning' : index === 1 ? 'bg-secondary' : 'bg-danger'
                                }`}>
                                    <i className={`fa-solid ${
                                        index === 0 ? 'fa-crown' : index === 1 ? 'fa-medal' : 'fa-award'
                                    } me-1`}></i>
                                    #{index + 1}
                                </span>
                            </div>
                            <ProductCard product={item} />
                        </div>
                    ))}
                </div>

                <div className="text-center mt-4">
                    <Link to="/shop" className="btn btn-warning rounded-pill px-5 fw-bold text-dark">
                        <i className="fa-solid fa-arrow-right me-2"></i>Xem tất cả
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BestSellingProducts;
