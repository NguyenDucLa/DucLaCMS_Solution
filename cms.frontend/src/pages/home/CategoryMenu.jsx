import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import categoryProductService from '../../services/categoryProductService';

// Màu sắc và icon cho từng danh mục
const CATEGORY_STYLES = {
    'Điện tử': { icon: 'fa-solid fa-laptop', color: '#4a90d9' },
    'Gia dụng': { icon: 'fa-solid fa-kitchen-set', color: '#27ae60' },
    'Thời trang': { icon: 'fa-solid fa-shirt', color: '#e74c3c' },
};

const DEFAULT_STYLE = { icon: 'fa-solid fa-tag', color: '#6c757d' };

const CategoryMenu = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const data = await categoryProductService.getAllCategoryProducts();
                setCategories(data);
            } catch (error) {
                console.error("Lỗi khi tải danh mục sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <section className="py-3 bg-light">
                <div className="container text-center">
                    <div className="spinner-border spinner-border-sm text-muted" role="status"></div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-4" style={{ background: '#f8f9fa' }}>
            <div className="container">
                <h5 className="text-center text-uppercase fw-bold text-muted mb-4" style={{ letterSpacing: '2px', fontSize: '0.9rem' }}>
                    <i className="fa-solid fa-cubes me-2"></i>Danh mục sản phẩm
                </h5>
                <div className="row g-3 justify-content-center">
                    <div className="col-4 col-md-2">
                        <Link to="/shop" className="text-decoration-none">
                            <div className="card border-0 shadow-sm rounded-3 text-center p-3 h-100 bg-white"
                                style={{ transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer' }}
                                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)'; }}
                                onMouseOut={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                            >
                                <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
                                    style={{ width: '60px', height: '60px', background: '#343a40' }}>
                                    <i className="fa-solid fa-th-list text-white" style={{ fontSize: '1.4rem' }}></i>
                                </div>
                                <span className="fw-bold small text-dark">Tất cả</span>
                            </div>
                        </Link>
                    </div>
                    {categories.map((cat) => {
                        const style = CATEGORY_STYLES[cat.name] || DEFAULT_STYLE;
                        return (
                            <div className="col-4 col-md-2" key={cat.id}>
                                <Link to={`/shop?category=${cat.id}`} className="text-decoration-none">
                                    <div className="card border-0 shadow-sm rounded-3 text-center p-3 h-100"
                                        style={{ transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer' }}
                                        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)'; }}
                                        onMouseOut={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                                    >
                                        <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
                                            style={{ width: '60px', height: '60px', background: style.color }}>
                                            <i className={`${style.icon} text-white`} style={{ fontSize: '1.4rem' }}></i>
                                        </div>
                                        <span className="fw-bold small text-dark">{cat.name}</span>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CategoryMenu;
