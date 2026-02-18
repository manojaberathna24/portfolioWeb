import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { FiSave, FiPlus, FiTrash2, FiChevronUp, FiChevronDown, FiUpload, FiStar, FiX } from 'react-icons/fi';

const ProjectsEditor = () => {
    const [projects, setProjects] = useState([]);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [tagInputs, setTagInputs] = useState({});

    useEffect(() => {
        api.getSection('projects').then(data => setProjects(data.sort((a, b) => a.order - b.order))).catch(() => setMsg('Error loading data'));
    }, []);

    const save = async () => {
        setSaving(true); setMsg('');
        try { await api.updateSection('projects', projects); setMsg('✅ Saved!'); }
        catch (e) { setMsg('❌ ' + e.message); }
        setSaving(false);
    };

    const addProject = () => {
        const newId = Math.max(0, ...projects.map(p => p.id)) + 1;
        const newProj = { id: newId, featured: false, title: '', description: '', images: [], tags: [], github: '', live: '', order: projects.length };
        setProjects([...projects, newProj]);
        setEditingId(newId);
    };

    const updateProject = (index, field, value) => {
        const items = [...projects];
        items[index] = { ...items[index], [field]: value };
        setProjects(items);
    };

    const removeProject = (index) => {
        setProjects(projects.filter((_, i) => i !== index).map((p, i) => ({ ...p, order: i })));
        setEditingId(null);
    };

    const moveProject = (index, dir) => {
        const newArr = [...projects];
        const swapIdx = index + dir;
        if (swapIdx < 0 || swapIdx >= newArr.length) return;
        [newArr[index], newArr[swapIdx]] = [newArr[swapIdx], newArr[index]];
        setProjects(newArr.map((p, i) => ({ ...p, order: i })));
    };

    const toggleFeatured = (index) => {
        const items = projects.map((p, i) => ({ ...p, featured: i === index ? !p.featured : false }));
        setProjects(items);
    };

    const handleImageUpload = async (index, e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        try {
            const res = await api.uploadMultipleImages(files);
            const items = [...projects];
            items[index].images = [...items[index].images, ...res.files.map(f => f.filePath.replace(/^\//, ''))];
            setProjects(items);
        } catch { setMsg('❌ Upload failed'); }
    };

    const removeImage = (projectIndex, imgIndex) => {
        const items = [...projects];
        items[projectIndex].images = items[projectIndex].images.filter((_, i) => i !== imgIndex);
        setProjects(items);
    };

    // Tag management with proper chip-style input
    const addTag = (index, tag) => {
        const trimmed = tag.trim();
        if (!trimmed) return;
        const items = [...projects];
        if (!items[index].tags.includes(trimmed)) {
            items[index].tags = [...items[index].tags, trimmed];
            setProjects(items);
        }
        setTagInputs({ ...tagInputs, [index]: '' });
    };

    const removeTag = (projectIndex, tagIndex) => {
        const items = [...projects];
        items[projectIndex].tags = items[projectIndex].tags.filter((_, i) => i !== tagIndex);
        setProjects(items);
    };

    const handleTagKeyDown = (index, e) => {
        const value = tagInputs[index] || '';
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(index, value);
        } else if (e.key === 'Backspace' && !value && projects[index].tags.length > 0) {
            // Remove last tag on backspace if input is empty
            removeTag(index, projects[index].tags.length - 1);
        }
    };

    const handleTagChange = (index, value) => {
        // If user pastes comma-separated values
        if (value.includes(',')) {
            const parts = value.split(',');
            const last = parts.pop(); // keep last part in input (might be incomplete)
            parts.forEach(part => addTag(index, part));
            setTagInputs({ ...tagInputs, [index]: last.trim() });
        } else {
            setTagInputs({ ...tagInputs, [index]: value });
        }
    };

    return (
        <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Projects</h1>
                <div className="flex gap-2">
                    <button onClick={addProject} className="flex items-center gap-1 bg-[#112240] border border-slate-600 text-slate-300 px-3 py-2 rounded-lg text-sm hover:border-[#64ffda] transition-all">
                        <FiPlus size={14} /> Add Project
                    </button>
                    <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-[#64ffda] text-[#0a192f] font-bold px-5 py-2 rounded-lg hover:bg-[#4cd9b5] disabled:opacity-50 transition-all">
                        <FiSave size={16} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
            {msg && <p className={`mb-4 text-sm ${msg.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>{msg}</p>}

            <div className="space-y-3">
                {projects.map((proj, i) => (
                    <div key={proj.id} className="bg-[#112240] rounded-xl border border-slate-700/50 overflow-hidden">
                        {/* Header - always visible */}
                        <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/5" onClick={() => setEditingId(editingId === proj.id ? null : proj.id)}>
                            <span className="text-slate-500 text-xs w-6">{i + 1}</span>
                            {proj.featured && <FiStar className="text-yellow-400" size={14} />}
                            <span className={`flex-1 font-medium text-sm ${proj.title ? 'text-white' : 'text-slate-500'}`}>{proj.title || 'Untitled Project'}</span>
                            <span className="text-xs text-slate-500">{proj.images.length} imgs</span>
                            <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                                <button onClick={() => moveProject(i, -1)} className="text-slate-400 hover:text-white p-1"><FiChevronUp size={14} /></button>
                                <button onClick={() => moveProject(i, 1)} className="text-slate-400 hover:text-white p-1"><FiChevronDown size={14} /></button>
                                <button onClick={() => removeProject(i)} className="text-red-400 hover:text-red-300 p-1"><FiTrash2 size={14} /></button>
                            </div>
                        </div>

                        {/* Expanded editor */}
                        {editingId === proj.id && (
                            <div className="border-t border-slate-700/50 p-4 space-y-3 bg-[#0d1f3c]">
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <label className="text-xs text-slate-400">Title</label>
                                        <input value={proj.title} onChange={e => updateProject(i, 'title', e.target.value)} className="w-full bg-[#0a192f] border border-slate-600 rounded-lg p-2 text-white text-sm focus:outline-none mt-1" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-400">Featured</label>
                                        <button onClick={() => toggleFeatured(i)} className={`block mt-1 px-3 py-2 rounded-lg text-sm font-medium border ${proj.featured ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' : 'bg-[#0a192f] border-slate-600 text-slate-400'}`}>
                                            <FiStar size={14} />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-slate-400">Description</label>
                                    <textarea value={proj.description} onChange={e => updateProject(i, 'description', e.target.value)} rows={3} className="w-full bg-[#0a192f] border border-slate-600 rounded-lg p-2 text-white text-sm focus:outline-none mt-1" />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs text-slate-400">GitHub URL</label>
                                        <input value={proj.github} onChange={e => updateProject(i, 'github', e.target.value)} className="w-full bg-[#0a192f] border border-slate-600 rounded-lg p-2 text-white text-sm focus:outline-none mt-1" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-400">Live URL</label>
                                        <input value={proj.live} onChange={e => updateProject(i, 'live', e.target.value)} className="w-full bg-[#0a192f] border border-slate-600 rounded-lg p-2 text-white text-sm focus:outline-none mt-1" />
                                    </div>
                                </div>

                                {/* Tags - Chip Style */}
                                <div>
                                    <label className="text-xs text-slate-400">Tags (press Enter or comma to add)</label>
                                    <div className="flex flex-wrap items-center gap-1.5 bg-[#0a192f] border border-slate-600 rounded-lg p-2 mt-1 min-h-[40px] focus-within:ring-2 focus-within:ring-[#64ffda]">
                                        {proj.tags.map((tag, tagI) => (
                                            <span key={tagI} className="inline-flex items-center gap-1 bg-[#64ffda]/15 text-[#64ffda] text-xs font-medium px-2.5 py-1 rounded-full border border-[#64ffda]/30">
                                                {tag}
                                                <button onClick={() => removeTag(i, tagI)} className="hover:text-white transition-colors"><FiX size={11} /></button>
                                            </span>
                                        ))}
                                        <input
                                            value={tagInputs[i] || ''}
                                            onChange={e => handleTagChange(i, e.target.value)}
                                            onKeyDown={e => handleTagKeyDown(i, e)}
                                            placeholder={proj.tags.length === 0 ? "Type tag and press Enter..." : ""}
                                            className="flex-1 min-w-[100px] bg-transparent text-white text-sm focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Images - Accept all image types */}
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs text-slate-400">Images</label>
                                        <label className="flex items-center gap-1 text-[#64ffda] text-xs cursor-pointer hover:underline">
                                            <FiUpload size={12} /> Upload Images
                                            <input type="file" accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/bmp,image/tiff,image/avif" multiple onChange={e => handleImageUpload(i, e)} className="hidden" />
                                        </label>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {proj.images.map((img, imgI) => (
                                            <div key={imgI} className="relative group">
                                                <img src={img.startsWith('/') || img.startsWith('http') ? img : `/${img}`} alt="" className="h-16 w-24 object-cover rounded border border-slate-600" />
                                                <button onClick={() => removeImage(i, imgI)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <FiX size={10} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectsEditor;
