import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import axiosClient from '../../api/axiosClient';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            setError('Vui lòng nhập email.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Email không hợp lệ.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await axiosClient.post('/auth/forgot-password', { email: email.trim() });
            setSuccess(true);
        } catch (err) {
            setError(err?.response?.data?.message || 'Email không tồn tại trong hệ thống.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Header />
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4">
                                <h3 className="text-center fw-bold mb-1">Quên mật khẩu</h3>
                                <p className="text-center text-muted mb-4">Nhập email để đặt lại mật khẩu</p>

                                {success ? (
                                    <div className="text-center py-4">
                                        <i className="fa-solid fa-circle-check text-success" style={{ fontSize: '4rem' }}></i>
                                        <h5 className="fw-bold mt-3 text-success">Yêu cầu thành công!</h5>
                                        <p className="text-muted">Vui lòng kiểm tra hộp thư đến (hoặc thư mục Spam) để lấy mật khẩu mới.</p>
                                        <Link to="/login" className="btn btn-warning fw-bold rounded-pill px-4 mt-2">
                                            <i className="fa-solid fa-right-to-bracket me-2"></i>Đăng nhập ngay
                                        </Link>
                                    </div>
                                ) : (
                                    <>
                                        {error && (
                                            <div className="alert alert-danger py-2" role="alert">
                                                <i className="fa-solid fa-circle-exclamation me-2"></i>{error}
                                            </div>
                                        )}
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    value={email}
                                                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                                    placeholder="example@email.com"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="btn btn-warning w-100 fw-bold py-2"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <><span className="spinner-border spinner-border-sm me-2"></span>Đang xử lý...</>
                                                ) : (
                                                    <><i className="fa-solid fa-paper-plane me-2"></i>Gửi yêu cầu</>
                                                )}
                                            </button>
                                        </form>
                                        <div className="text-center mt-3">
                                            <Link to="/login" className="text-decoration-none small fw-semibold">
                                                <i className="fa-solid fa-arrow-left me-1"></i>Quay lại đăng nhập
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ForgotPassword;
