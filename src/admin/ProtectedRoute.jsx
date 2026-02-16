import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from './api';

const ProtectedRoute = ({ children }) => {
    const [checking, setChecking] = useState(true);
    const [valid, setValid] = useState(false);

    useEffect(() => {
        api.verifyToken().then(v => { setValid(v); setChecking(false); });
    }, []);

    if (checking) return <div className="min-h-screen bg-[#0a192f] flex items-center justify-center text-white text-xl">Loading...</div>;
    if (!valid) return <Navigate to="/admin/login" replace />;
    return children;
};

export default ProtectedRoute;
