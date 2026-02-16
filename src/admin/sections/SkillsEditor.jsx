import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { FiSave, FiPlus, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi';

const iconOptions = [
    'FaPython', 'FaJava', 'FaReact', 'FaNodeJs', 'FaHtml5', 'FaCss3Alt', 'FaPhp', 'FaGit', 'FaDocker',
    'FaAngular', 'FaLinux', 'FaAws', 'FaKaggle', 'FaFlutter',
    'SiJavascript', 'SiTypescript', 'SiMongodb', 'SiTailwindcss', 'SiCplusplus', 'SiC', 'SiKotlin',
    'SiTensorflow', 'SiKeras', 'SiScikitlearn', 'SiNumpy', 'SiPandas', 'SiStreamlit',
    'SiFlask', 'SiFastapi', 'SiExpress', 'SiFirebase', 'SiSupabase', 'SiMysql', 'SiOracle',
    'SiPostman', 'SiN8N', 'SiOpenai', 'SiFigma', 'SiGooglecloud',
    'IoLogoAndroid', 'IoLogoDocker',
];

const categories = ['Programming Languages', 'AI/ML & Data Science', 'Web & App Development', 'Database & Cloud', 'Automation & Tools', 'Other'];

const SkillsEditor = () => {
    const [skills, setSkills] = useState([]);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        api.getSection('skills').then(setSkills).catch(() => setMsg('Error loading data'));
    }, []);

    const save = async () => {
        setSaving(true); setMsg('');
        try { await api.updateSection('skills', skills); setMsg('✅ Saved!'); }
        catch (e) { setMsg('❌ ' + e.message); }
        setSaving(false);
    };

    const addSkill = () => {
        const newId = Math.max(0, ...skills.map(s => s.id)) + 1;
        setSkills([...skills, { id: newId, name: '', icon: 'FaCode', color: '#64ffda', category: 'Other', order: skills.length }]);
    };

    const updateSkill = (index, field, value) => {
        const items = [...skills];
        items[index] = { ...items[index], [field]: value };
        setSkills(items);
    };

    const removeSkill = (index) => {
        setSkills(skills.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i })));
    };

    const moveSkill = (index, dir) => {
        const newArr = [...skills];
        const swapIdx = index + dir;
        if (swapIdx < 0 || swapIdx >= newArr.length) return;
        [newArr[index], newArr[swapIdx]] = [newArr[swapIdx], newArr[index]];
        setSkills(newArr.map((s, i) => ({ ...s, order: i })));
    };

    const filtered = filter === 'All' ? skills.sort((a, b) => a.order - b.order) : skills.filter(s => s.category === filter).sort((a, b) => a.order - b.order);

    return (
        <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Skills</h1>
                <div className="flex gap-2">
                    <button onClick={addSkill} className="flex items-center gap-1 bg-[#112240] border border-slate-600 text-slate-300 px-3 py-2 rounded-lg text-sm hover:border-[#64ffda] transition-all">
                        <FiPlus size={14} /> Add Skill
                    </button>
                    <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-[#64ffda] text-[#0a192f] font-bold px-5 py-2 rounded-lg hover:bg-[#4cd9b5] disabled:opacity-50 transition-all">
                        <FiSave size={16} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
            {msg && <p className={`mb-4 text-sm ${msg.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>{msg}</p>}

            {/* Filter */}
            <div className="flex flex-wrap gap-2 mb-4">
                {['All', ...categories].map(cat => (
                    <button key={cat} onClick={() => setFilter(cat)} className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${filter === cat ? 'bg-[#64ffda] text-[#0a192f]' : 'bg-[#112240] text-slate-400 hover:text-white'}`}>
                        {cat}
                    </button>
                ))}
            </div>

            <div className="space-y-2">
                {filtered.map((skill, i) => {
                    const realIndex = skills.findIndex(s => s.id === skill.id);
                    return (
                        <div key={skill.id} className="bg-[#112240] rounded-lg p-3 border border-slate-700/50 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ backgroundColor: skill.color + '20', color: skill.color }}>
                                {skill.name?.charAt(0) || '?'}
                            </div>
                            <input value={skill.name} onChange={e => updateSkill(realIndex, 'name', e.target.value)} placeholder="Skill name" className="flex-1 bg-[#0a192f] border border-slate-600 rounded-lg p-2 text-white text-sm focus:outline-none min-w-0" />
                            <select value={skill.icon} onChange={e => updateSkill(realIndex, 'icon', e.target.value)} className="bg-[#0a192f] border border-slate-600 rounded-lg p-2 text-white text-xs focus:outline-none">
                                {iconOptions.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                            </select>
                            <input type="color" value={skill.color} onChange={e => updateSkill(realIndex, 'color', e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent" />
                            <select value={skill.category} onChange={e => updateSkill(realIndex, 'category', e.target.value)} className="bg-[#0a192f] border border-slate-600 rounded-lg p-2 text-white text-xs focus:outline-none">
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                            <div className="flex gap-1">
                                <button onClick={() => moveSkill(realIndex, -1)} className="text-slate-400 hover:text-white p-1"><FiChevronUp size={14} /></button>
                                <button onClick={() => moveSkill(realIndex, 1)} className="text-slate-400 hover:text-white p-1"><FiChevronDown size={14} /></button>
                                <button onClick={() => removeSkill(realIndex)} className="text-red-400 hover:text-red-300 p-1"><FiTrash2 size={14} /></button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SkillsEditor;
