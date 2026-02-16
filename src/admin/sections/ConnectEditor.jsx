import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';

const iconOptions = ['FaGithub', 'FaLinkedin', 'FiMail', 'FiPhone', 'FaInstagram', 'FaTwitter', 'FaYoutube', 'FaFacebook', 'FaTiktok', 'FaWhatsapp', 'FaTelegram', 'FaDiscord'];

const ConnectEditor = () => {
    const [data, setData] = useState(null);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        api.getSection('connect').then(setData).catch(() => setMsg('Error loading data'));
    }, []);

    const save = async () => {
        setSaving(true); setMsg('');
        try { await api.updateSection('connect', data); setMsg('✅ Saved!'); }
        catch (e) { setMsg('❌ ' + e.message); }
        setSaving(false);
    };

    const updateContactInfo = (field, value) => {
        setData({ ...data, contactInfo: { ...data.contactInfo, [field]: value } });
    };

    const addLink = () => {
        const newId = Math.max(0, ...data.contactLinks.map(l => l.id)) + 1;
        setData({ ...data, contactLinks: [...data.contactLinks, { id: newId, icon: 'FaGithub', title: '', href: '', order: data.contactLinks.length }] });
    };

    const updateLink = (index, field, value) => {
        const links = [...data.contactLinks];
        links[index] = { ...links[index], [field]: value };
        setData({ ...data, contactLinks: links });
    };

    const removeLink = (index) => {
        setData({ ...data, contactLinks: data.contactLinks.filter((_, i) => i !== index).map((l, i) => ({ ...l, order: i })) });
    };

    if (!data) return <div className="text-white">Loading...</div>;

    return (
        <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Connect Section</h1>
                <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-[#64ffda] text-[#0a192f] font-bold px-5 py-2 rounded-lg hover:bg-[#4cd9b5] disabled:opacity-50 transition-all">
                    <FiSave size={16} /> {saving ? 'Saving...' : 'Save'}
                </button>
            </div>
            {msg && <p className={`mb-4 text-sm ${msg.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>{msg}</p>}

            {/* Contact Info */}
            <div className="bg-[#112240] rounded-xl p-5 border border-slate-700/50 mb-4 space-y-3">
                <h2 className="text-sm font-semibold text-slate-300">Contact Information</h2>
                <div>
                    <label className="text-xs text-slate-400">Email</label>
                    <input value={data.contactInfo.email} onChange={e => updateContactInfo('email', e.target.value)} className="w-full bg-[#0a192f] border border-slate-600 rounded-lg p-2 text-white text-sm focus:outline-none mt-1" />
                </div>
                <div>
                    <label className="text-xs text-slate-400">Phone</label>
                    <input value={data.contactInfo.phone} onChange={e => updateContactInfo('phone', e.target.value)} className="w-full bg-[#0a192f] border border-slate-600 rounded-lg p-2 text-white text-sm focus:outline-none mt-1" />
                </div>
                <div>
                    <label className="text-xs text-slate-400">Location</label>
                    <input value={data.contactInfo.location} onChange={e => updateContactInfo('location', e.target.value)} className="w-full bg-[#0a192f] border border-slate-600 rounded-lg p-2 text-white text-sm focus:outline-none mt-1" />
                </div>
            </div>

            {/* Contact Links */}
            <div className="bg-[#112240] rounded-xl p-5 border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-slate-300">Contact / Social Links</h2>
                    <button onClick={addLink} className="flex items-center gap-1 text-[#64ffda] text-sm hover:underline"><FiPlus size={14} /> Add</button>
                </div>
                <div className="space-y-2">
                    {data.contactLinks.sort((a, b) => a.order - b.order).map((link, i) => (
                        <div key={link.id} className="flex flex-col sm:flex-row gap-2 bg-[#0a192f] p-3 rounded-lg">
                            <select value={link.icon} onChange={e => updateLink(i, 'icon', e.target.value)} className="bg-[#112240] border border-slate-600 rounded-lg p-2 text-white text-sm focus:outline-none">
                                {iconOptions.map(ic => <option key={ic} value={ic}>{ic.replace('Fa', '').replace('Fi', '')}</option>)}
                            </select>
                            <input value={link.title} onChange={e => updateLink(i, 'title', e.target.value)} placeholder="Title" className="flex-1 bg-[#112240] border border-slate-600 rounded-lg p-2 text-white text-sm focus:outline-none" />
                            <input value={link.href} onChange={e => updateLink(i, 'href', e.target.value)} placeholder="URL / Link" className="flex-[2] bg-[#112240] border border-slate-600 rounded-lg p-2 text-white text-sm focus:outline-none" />
                            <button onClick={() => removeLink(i)} className="text-red-400 hover:text-red-300 p-2"><FiTrash2 size={14} /></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ConnectEditor;
