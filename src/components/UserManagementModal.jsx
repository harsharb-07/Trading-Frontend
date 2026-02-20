import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { X, UserPlus, Users, Trash2 } from 'lucide-react';

const UserManagementModal = ({ isOpen, onClose }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('list'); // 'list' or 'create'

    // Form state for creating a new user
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
            setView('list');
        }
    }, [isOpen]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await api.getAllUsers();
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        try {
            const dataToSubmit = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                phoneNumber: "1234567890" // Default
            };
            await api.register(dataToSubmit);
            alert('User created successfully!');
            fetchUsers();
            setView('list');
            setFormData({ username: '', fullName: '', email: '', password: '', confirmPassword: '' });
        } catch (err) {
            alert(`Failed to create user: ${err.message}`);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose} style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.2s ease-out'
        }}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{
                background: 'white',
                width: '90%',
                maxWidth: '600px',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                animation: 'slideUp 0.3s ease-out',
                maxHeight: '80vh',
                overflowY: 'auto'
            }}>
                <div className="section-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Users size={28} color="#1877f2" />
                        <h2 style={{ color: '#1f2937', margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
                            {view === 'list' ? 'User Management' : 'Create New User'}
                        </h2>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#666',
                        transition: 'background-color 0.2s',
                        borderRadius: '50%'
                    }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <X size={24} />
                    </button>
                </div>

                {view === 'list' ? (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                            <button onClick={() => setView('create')} style={{
                                background: '#1877f2',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: '600'
                            }}>
                                <UserPlus size={18} /> Create User
                            </button>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>Loading Users...</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {users.map((user) => (
                                    <div key={user.id} style={{
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        background: '#f9fafb'
                                    }}>
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#111827' }}>
                                                {user.fullName || user.username}
                                            </div>
                                            <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                                                @{user.username} • {user.email}
                                            </div>
                                        </div>
                                        <div style={{
                                            background: '#d1fae5',
                                            color: '#065f46',
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            fontWeight: '600'
                                        }}>
                                            ID: {user.id}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Username</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Password</label>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Confirm Password</label>
                                <input
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                                <button type="submit" style={{
                                    flex: 1,
                                    background: '#1877f2',
                                    color: 'white',
                                    padding: '12px',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}>
                                    Create Account
                                </button>
                                <button type="button" onClick={() => setView('list')} style={{
                                    flex: 1,
                                    background: '#f3f4f6',
                                    color: '#374151',
                                    padding: '12px',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagementModal;
