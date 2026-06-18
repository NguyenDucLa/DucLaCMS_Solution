import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

function Cart() {
    return (
        <div>
            <Header />
            <div className="container py-4">
                <h2 className="fw-bold">Giỏ hàng</h2>
                <p className="text-muted">Trang giỏ hàng (Đang phát triển...)</p>
            </div>
            <Footer />
        </div>
    );
}

export default Cart;
