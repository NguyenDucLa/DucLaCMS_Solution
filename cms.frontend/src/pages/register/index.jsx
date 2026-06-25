import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import authService from '../../services/authService';

function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.fullName.trim()) {
            setError('Vui lòng nhập họ tên.');
            return;
        }
        if (!form.email.trim()) {
            setError('Vui lòng nhập email.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(form.email)) {
            setError('Email không hợp lệ.');
            return;
        }
        if (!form.username.trim()) {
            setError('Vui lòng nhập tên đăng nhập.');
            return;
        }
        if (!form.password.trim()) {
            setError('Vui lòng nhập mật khẩu.');
            return;
        }
        if (form.password.length < 3) {
            setError('Mật khẩu phải có ít nhất 3 ký tự.');
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }

        setLoading(true);
        try {
            await authService.register({
                username: form.username.trim(),
                password: form.password,
                fullName: form.fullName.trim(),
                email: form.email.trim()
            });
            setSuccess(true);
        } catch (err) {
            const msg = err?.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
            setError(msg);
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
                                <h3 className="text-center fw-bold mb-1">Đăng ký tài khoản</h3>
                                <p className="text-center text-muted mb-4">Tạo tài khoản để quản lý nội dung</p>

                                {success ? (
                                    <div className="text-center py-4">
                                        <i className="fa-solid fa-circle-check text-success" style={{ fontSize: '4rem' }}></i>
                                        <h5 className="fw-bold mt-3 text-success">Đăng ký thành công!</h5>
                                        <p className="text-muted">Vui lòng đăng nhập để tiếp tục.</p>
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
                                                <label className="form-label fw-semibold">Họ và tên</label>
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    className="form-control"
                                                    value={form.fullName}
                                                    onChange={handleChange}
                                                    placeholder="Nguyễn Văn A"
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="form-control"
                                                    value={form.email}
                                                    onChange={handleChange}
                                                    placeholder="example@email.com"
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Tên đăng nhập</label>
                                                <input
                                                    type="text"
                                                    name="username"
                                                    className="form-control"
                                                    value={form.username}
                                                    onChange={handleChange}
                                                    placeholder="Chọn tên đăng nhập"
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Mật khẩu</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    className="form-control"
                                                    value={form.password}
                                                    onChange={handleChange}
                                                    placeholder="Ít nhất 3 ký tự"
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Xác nhận mật khẩu</label>
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    className="form-control"
                                                    value={form.confirmPassword}
                                                    onChange={handleChange}
                                                    placeholder="Nhập lại mật khẩu"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="btn btn-warning w-100 fw-bold py-2"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Đang xử lý...</>
                                                ) : (
                                                    <><i className="fa-solid fa-user-plus me-2"></i>Đăng ký</>
                                                )}
                                            </button>
                                        </form>

                                        <div className="text-center mt-3">
                                            <span className="text-muted small">Đã có tài khoản? </span>
                                            <Link to="/login" className="text-decoration-none small fw-semibold">
                                                Đăng nhập
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

export default Register;
