import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from './api';
import { FiStar, FiUser, FiGrid, FiBook, FiFolder, FiMail, FiArrowRight } from 'react-icons/fi';

const cards = [
    { path: '/admin/hero', icon: <FiStar size={24} />, label: 'Hero Section', desc: 'Profile, title, bio, social links', color: '#64ffda' },
    { path: '/admin/about', icon: <FiUser size={24} />, label: 'About Section', desc: 'Philosophy, journey, intro text', color: '#3b82f6' },
    { path: '/admin/skills', icon: <FiGrid size={24} />, label: 'Skills', desc: 'Add, edit, reorder tech stack', color: '#f59e0b' },
    { path: '/admin/education', icon: <FiBook size={24} />, label: 'Education', desc: 'Education & certifications', color: '#8b5cf6' },
    { path: '/admin/projects', icon: <FiFolder size={24} />, label: 'Projects', desc: 'Add, edit, delete projects', color: '#ef4444' },
    { path: '/admin/connect', icon: <FiMail size={24} />, label: 'Connect', desc: 'Contact info & social links', color: '#06b6d4' },
];

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        api.getData().then(data => {
            setStats({
                projects: data.projects?.length || 0,
                skills: data.skills?.length || 0,
                certs: data.education?.certificationGroups?.reduce((a, g) => a + g.certs.length, 0) || 0,
            });
        }).catch(() => { });
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-slate-400 mb-8">Manage your portfolio sections below.</p>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {[
                        { label: 'Projects', value: stats.projects, color: '#ef4444' },
                        { label: 'Skills', value: stats.skills, color: '#f59e0b' },
                        { label: 'Certifications', value: stats.certs, color: '#8b5cf6' },
                    ].map(s => (
                        <div key={s.label} className="bg-[#112240] rounded-xl p-5 border border-slate-700/50">
                            <p className="text-slate-400 text-sm">{s.label}</p>
                            <p className="text-3xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Section Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map(card => (
                    <Link key={card.path} to={card.path} className="group bg-[#112240] rounded-xl p-5 border border-slate-700/50 hover:border-slate-600 transition-all hover:shadow-lg">
                        <div className="flex items-start justify-between">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: card.color + '15', color: card.color }}>
                                {card.icon}
                            </div>
                            <FiArrowRight className="text-slate-600 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-white font-semibold">{card.label}</h3>
                        <p className="text-slate-400 text-sm mt-1">{card.desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
