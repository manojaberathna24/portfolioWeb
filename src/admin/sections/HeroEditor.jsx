import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { FiSave, FiPlus, FiTrash2, FiUpload } from 'react-icons/fi';

const HeroEditor = () => {
    const [data, setData] = useState(null);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        api.getSection('hero').then(setData).catch(() => setMsg('Error loading data'));
    }, []);

    const save = async () => {
        setSaving(true); setMsg('');
        try {
            await api.updateSection('hero', data);
            setMsg('✅ Saved!');
        } catch (e) { setMsg('❌ ' + e.message); }
        setSaving(false);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const res = await api.uploadImage(file);
            setData({ ...data, profileImage: res.filePath });
            setMsg('Image uploaded!');
        } catch (e) { setMsg('❌ Upload failed'); }
    };

    const addSocialLink = () => {
        setData({
            ...data,
            socialLinks: [...data.socialLinks, { platform: '', url: '', icon: 'FaGithub' }]
        });
    };

    const updateSocialLink = (index, field, value) => {
        const links = [...data.socialLinks];
        links[index] = { ...links[index], [field]: value };
        setData({ ...data, socialLinks: links });
    };

    const removeSocialLink = (index) => {
        setData({ ...data, socialLinks: data.socialLinks.filter((_, i) => i !== index) });
    };

    const addTypewriterWord = () => {
        setData({ ...data, typewriterWords: [...data.typewriterWords, ''] });
    };

    const updateTypewriterWord = (index, value) => {
        const words = [...data.typewriterWords];
        words[index] = value;
        setData({ ...data, typewriterWords: words });
    };

    const removeTypewriterWord = (index) => {
        setData({ ...data, typewriterWords: data.typewriterWords.filter((_, i) => i !== index) });
    };

    if (!data) return <div className="text-white">Loading...</div>;

    const iconOptions = ['FaGithub', 'FaLinkedin', 'FiMail', 'FaInstagram', 'FaTwitter', 'FaYoutube', 'FaFacebook', 'FaTiktok'];

    return (
        <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Hero Section</h1>
                <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-[#64ffda] text-[#0a192f] font-bold px-5 py-2 rounded-lg hover:bg-[#4cd9b5] disabled:opacity-50 transition-all">
                    <FiSave size={16} /> {saving ? 'Saving...' : 'Save'}
                </button>
            </div>
            {msg && <p className={`mb-4 text-sm ${msg.startsWith('✅') || msg.includes('uploaded') ? 'text-green-400' : 'text-red-400'}`}>{msg}</p>}

            {/* Profile Image */}
            <div className="bg-[#112240] rounded-xl p-5 border border-slate-700/50 mb-4">
                <label className="block text-sm font-semibold text-slate-300 mb-3">Profile Image</label>
                <div className="flex items-center gap-4">
                    <img src={data.profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-[#64ffda]" />
                    <label className="flex items-center gap-2 bg-[#0a192f] border border-slate-600 rounded-lg px-4 py-2 cursor-pointer hover:border-[#64ffda] transition-all text-sm text-slate-300">
                        <FiUpload size={16} /> Change Image
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                </div>
            </div>

            {/* Basic Info */}
            <div className="bg-[#112240] rounded-xl p-5 border border-slate-700/50 mb-4 space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">Name</label>
                    <input value={data.name} onChange={e => setData({ ...data, name: e.target.value })} className="w-full bg-[#0a192f] border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#64ffda] text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">Title</label>
                    <input value={data.title} onChange={e => setData({ ...data, title: e.target.value })} className="w-full bg-[#0a192f] border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#64ffda] text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">Bio</label>
                    <textarea value={data.bio} onChange={e => setData({ ...data, bio: e.target.value })} rows={4} className="w-full bg-[#0a192f] border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#64ffda] text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">CV File Path</label>
                    <input value={data.cvFile || ''} onChange={e => setData({ ...data, cvFile: e.target.value })} className="w-full bg-[#0a192f] border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#64ffda] text-sm" placeholder="projects/Manoj_Aberathna_CV.pdf" />
                </div>
            </div>

            {/* Typewriter Words */}
            <div className="bg-[#112240] rounded-xl p-5 border border-slate-700/50 mb-4">
                <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-slate-300">Typewriter Words</label>
                    <button onClick={addTypewriterWord} className="flex items-center gap-1 text-[#64ffda] text-sm hover:underline"><FiPlus size={14} /> Add</button>
                </div>
                <div className="space-y-2">
                    {data.typewriterWords?.map((word, i) => (
                        <div key={i} className="flex gap-2">
                            <input value={word} onChange={e => updateTypewriterWord(i, e.target.value)} className="flex-1 bg-[#0a192f] border border-slate-600 rounded-lg p-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#64ffda]" />
                            <button onClick={() => removeTypewriterWord(i)} className="text-red-400 hover:text-red-300 p-2"><FiTrash2 size={14} /></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Social Links */}
            <div className="bg-[#112240] rounded-xl p-5 border border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-slate-300">Social Links</label>
                    <button onClick={addSocialLink} className="flex items-center gap-1 text-[#64ffda] text-sm hover:underline"><FiPlus size={14} /> Add</button>
                </div>
                <div className="space-y-3">
                    {data.socialLinks?.map((link, i) => (
                        <div key={i} className="flex flex-col sm:flex-row gap-2 bg-[#0a192f] p-3 rounded-lg">
                            <select value={link.icon} onChange={e => updateSocialLink(i, 'icon', e.target.value)} className="bg-[#112240] border border-slate-600 rounded-lg p-2 text-white text-sm focus:outline-none">
                                {iconOptions.map(ic => <option key={ic} value={ic}>{ic.replace('Fa', '').replace('Fi', '')}</option>)}
                            </select>
                            <input value={link.platform} onChange={e => updateSocialLink(i, 'platform', e.target.value)} placeholder="Platform" className="flex-1 bg-[#112240] border border-slate-600 rounded-lg p-2 text-white text-sm focus:outline-none" />
                            <input value={link.url} onChange={e => updateSocialLink(i, 'url', e.target.value)} placeholder="URL" className="flex-[2] bg-[#112240] border border-slate-600 rounded-lg p-2 text-white text-sm focus:outline-none" />
                            <button onClick={() => removeSocialLink(i)} className="text-red-400 hover:text-red-300 p-2"><FiTrash2 size={14} /></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HeroEditor;
