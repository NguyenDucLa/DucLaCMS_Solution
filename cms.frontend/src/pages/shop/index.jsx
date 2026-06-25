import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import productService from '../../services/productService';
import categoryProductService from '../../services/categoryProductService';

const PAGE_SIZE = 4;

function Shop() {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const catFromUrl = searchParams.get('category');

    useEffect(() => {
        const catId = catFromUrl ? Number(catFromUrl) : null;
        setActiveCategory(catId);
        setPage(1);
    }, [catFromUrl]);

    useEffect(() => {
        categoryProductService.getAllCategoryProducts()
            .then(setCategories)
            .catch(() => {});
    }, []);

    const fetchProducts = useCallback(() => {
        setLoading(true);
        const fetch = activeCategory
            ? productService.getProductsByCategory(activeCategory, page, PAGE_SIZE)
            : productService.getAllProducts(page, PAGE_SIZE);

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
    }, [activeCategory, page]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const goToPage = (p) => {
        if (p < 1 || p > totalPages) return;
        setPage(p);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Tạo mảng số trang hiển thị (tối đa 5)
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
                        <span className="text-muted small">
                            {totalItems} sản phẩm
                        </span>
                    )}
                </div>

                {/* Bộ lọc danh mục */}
                <div className="d-flex flex-wrap gap-2 mb-4">
                    <button
                        className={`btn btn-sm rounded-pill px-3 ${activeCategory === null ? 'btn-dark' : 'btn-outline-secondary'}`}
                        onClick={() => { window.location.href = '/shop'; }}
                    >
                        <i className="fa-solid fa-th-list me-1"></i>Tất cả
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`btn btn-sm rounded-pill px-3 ${activeCategory === cat.id ? 'btn-dark' : 'btn-outline-secondary'}`}
                            onClick={() => { window.location.href = `/shop?category=${cat.id}`; }}
                        >
                            <i className="fa-solid fa-tag me-1"></i>{cat.name}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                        <p className="mt-2 text-muted">Đang tải sản phẩm...</p>
                    </div>
                ) : products.length === 0 ? (
                    <p className="text-center text-muted py-5">Không có sản phẩm nào.</p>
                ) : (
                    <>
                        <div className="row g-4">
                            {products.map(item => (
                                <div className="col-6 col-md-4 col-lg-3" key={item.id}>
                                    <ProductCard product={item} />
                                </div>
                            ))}
                        </div>

                        {/* Phân trang */}
                        {totalPages > 1 && (
                            <nav className="d-flex justify-content-center mt-5" aria-label="Phân trang">
                                <ul className="pagination pagination-sm">
                                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => goToPage(page - 1)}>
                                            <i className="fa-solid fa-chevron-left"></i>
                                        </button>
                                    </li>
                                    {getPageNumbers().map(p => (
                                        <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => goToPage(p)}>{p}</button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => goToPage(page + 1)}>
                                            <i className="fa-solid fa-chevron-right"></i>
                                        </button>
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
