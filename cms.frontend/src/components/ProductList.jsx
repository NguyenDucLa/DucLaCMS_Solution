import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

const ProductList = ({ selectedCategoryId }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setProducts([]); // Xóa dữ liệu cũ trước khi fetch mới
                let data;
                if (selectedCategoryId !== null) {
                    // Lọc sản phẩm theo danh mục
                    data = await productService.getProductsByCategory(selectedCategoryId);
                } else {
                    // Lấy tất cả sản phẩm
                    data = await productService.getAllProducts();
                }
                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách sản phẩm:", error);
                setProducts([]); // Đảm bảo clear dữ liệu nếu API lỗi
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategoryId]); // Lắng nghe sự thay đổi của selectedCategoryId

    if (loading) {
        return <div className="text-center my-4">Đang tải danh sách sản phẩm thời trang...</div>;
    }

    return (
        <div className="row">
            {products.length === 0 ? (
                <div className="col-12">
                    <p className="text-muted">Chưa có sản phẩm nào trong hệ thống.</p>
                </div>
            ) : (
                products.map((item) => (
                    <div className="col-md-6 mb-4" key={item.id}>
                        <div className="card h-100 shadow-sm border-0 rounded-lg">
                            <div className="card-body d-flex flex-column">
                                {/* Phần Header: Tên sản phẩm */}
                                <h5 className="card-title font-weight-bold text-dark mb-3">
                                    {item.name}
                                </h5>

                                {/* Phần Giá tiền */}
                                <p className="card-text mb-2">
                                    <span className="text-danger font-weight-bold" style={{ fontSize: '1.2rem' }}>
                                        <i className="fa-solid fa-tag mr-1"></i>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                    </span>
                                </p>

                                {/* Phần danh mục sản phẩm */}
                                {item.categoryProductName && (
                                    <p className="card-text small mb-2">
                                        <i className="fa-regular fa-folder-open text-muted mr-1"></i>
                                        <span className="text-muted">{item.categoryProductName}</span>
                                    </p>
                                )}

                                {/* Phần tồn kho */}
                                <p className="card-text small text-muted mb-0 mt-auto">
                                    <i className="fa-regular fa-circle-check mr-1"></i>
                                    Số lượng tồn kho: <strong>{item.stockQuantity}</strong> sản phẩm
                                </p>
                            </div>
                            <div className="card-footer bg-transparent border-top-0 pt-0 px-3 pb-3">
                                <button className="btn btn-outline-primary btn-block btn-sm rounded-pill">
                                    <i className="fa-solid fa-cart-plus mr-1"></i> Xem chi tiết
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ProductList;
