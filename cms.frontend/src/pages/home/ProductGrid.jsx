import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import productService from '../../services/productService';

const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách sản phẩm:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <section className="py-5">
                <div className="container text-center">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-2 text-muted">Đang tải sản phẩm thời trang...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-5 bg-light">
            <div className="container">
                {/* Tiêu đề khu vực */}
                <div className="text-center mb-5">
                    <h2 className="fw-bold text-uppercase" style={{ letterSpacing: '2px' }}>
                        <i className="fa-solid fa-crown text-warning me-2"></i>Bộ sưu tập mới nhất
                    </h2>
                    <p className="text-muted">Những thiết kế thời trang công sở & dạ hội được yêu thích nhất</p>
                </div>

                {products.length === 0 ? (
                    <p className="text-center text-muted">Chưa có sản phẩm nào.</p>
                ) : (
                    <div className="row g-4">
                        {products.slice(0, 8).map((item) => (
                            <div className="col-6 col-md-3" key={item.id}>
                                <ProductCard product={item} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Nút xem tất cả */}
                <div className="text-center mt-4">
                    <Link to="/shop" className="btn btn-dark rounded-pill px-5">
                        <i className="fa-solid fa-arrow-right me-2"></i>Xem tất cả sản phẩm
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ProductGrid;
