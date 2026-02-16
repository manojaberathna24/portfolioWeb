import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { api } from './api';
import { FiHome, FiUser, FiGrid, FiBook, FiFolder, FiMail, FiLogOut, FiMenu, FiX, FiStar } from 'react-icons/fi';

const navItems = [
    { path: '/admin', icon: <FiHome size={18} />, label: 'Dashboard', end: true },
    { path: '/admin/hero', icon: <FiStar size={18} />, label: 'Hero' },
    { path: '/admin/about', icon: <FiUser size={18} />, label: 'About' },
    { path: '/admin/skills', icon: <FiGrid size={18} />, label: 'Skills' },
    { path: '/admin/education', icon: <FiBook size={18} />, label: 'Education' },
    { path: '/admin/projects', icon: <FiFolder size={18} />, label: 'Projects' },
    { path: '/admin/connect', icon: <FiMail size={18} />, label: 'Connect' },
];

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        api.logout();
        navigate('/admin/login');
    };

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${isActive
            ? 'bg-[#64ffda]/10 text-[#64ffda] border-l-3 border-[#64ffda]'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`;

    return (
        <div className="min-h-screen bg-[#0a192f] flex">
            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#112240] border-r border-slate-700/50 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
                <div className="p-4 border-b border-slate-700/50">
                    <h2 className="text-lg font-bold text-white">⚙️ Admin Panel</h2>
                    <p className="text-xs text-slate-500 mt-1">Portfolio Manager</p>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink key={item.path} to={item.path} end={item.end} className={linkClass} onClick={() => setSidebarOpen(false)}>
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
                <div className="p-3 border-t border-slate-700/50">
                    <a href="/" target="_blank" className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all mb-2">
                        🌐 <span>View Portfolio</span>
                    </a>
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all w-full">
                        <FiLogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-[#112240]/80 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center justify-between lg:justify-end sticky top-0 z-30">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-white">
                        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                    <span className="text-sm text-slate-400">Welcome, Admin 👋</span>
                </header>
                <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
