import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import authService from '../../services/authService';
import axiosClient from '../../api/axiosClient';

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fullName, setFullName] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [saving, setSaving] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [changingPassword, setChangingPassword] = useState(false);
    const [pwMessage, setPwMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        authService.getMe()
            .then(data => {
                if (!data.isAuthenticated) {
                    navigate('/login');
                    return;
                }
                setUser(data);
                setFullName(data.fullName || '');
                setLoading(false);
            })
            .catch(() => {
                navigate('/login');
            });
    }, [navigate]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!fullName.trim()) {
            setMessage({ type: 'danger', text: 'Họ tên không được để trống.' });
            return;
        }
        setSaving(true);
        try {
            const res = await axiosClient.put('/auth/profile', {
                fullName: fullName.trim()
            });
            // Chuẩn hóa dữ liệu về camelCase
            const u = res.user;
            setUser({
                id: u.Id || u.id,
                username: u.Username || u.username,
                fullName: u.FullName || u.fullName,
                email: u.Email || u.email,
                role: u.Role || u.role
            });
            setFullName(u.FullName || u.fullName);
            setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
        } catch (err) {
            setMessage({ type: 'danger', text: err?.response?.data?.message || 'Lỗi cập nhật.' });
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPwMessage({ type: '', text: '' });

        if (!passwordForm.oldPassword) {
            setPwMessage({ type: 'danger', text: 'Vui lòng nhập mật khẩu cũ.' });
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            setPwMessage({ type: 'danger', text: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
            return;
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPwMessage({ type: 'danger', text: 'Mật khẩu xác nhận không khớp.' });
            return;
        }

        setSaving(true);
        try {
            await axiosClient.put('/auth/change-password', {
                oldPassword: passwordForm.oldPassword,
                newPassword: passwordForm.newPassword
            });
            setPwMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
            setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setChangingPassword(false);
        } catch (err) {
            setPwMessage({ type: 'danger', text: err?.response?.data?.message || 'Đổi mật khẩu thất bại.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div>
                <Header />
                <div className="container text-center py-5">
                    <div className="spinner-border text-warning" role="status"></div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="container py-4">
                <h3 className="fw-bold mb-4">
                    <i className="fa-solid fa-user-gear me-2"></i>Hồ sơ cá nhân
                </h3>

                <div className="row g-4">
                    {/* Thông tin cá nhân */}
                    <div className="col-lg-6">
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-3">
                                    <i className="fa-solid fa-info-circle me-2 text-warning"></i>Thông tin cá nhân
                                </h5>

                                {message.text && (
                                    <div className={`alert alert-${message.type} py-2`}>{message.text}</div>
                                )}

                                <form onSubmit={handleUpdateProfile}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Họ và tên</label>
                                        <input type="text" className="form-control"
                                            value={fullName}
                                            onChange={e => { setFullName(e.target.value); setMessage({ type: '', text: '' }); }} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Email</label>
                                        <input type="email" className="form-control" value={user.email || user.username} disabled />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Tên đăng nhập</label>
                                        <input type="text" className="form-control" value={user.username} disabled />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Vai trò</label>
                                        <input type="text" className="form-control" value={user.role} disabled />
                                    </div>
                                    <button type="submit" className="btn btn-warning fw-bold w-100 py-2" disabled={saving}>
                                        {saving ? 'Đang lưu...' : <><i className="fa-solid fa-floppy-disk me-2"></i>Lưu thay đổi</>}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Đổi mật khẩu */}
                    <div className="col-lg-6">
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-3">
                                    <i className="fa-solid fa-lock me-2 text-danger"></i>Đổi mật khẩu
                                </h5>

                                {pwMessage.text && (
                                    <div className={`alert alert-${pwMessage.type} py-2`}>{pwMessage.text}</div>
                                )}

                                {!changingPassword ? (
                                    <button className="btn btn-outline-danger w-100 py-2"
                                        onClick={() => setChangingPassword(true)}>
                                        <i className="fa-solid fa-key me-2"></i>Đổi mật khẩu
                                    </button>
                                ) : (
                                    <form onSubmit={handleChangePassword}>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Mật khẩu cũ</label>
                                            <input type="password" className="form-control"
                                                value={passwordForm.oldPassword}
                                                onChange={e => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Mật khẩu mới (ít nhất 6 ký tự)</label>
                                            <input type="password" className="form-control"
                                                value={passwordForm.newPassword}
                                                onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Xác nhận mật khẩu mới</label>
                                            <input type="password" className="form-control"
                                                value={passwordForm.confirmPassword}
                                                onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} />
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button type="submit" className="btn btn-danger fw-bold flex-grow-1 py-2"
                                                disabled={saving}>
                                                {saving ? 'Đang xử lý...' : <><i className="fa-solid fa-check me-2"></i>Xác nhận</>}
                                            </button>
                                            <button type="button" className="btn btn-secondary flex-grow-1 py-2"
                                                onClick={() => { setChangingPassword(false); setPwMessage({ type: '', text: '' }); }}>
                                                Hủy
                                            </button>
                                        </div>
                                    </form>
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

export default Profile;
