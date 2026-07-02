import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import axiosClient from '../../api/axiosClient';

function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email.trim() || !form.password.trim()) {
            setError('Vui lòng nhập email và mật khẩu.');
            return;
        }

        setLoading(true);
        try {
            await axiosClient.post('/auth/login', {
                email: form.email.trim(),
                password: form.password
            });
            window.dispatchEvent(new Event('authChanged'));
            navigate('/');
        } catch (err) {
            const msg = err?.response?.data?.message || 'Email hoặc mật khẩu không đúng!';
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
                                <h3 className="text-center fw-bold mb-1">Đăng nhập</h3>
                                <p className="text-center text-muted mb-4">Đăng nhập để quản lý nội dung</p>

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
                                            name="email"
                                            className="form-control"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="example@email.com"
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
                                            placeholder="••••••••"
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
                                            <><i className="fa-solid fa-right-to-bracket me-2"></i>Đăng nhập</>
                                        )}
                                    </button>
                                </form>

                                <div className="text-center mt-2">
                                    <Link to="/forgot-password" className="text-decoration-none small text-danger fw-semibold">
                                        <i className="fa-solid fa-key me-1"></i>Quên mật khẩu?
                                    </Link>
                                </div>

                                <div className="text-center mt-3">
                                    <span className="text-muted small">Chưa có tài khoản? </span>
                                    <Link to="/register" className="text-decoration-none small fw-semibold">
                                        Đăng ký
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Login;
