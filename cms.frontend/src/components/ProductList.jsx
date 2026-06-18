import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
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
                        <ProductCard product={item} />
                    </div>
                ))
            )}
        </div>
    );
};

export default ProductList;
