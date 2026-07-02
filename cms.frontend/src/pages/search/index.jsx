import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import searchService from '../../services/searchService';

function SearchResults() {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('q') || '';
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        if (!keyword.trim()) {
            setProducts([]);
            setTotalItems(0);
            return;
        }
        setLoading(true);
        searchService.search(keyword)
            .then(data => {
                setProducts(data.items || []);
                setTotalItems(data.totalItems || 0);
            })
            .catch(() => {
                setProducts([]);
                setTotalItems(0);
            })
            .finally(() => setLoading(false));
    }, [keyword]);

    return (
        <div>
            <Header />
            <div className="container py-4">
                <h4 className="fw-bold mb-3">
                    <i className="fa-solid fa-search me-2"></i>
                    Kết quả tìm kiếm: "<span className="text-danger">{keyword}</span>"
                </h4>
                {!loading && totalItems > 0 && (
                    <p className="text-muted small mb-4">Tìm thấy {totalItems} sản phẩm</p>
                )}

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                        <p className="mt-2 text-muted">Đang tìm kiếm...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-5">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png"
                            alt="Không tìm thấy"
                            style={{ width: '150px', opacity: 0.6 }}
                            className="mb-3"
                        />
                        <h5 className="text-muted">Không tìm thấy sản phẩm nào phù hợp với tiêu chí của bạn</h5>
                        <p className="text-muted small">Thử thay đổi từ khóa hoặc xem tất cả sản phẩm</p>
                        <Link to="/shop" className="btn btn-dark rounded-pill px-4 mt-2">
                            <i className="fa-solid fa-store me-2"></i>Xem tất cả sản phẩm
                        </Link>
                    </div>
                ) : (
                    <div className="row g-4">
                        {products.map(item => (
                            <div className="col-6 col-md-4 col-lg-3" key={item.id}>
                                <ProductCard product={item} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default SearchResults;
