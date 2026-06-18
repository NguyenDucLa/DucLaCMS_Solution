import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

function Checkout() {
    return (
        <div>
            <Header />
            <div className="container py-4">
                <h2 className="fw-bold">Thanh toán</h2>
                <p className="text-muted">Trang thanh toán (Đang phát triển...)</p>
            </div>
            <Footer />
        </div>
    );
}

export default Checkout;
