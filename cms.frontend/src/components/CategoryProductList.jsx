import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import categoryProductService from '../services/categoryProductService';

const CategoryProductList = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const activeCategory = searchParams.get('category');

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                setLoading(true);
                const data = await categoryProductService.getAllCategoryProducts();
                setCategoryProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh mục sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategoryProducts();
    }, []);

    const handleFilter = (catId) => {
        if (catId) {
            navigate(`/shop?category=${catId}`);
        } else {
            navigate('/shop');
        }
    };

    if (loading) {
        return <div className="text-center my-4">Đang tải danh mục...</div>;
    }

    return (
        <div className="card shadow-sm border-0 rounded-lg">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-2 px-4">
                <h5 className="card-title text-uppercase fw-bold text-dark d-flex align-items-center mb-0" style={{ letterSpacing: '0.5px', fontSize: '1.1rem' }}>
                    <i className="fa-solid fa-cubes text-primary me-2"></i> Danh mục sản phẩm
                </h5>
            </div>
            <div className="card-body p-0">
                <div className="list-group list-group-flush">
                    <button
                        type="button"
                        className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center px-4 py-3 ${!activeCategory ? 'active' : ''}`}
                        onClick={() => handleFilter(null)}
                    >
                        <span className="fw-bold">
                            <i className="fa-solid fa-th-list me-2"></i>Tất cả sản phẩm
                        </span>
                        <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.8rem', opacity: 0.5 }}></i>
                    </button>

                    {categoryProducts.length === 0 ? (
                        <div className="p-4 text-center text-muted">Không có danh mục nào.</div>
                    ) : (
                        categoryProducts.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center px-4 py-3 ${activeCategory === String(item.id) ? 'active' : ''}`}
                                onClick={() => handleFilter(item.id)}
                            >
                                <span>{item.name}</span>
                                <i className="fa-solid fa-chevron-right text-muted" style={{ fontSize: '0.8rem', opacity: 0.5 }}></i>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryProductList;
