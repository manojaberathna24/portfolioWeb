import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './api';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.login(password);
            navigate('/admin');
        } catch (err) {
            setError(err.message || 'Invalid password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a192f] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-[#112240] rounded-2xl shadow-2xl p-8 border border-slate-700/50">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[#64ffda]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiLock className="text-[#64ffda]" size={28} />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                        <p className="text-slate-400 mt-1 text-sm">Enter your password to continue</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="relative mb-6">
                            <input
                                type={showPw ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full bg-[#0a192f] border border-slate-600 rounded-lg p-3 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:border-transparent"
                                autoFocus
                            />
                            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                                {showPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>

                        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading || !password}
                            className="w-full bg-[#64ffda] text-[#0a192f] font-bold py-3 rounded-lg hover:bg-[#4cd9b5] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Verifying...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
