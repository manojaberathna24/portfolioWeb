import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { FiSave, FiPlus, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi';

const iconOptions = ['FaRobot', 'FaBrain', 'FaTools', 'FaInfinity', 'FaCode', 'FaLaptopCode', 'FaRocket', 'FaLightbulb', 'FaCogs', 'FaGraduationCap'];

const AboutEditor = () => {
    const [data, setData] = useState(null);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        api.getSection('about').then(setData).catch(() => setMsg('Error loading data'));
    }, []);

    const save = async () => {
        setSaving(true); setMsg('');
        try { await api.updateSection('about', data); setMsg('✅ Saved!'); }
        catch (e) { setMsg('❌ ' + e.message); }
        setSaving(false);
    };

    const moveItem = (arr, index, dir) => {
        const newArr = [...arr];
        const swapIdx = index + dir;
        if (swapIdx < 0 || swapIdx >= newArr.length) return arr;
        [newArr[index], newArr[swapIdx]] = [newArr[swapIdx], newArr[index]];
        return newArr.map((item, i) => ({ ...item, order: i }));
    };

    // Philosophy CRUD
    const addPhilosophy = () => {
        const newId = Math.max(0, ...data.philosophyData.map(p => p.id)) + 1;
        setData({ ...data, philosophyData: [...data.philosophyData, { id: newId, icon: 'FaCode', title: '', text: '', order: data.philosophyData.length }] });
    };
    const updatePhilosophy = (index, field, value) => {
        const items = [...data.philosophyData];
        items[index] = { ...items[index], [field]: value };
        setData({ ...data, philosophyData: items });
    };
    const removePhilosophy = (index) => {
        setData({ ...data, philosophyData: data.philosophyData.filter((_, i) => i !== index).map((item, i) => ({ ...item, order: i })) });
    };
    const movePhilosophy = (index, dir) => {
        setData({ ...data, philosophyData: moveItem(data.philosophyData, index, dir) });
    };

    // Journey CRUD
    const addJourney = () => {
        const newId = Math.max(0, ...data.journeyData.map(j => j.id)) + 1;
        setData({ ...data, journeyData: [...data.journeyData, { id: newId, year: '', title: '', description: '', order: data.journeyData.length }] });
    };
    const updateJourney = (index, field, value) => {
        const items = [...data.journeyData];
        items[index] = { ...items[index], [field]: value };
        setData({ ...data, journeyData: items });
    };
    const removeJourney = (index) => {
        setData({ ...data, journeyData: data.journeyData.filter((_, i) => i !== index).map((item, i) => ({ ...item, order: i })) });
    };
    const moveJourney = (index, dir) => {
        setData({ ...data, journeyData: moveItem(data.journeyData, index, dir) });
    };

    if (!data) return <div className="text-white">Loading...</div>;

    return (
        <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">About Section</h1>
                <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-[#64ffda] text-[#0a192f] font-bold px-5 py-2 rounded-lg hover:bg-[#4cd9b5] disabled:opacity-50 transition-all">
                    <FiSave size={16} /> {saving ? 'Saving...' : 'Save'}
                </button>
            </div>
            {msg && <p className={`mb-4 text-sm ${msg.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>{msg}</p>}

            {/* Intro Text */}
            <div className="bg-[#112240] rounded-xl p-5 border border-slate-700/50 mb-4">
                <label className="block text-sm font-semibold text-slate-300 mb-2">Introduction Text</label>
                <textarea value={data.introText} onChange={e => setData({ ...data, introText: e.target.value })} rows={6} className="w-full bg-[#0a192f] border border-slate-600 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#64ffda]" />
            </div>

            {/* Philosophy */}
            <div className="bg-[#112240] rounded-xl p-5 border border-slate-700/50 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-semibold text-slate-300">Philosophy Cards</label>
                    <button onClick={addPhilosophy} className="flex items-center gap-1 text-[#64ffda] text-sm hover:underline"><FiPlus size={14} /> Add</button>
                </div>
                <div className="space-y-3">
                    {data.philosophyData.sort((a, b) => a.order - b.order).map((item, i) => (
                        <div key={item.id} className="bg-[#0a192f] p-4 rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500">#{i + 1}</span>
                                <div className="flex gap-1">
                                    <button onClick={() => movePhilosophy(i, -1)} className="text-slate-400 hover:text-white p-1"><FiChevronUp size={14} /></button>
                                    <button onClick={() => movePhilosophy(i, 1)} className="text-slate-400 hover:text-white p-1"><FiChevronDown size={14} /></button>
                                    <button onClick={() => removePhilosophy(i)} className="text-red-400 hover:text-red-300 p-1"><FiTrash2 size={14} /></button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <select value={item.icon} onChange={e => updatePhilosophy(i, 'icon', e.target.value)} className="bg-[#112240] border border-slate-600 rounded-lg p-2 text-white text-sm">
                                    {iconOptions.map(ic => <option key={ic} value={ic}>{ic.replace('Fa', '')}</option>)}
                                </select>
                                <input value={item.title} onChange={e => updatePhilosophy(i, 'title', e.target.value)} placeholder="Title" className="bg-[#112240] border border-slate-600 rounded-lg p-2 text-white text-sm focus:outline-none" />
                            </div>
                            <textarea value={item.text} onChange={e => updatePhilosophy(i, 'text', e.target.value)} placeholder="Description" rows={2} className="w-full bg-[#112240] border border-slate-600 rounded-lg p-2 text-white text-sm focus:outline-none" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Journey */}
            <div className="bg-[#112240] rounded-xl p-5 border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-semibold text-slate-300">Developer Journey</label>
                    <button onClick={addJourney} className="flex items-center gap-1 text-[#64ffda] text-sm hover:underline"><FiPlus size={14} /> Add</button>
                </div>
                <div className="space-y-3">
                    {data.journeyData.sort((a, b) => a.order - b.order).map((item, i) => (
                        <div key={item.id} className="bg-[#0a192f] p-4 rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500">#{i + 1}</span>
                                <div className="flex gap-1">
                                    <button onClick={() => moveJourney(i, -1)} className="text-slate-400 hover:text-white p-1"><FiChevronUp size={14} /></button>
                                    <button onClick={() => moveJourney(i, 1)} className="text-slate-400 hover:text-white p-1"><FiChevronDown size={14} /></button>
                                    <button onClick={() => removeJourney(i)} className="text-red-400 hover:text-red-300 p-1"><FiTrash2 size={14} /></button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <input value={item.year} onChange={e => updateJourney(i, 'year', e.target.value)} placeholder="Year" className="bg-[#112240] border border-slate-600 rounded-lg p-2 text-white text-sm focus:outline-none" />
                                <input value={item.title} onChange={e => updateJourney(i, 'title', e.target.value)} placeholder="Title" className="bg-[#112240] border border-slate-600 rounded-lg p-2 text-white text-sm focus:outline-none" />
                            </div>
                            <textarea value={item.description} onChange={e => updateJourney(i, 'description', e.target.value)} placeholder="Description" rows={2} className="w-full bg-[#112240] border border-slate-600 rounded-lg p-2 text-white text-sm focus:outline-none" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutEditor;
