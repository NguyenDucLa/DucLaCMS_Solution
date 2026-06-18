import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import categoryProductService from '../../services/categoryProductService';

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

    return (
        <section className="py-3 bg-white shadow-sm">
            <div className="container">
                {loading ? (
                    <div className="text-center text-muted small py-2">Đang tải danh mục...</div>
                ) : (
                    <div className="d-flex flex-wrap justify-content-center gap-2">
                        <Link to="/shop" className="btn btn-outline-dark btn-sm rounded-pill px-4 fw-bold">
                            <i className="fa-solid fa-th-list me-1"></i>Tất cả
                        </Link>
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                to={`/shop?category=${cat.id}`}
                                className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                            >
                                <i className="fa-solid fa-tag me-1"></i>{cat.name}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default CategoryMenu;
