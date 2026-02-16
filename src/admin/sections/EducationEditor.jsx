import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { FiSave, FiPlus, FiTrash2, FiChevronUp, FiChevronDown, FiUpload } from 'react-icons/fi';

const EducationEditor = () => {
    const [data, setData] = useState(null);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        api.getSection('education').then(setData).catch(() => setMsg('Error loading data'));
    }, []);

    const save = async () => {
        setSaving(true); setMsg('');
        try { await api.updateSection('education', data); setMsg('✅ Saved!'); }
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

    // Education CRUD
    const addEducation = () => {
        const newId = Math.max(0, ...data.educationData.map(e => e.id)) + 1;
        setData({ ...data, educationData: [...data.educationData, { id: newId, title: '', institution: '', date: '', description: '', image: '', order: data.educationData.length }] });
    };
    const updateEducation = (index, field, value) => {
        const items = [...data.educationData];
        items[index] = { ...items[index], [field]: value };
        setData({ ...data, educationData: items });
    };
    const removeEducation = (index) => {
        setData({ ...data, educationData: data.educationData.filter((_, i) => i !== index).map((e, i) => ({ ...e, order: i })) });
    };

    const handleEduImageUpload = async (index, e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const res = await api.uploadImage(file);
            updateEducation(index, 'image', res.filePath);
        } catch { setMsg('❌ Upload failed'); }
    };

    // Certification Group CRUD
    const addGroup = () => {
        const newId = Math.max(0, ...data.certificationGroups.map(g => g.id)) + 1;
        setData({ ...data, certificationGroups: [...data.certificationGroups, { id: newId, provider: '', certs: [], order: data.certificationGroups.length }] });
    };
    const updateGroup = (index, field, value) => {
        const groups = [...data.certificationGroups];
        groups[index] = { ...groups[index], [field]: value };
        setData({ ...data, certificationGroups: groups });
    };
    const removeGroup = (index) => {
        setData({ ...data, certificationGroups: data.certificationGroups.filter((_, i) => i !== index).map((g, i) => ({ ...g, order: i })) });
    };
    const moveGroup = (index, dir) => {
        setData({ ...data, certificationGroups: moveItem(data.certificationGroups, index, dir) });
    };

    // Cert CRUD within group
    const addCert = (groupIndex) => {
        const groups = [...data.certificationGroups];
        const maxId = Math.max(0, ...groups.flatMap(g => g.certs.map(c => c.id)));
        groups[groupIndex].certs.push({ id: maxId + 1, title: '', image: '', order: groups[groupIndex].certs.length });
        setData({ ...data, certificationGroups: groups });
    };
    const updateCert = (groupIndex, certIndex, field, value) => {
        const groups = [...data.certificationGroups];
        groups[groupIndex].certs[certIndex] = { ...groups[groupIndex].certs[certIndex], [field]: value };
        setData({ ...data, certificationGroups: groups });
    };
    const removeCert = (groupIndex, certIndex) => {
        const groups = [...data.certificationGroups];
        groups[groupIndex].certs = groups[groupIndex].certs.filter((_, i) => i !== certIndex).map((c, i) => ({ ...c, order: i }));
        setData({ ...data, certificationGroups: groups });
    };

    const handleCertImageUpload = async (groupIndex, certIndex, e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const res = await api.uploadImage(file);
            updateCert(groupIndex, certIndex, 'image', res.filePath);
        } catch { setMsg('❌ Upload failed'); }
    };

    if (!data) return <div className="text-white">Loading...</div>;

    return (
        <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Education & Certifications</h1>
                <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-[#64ffda] text-[#0a192f] font-bold px-5 py-2 rounded-lg hover:bg-[#4cd9b5] disabled:opacity-50 transition-all">
                    <FiSave size={16} /> {saving ? 'Saving...' : 'Save'}
                </button>
            </div>
            {msg && <p className={`mb-4 text-sm ${msg.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>{msg}</p>}

            {/* Education */}
            <div className="bg-[#112240] rounded-xl p-5 border border-slate-700/50 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">Education</h2>
                    <button onClick={addEducation} className="flex items-center gap-1 text-[#64ffda] text-sm hover:underline"><FiPlus size={14} /> Add</button>
                </div>
                <div className="space-y-4">
                    {data.educationData.sort((a, b) => a.order - b.order).map((edu, i) => (
                        <div key={edu.id} className="bg-[#0a192f] rounded-lg p-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500">Education #{i + 1}</span>
                                <button onClick={() => removeEducation(i)} className="text-red-400 hover:text-red-300 p-1"><FiTrash2 size={14} /></button>
                            </div>
                            <input value={edu.title} onChange={e => updateEducation(i, 'title', e.target.value)} placeholder="Degree / Title" className="w-full bg-[#112240] border border-slate-600 rounded-lg p-2 text-white text-sm focus:outline-none" />
                            <input value={edu.institution} onChange={e => updateEducation(i, 'institution', e.target.value)} placeholder="Institution" className="w-full bg-[#112240] border border-slate-600 rounded-lg p-2 text-white text-sm focus:outline-none" />
                            <div className="grid grid-cols-2 gap-2">
                                <input value={edu.date} onChange={e => updateEducation(i, 'date', e.target.value)} placeholder="Date" className="bg-[#112240] border border-slate-600 rounded-lg p-2 text-white text-sm focus:outline-none" />
                                <div className="flex items-center gap-2">
                                    {edu.image && <img src={edu.image} alt="" className="h-8 w-8 object-contain" />}
                                    <label className="flex items-center gap-1 text-xs text-slate-400 cursor-pointer hover:text-[#64ffda]">
                                        <FiUpload size={12} /> Image
                                        <input type="file" accept="image/*" onChange={e => handleEduImageUpload(i, e)} className="hidden" />
                                    </label>
                                </div>
                            </div>
                            <textarea value={edu.description} onChange={e => updateEducation(i, 'description', e.target.value)} placeholder="Description" rows={2} className="w-full bg-[#112240] border border-slate-600 rounded-lg p-2 text-white text-sm focus:outline-none" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Certification Groups */}
            <div className="bg-[#112240] rounded-xl p-5 border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">Certification Groups</h2>
                    <button onClick={addGroup} className="flex items-center gap-1 text-[#64ffda] text-sm hover:underline"><FiPlus size={14} /> Add Group</button>
                </div>
                <div className="space-y-4">
                    {data.certificationGroups.sort((a, b) => a.order - b.order).map((group, gi) => (
                        <div key={group.id} className="bg-[#0a192f] rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <input value={group.provider} onChange={e => updateGroup(gi, 'provider', e.target.value)} placeholder="Provider (e.g. Oracle)" className="bg-[#112240] border border-slate-600 rounded-lg p-2 text-white text-sm focus:outline-none flex-1 mr-2" />
                                <div className="flex gap-1">
                                    <button onClick={() => moveGroup(gi, -1)} className="text-slate-400 hover:text-white p-1"><FiChevronUp size={14} /></button>
                                    <button onClick={() => moveGroup(gi, 1)} className="text-slate-400 hover:text-white p-1"><FiChevronDown size={14} /></button>
                                    <button onClick={() => removeGroup(gi)} className="text-red-400 hover:text-red-300 p-1"><FiTrash2 size={14} /></button>
                                </div>
                            </div>
                            <div className="space-y-2 ml-3">
                                {group.certs.sort((a, b) => a.order - b.order).map((cert, ci) => (
                                    <div key={cert.id} className="flex items-center gap-2 bg-[#112240] p-2 rounded-lg">
                                        {cert.image && <img src={cert.image} alt="" className="h-8 w-8 object-contain rounded" />}
                                        <input value={cert.title} onChange={e => updateCert(gi, ci, 'title', e.target.value)} placeholder="Cert title" className="flex-1 bg-[#0a192f] border border-slate-600 rounded p-1.5 text-white text-xs focus:outline-none" />
                                        <label className="text-xs text-slate-400 cursor-pointer hover:text-[#64ffda]">
                                            <FiUpload size={12} />
                                            <input type="file" accept="image/*" onChange={e => handleCertImageUpload(gi, ci, e)} className="hidden" />
                                        </label>
                                        <button onClick={() => removeCert(gi, ci)} className="text-red-400 hover:text-red-300 p-1"><FiTrash2 size={12} /></button>
                                    </div>
                                ))}
                                <button onClick={() => addCert(gi)} className="text-[#64ffda] text-xs hover:underline flex items-center gap-1"><FiPlus size={12} /> Add Cert</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EducationEditor;
