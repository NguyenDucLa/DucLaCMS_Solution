import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import productService from '../../services/productService';
import categoryProductService from '../../services/categoryProductService';
import searchService from '../../services/searchService';

const PAGE_SIZE = 4;

function Shop() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Price filter state
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [appliedMinPrice, setAppliedMinPrice] = useState('');
    const [appliedMaxPrice, setAppliedMaxPrice] = useState('');

    useEffect(() => {
        categoryProductService.getAllCategoryProducts()
            .then(setCategories)
            .catch(() => {});
    }, []);

    const fetchProducts = useCallback((catId, pageNum, minP, maxP) => {
        setLoading(true);

        const hasPrice = (minP !== '' && minP !== null && minP !== undefined) ||
                         (maxP !== '' && maxP !== null && maxP !== undefined);

        let fetch;
        if (hasPrice) {
            fetch = searchService.filter(
                { minPrice: minP || undefined, maxPrice: maxP || undefined, categoryId: catId },
                pageNum, PAGE_SIZE
            );
        } else if (catId !== null && catId !== undefined) {
            fetch = productService.getProductsByCategory(catId, pageNum, PAGE_SIZE);
        } else {
            fetch = productService.getAllProducts(pageNum, PAGE_SIZE);
        }

        fetch
            .then(data => {
                setProducts(data.items || []);
                setTotalPages(data.totalPages || 1);
                setTotalItems(data.totalItems || 0);
            })
            .catch(() => {
                setProducts([]);
                setTotalPages(1);
                setTotalItems(0);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchProducts(null, 1, '', '');
    }, [fetchProducts]);

    const handleCategoryClick = (catId) => {
        setActiveCategory(catId);
        setPage(1);
        setMinPrice('');
        setMaxPrice('');
        setAppliedMinPrice('');
        setAppliedMaxPrice('');
        fetchProducts(catId, 1, '', '');
        if (catId !== null && catId !== undefined) {
            navigate(`/shop?category=${catId}`, { replace: true });
        } else {
            navigate('/shop', { replace: true });
        }
    };

    const handlePriceFilter = () => {
        const min = parseFloat(minPrice);
        const max = parseFloat(maxPrice);
        if ((minPrice && isNaN(min)) || (maxPrice && isNaN(max))) return;
        if (minPrice && maxPrice && min > max) {
            alert('Giá Min phải nhỏ hơn hoặc bằng giá Max');
            return;
        }
        setAppliedMinPrice(minPrice);
        setAppliedMaxPrice(maxPrice);
        setPage(1);
        fetchProducts(activeCategory, 1, minPrice, maxPrice);
    };

    const goToPage = (p) => {
        if (p < 1 || p > totalPages) return;
        setPage(p);
        fetchProducts(activeCategory, p, appliedMinPrice, appliedMaxPrice);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getPageNumbers = () => {
        const pages = [];
        const start = Math.max(1, page - 2);
        const end = Math.min(totalPages, page + 2);
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    };

    return (
        <div>
            <Header />
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                    <h2 className="fw-bold mb-0">
                        <i className="fa-solid fa-store me-2"></i>Cửa hàng
                    </h2>
                    {!loading && totalItems > 0 && (
                        <span className="text-muted small">{totalItems} sản phẩm</span>
                    )}
                </div>

                {/* Bộ lọc danh mục */}
                <div className="d-flex flex-wrap gap-2 mb-3">
                    <button
                        className={`btn btn-sm rounded-pill px-3 ${activeCategory === null && !appliedMinPrice && !appliedMaxPrice ? 'btn-dark' : 'btn-outline-secondary'}`}
                        onClick={() => handleCategoryClick(null)}>
                        <i className="fa-solid fa-th-list me-1"></i>Tất cả
                    </button>
                    {categories.map(cat => (
                        <button key={cat.id}
                            className={`btn btn-sm rounded-pill px-3 ${activeCategory === cat.id ? 'btn-dark' : 'btn-outline-secondary'}`}
                            onClick={() => handleCategoryClick(cat.id)}>
                            <i className="fa-solid fa-tag me-1"></i>{cat.name}
                        </button>
                    ))}
                </div>

                {/* Thanh lọc giá */}
                <div className="card shadow-sm border-0 mb-4">
                    <div className="card-body py-3">
                        <div className="row align-items-center g-2">
                            <div className="col-auto">
                                <span className="fw-bold small text-muted"><i className="fa-solid fa-filter me-1"></i>Lọc giá:</span>
                            </div>
                            <div className="col-auto">
                                <input type="number" className="form-control form-control-sm" style={{ width: '120px' }}
                                    placeholder="₫ TỐI THIỂU" value={minPrice}
                                    onChange={e => setMinPrice(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handlePriceFilter()} />
                            </div>
                            <div className="col-auto">
                                <span className="text-muted">—</span>
                            </div>
                            <div className="col-auto">
                                <input type="number" className="form-control form-control-sm" style={{ width: '120px' }}
                                    placeholder="₫ TỐI ĐA" value={maxPrice}
                                    onChange={e => setMaxPrice(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handlePriceFilter()} />
                            </div>
                            <div className="col-auto">
                                <button className="btn btn-dark btn-sm rounded-pill px-3" onClick={handlePriceFilter}>
                                    <i className="fa-solid fa-magnifying-glass-dollar me-1"></i>Áp dụng
                                </button>
                            </div>
                            {(appliedMinPrice || appliedMaxPrice) && (
                                <div className="col-auto">
                                    <button className="btn btn-outline-danger btn-sm rounded-pill px-3"
                                        onClick={() => { setMinPrice(''); setMaxPrice(''); setAppliedMinPrice(''); setAppliedMaxPrice('');
                                            fetchProducts(activeCategory, 1, '', ''); setPage(1); }}>
                                        <i className="fa-solid fa-xmark me-1"></i>Bỏ lọc
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                        <p className="mt-2 text-muted">Đang tải sản phẩm...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-5">
                        <img src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png"
                            alt="Không tìm thấy" style={{ width: '150px', opacity: 0.6 }} className="mb-3" />
                        <h5 className="text-muted">Không tìm thấy sản phẩm nào phù hợp với tiêu chí của bạn</h5>
                        <p className="text-muted small">Thử thay đổi khoảng giá hoặc danh mục khác</p>
                        <button className="btn btn-dark rounded-pill px-4 mt-2"
                            onClick={() => handleCategoryClick(null)}>
                            <i className="fa-solid fa-rotate-left me-2"></i>Xem tất cả sản phẩm
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="row g-4">
                            {products.map(item => (
                                <div className="col-6 col-md-4 col-lg-3" key={item.id}>
                                    <ProductCard product={item} />
                                </div>
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <nav className="d-flex justify-content-center mt-5" aria-label="Phân trang">
                                <ul className="pagination pagination-sm">
                                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => goToPage(page - 1)}><i className="fa-solid fa-chevron-left"></i></button>
                                    </li>
                                    {getPageNumbers().map(p => (
                                        <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => goToPage(p)}>{p}</button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => goToPage(page + 1)}><i className="fa-solid fa-chevron-right"></i></button>
                                    </li>
                                </ul>
                            </nav>
                        )}
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Shop;
