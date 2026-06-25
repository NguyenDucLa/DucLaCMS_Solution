import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import orderService from '../../services/orderService';

function Checkout() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        notes: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('cart') || '[]');
        if (saved.length === 0) {
            navigate('/cart');
        }
        setCart(saved);
    }, [navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const newErrors = {};
        if (!form.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên';
        if (!form.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = 'Email không hợp lệ';
        }
        if (!form.phone.trim()) {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!/^[0-9]{10,11}$/.test(form.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Số điện thoại không hợp lệ (10-11 số)';
        }
        if (!form.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        setError('');

        try {
            const payload = {
                customer: {
                    fullName: form.fullName.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim(),
                    address: form.address.trim()
                },
                items: cart.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.price
                })),
                notes: form.notes.trim() || null
            };

            const result = await orderService.createOrder(payload);
            setSuccess(true);
            localStorage.removeItem('cart');
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (err) {
            const msg = err?.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.';
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (success) {
        return (
            <div>
                <Header />
                <div className="container text-center py-5">
                    <div className="py-5">
                        <i className="fa-solid fa-circle-check text-success" style={{ fontSize: '5rem' }}></i>
                        <h2 className="fw-bold mt-3">Đặt hàng thành công!</h2>
                        <p className="text-muted fs-5">Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ sớm nhất.</p>
                        <Link to="/" className="btn btn-warning btn-lg fw-bold rounded-pill px-5 mt-3">
                            <i className="fa-solid fa-house me-2"></i>Về trang chủ
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="container py-4">
                <h2 className="fw-bold mb-4">
                    <i className="fa-solid fa-credit-card me-2"></i>Thanh toán
                </h2>

                {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        <i className="fa-solid fa-circle-exclamation me-2"></i>{error}
                        <button type="button" className="btn-close" onClick={() => setError('')}></button>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                        {/* Thông tin giao hàng */}
                        <div className="col-lg-7">
                            <div className="card shadow-sm border-0">
                                <div className="card-body p-4">
                                    <h5 className="fw-bold mb-4">
                                        <i className="fa-solid fa-user me-2"></i>Thông tin giao hàng
                                    </h5>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Họ và tên <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                                            value={form.fullName}
                                            onChange={handleChange}
                                            placeholder="Nguyễn Văn A"
                                        />
                                        {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Email <span className="text-danger">*</span></label>
                                            <input
                                                type="email"
                                                name="email"
                                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                value={form.email}
                                                onChange={handleChange}
                                                placeholder="example@email.com"
                                            />
                                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Số điện thoại <span className="text-danger">*</span></label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                                value={form.phone}
                                                onChange={handleChange}
                                                placeholder="0912345678"
                                            />
                                            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Địa chỉ <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            name="address"
                                            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                            value={form.address}
                                            onChange={handleChange}
                                            placeholder="Số nhà, đường, phường, quận, thành phố"
                                        />
                                        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Ghi chú (không bắt buộc)</label>
                                        <textarea
                                            name="notes"
                                            className="form-control"
                                            rows="3"
                                            value={form.notes}
                                            onChange={handleChange}
                                            placeholder="Ghi chú thêm cho đơn hàng..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Đơn hàng */}
                        <div className="col-lg-5">
                            <div className="card shadow-sm border-0">
                                <div className="card-body p-4">
                                    <h5 className="fw-bold mb-4">
                                        <i className="fa-solid fa-receipt me-2"></i>Đơn hàng của bạn
                                    </h5>

                                    {cart.map(item => (
                                        <div key={item.productId} className="d-flex justify-content-between align-items-center mb-2">
                                            <div>
                                                <span className="fw-semibold">{item.name}</span>
                                                <span className="text-muted ms-2">x{item.quantity}</span>
                                            </div>
                                            <span className="text-danger fw-bold">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    ))}

                                    <hr />
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Tạm tính:</span>
                                        <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Phí vận chuyển:</span>
                                        <span className="text-success">Miễn phí</span>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between mb-4">
                                        <span className="fw-bold fs-5">Tổng cộng:</span>
                                        <span className="fw-bold fs-5 text-danger">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
                                        </span>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-warning w-100 fw-bold py-2 rounded-pill"
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Đang xử lý...</>
                                        ) : (
                                            <><i className="fa-solid fa-check me-2"></i>Đặt hàng</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default Checkout;
