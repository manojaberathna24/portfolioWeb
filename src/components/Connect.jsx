import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import axios from 'axios';
import { getIcon } from '../utils/iconMap';

const Connect = () => {
    const [connectData, setConnectData] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');

    useEffect(() => {
        fetch('/api/data/connect').then(r => r.json()).then(setConnectData).catch(() => { });
    }, []);

    const d = connectData || {
        contactInfo: { email: '', phone: '', location: '' },
        contactLinks: []
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Sending...');
        try {
            await axios.post('/.netlify/functions/contact', formData);
            setStatus('Message Sent Successfully!');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            setStatus('Failed to send message. Please try again.');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2, duration: 0.5 } },
    };

    const sortedLinks = [...(d.contactLinks || [])].sort((a, b) => a.order - b.order);

    return (
        <motion.section id="connect" className="pt-10 pb-24 page-background text-white min-h-screen flex items-center"
            initial="hidden" animate="visible" variants={containerVariants}>
            <div className="container mx-auto px-6">
                <motion.div variants={containerVariants} className="text-center mb-16">
                    <h2 className="text-4xl font-bold">Let's Connect</h2>
                    <p className="text-[#8892b0] mt-2">Have a project in mind or just want to say hello? I'd love to hear from you.</p>
                </motion.div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Column: The Orb */}
                    <motion.div variants={containerVariants} className="hidden lg:flex justify-center items-center">
                        <div className="relative w-96 h-96 group">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#64ffda] to-blue-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                            <div className="relative w-full h-full orb-container group-hover:[animation-play-state:paused]">
                                {sortedLinks.map((item, index) => {
                                    const angle = (index / sortedLinks.length) * 2 * Math.PI;
                                    const x = 50 + 45 * Math.cos(angle);
                                    const y = 50 + 45 * Math.sin(angle);
                                    return (
                                        <a key={item.id || index} href={item.href} target="_blank" rel="noopener noreferrer" className="absolute orb-item"
                                            style={{ top: `${y}%`, left: `${x}%`, transform: 'translate(-50%, -50%)' }}>
                                            <div className="w-20 h-20 bg-[#112240]/50 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 group-hover:text-[#64ffda] ring-1 ring-slate-700 hover:!scale-110 hover:!text-[#64ffda] transition-all duration-300">
                                                {getIcon(item.icon, 32)}
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Contact Form */}
                    <motion.form onSubmit={handleSubmit} variants={containerVariants} className="space-y-6">
                        <div className="bg-[#112240] rounded-lg p-4 mb-6">
                            <div className="flex items-center gap-3 text-[#ccd6f6] mb-2">
                                <FiMail className="text-[#64ffda]" /><span>{d.contactInfo.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[#ccd6f6] mb-2">
                                <FiPhone className="text-[#64ffda]" /><span>{d.contactInfo.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[#ccd6f6]">
                                <FiMapPin className="text-[#64ffda]" /><span>{d.contactInfo.location}</span>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-[#ccd6f6] mb-2">Name</label>
                            <input type="text" id="name" value={formData.name} onChange={handleChange} required placeholder="Your Name" className="w-full bg-[#112240] border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:border-transparent transition-all" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-[#ccd6f6] mb-2">Email</label>
                            <input type="email" id="email" value={formData.email} onChange={handleChange} required placeholder="Your Email" className="w-full bg-[#112240] border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:border-transparent transition-all" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-semibold text-[#ccd6f6] mb-2">Message</label>
                            <textarea id="message" value={formData.message} onChange={handleChange} required rows="5" placeholder="Your Message" className="w-full bg-[#112240] border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:border-transparent transition-all"></textarea>
                        </div>
                        <motion.button type="submit" disabled={status === 'Sending...'} className="w-full bg-[#112240] border-2 border-slate-700 text-[#ccd6f6] font-bold py-3 px-6 rounded-lg hover:bg-[#64ffda] hover:text-[#0a1f2f] hover:border-[#64ffda] transition-all duration-300" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            {status === 'Sending...' ? 'Sending...' : 'Send Message'}
                        </motion.button>
                        {status && <p className="text-center mt-4 text-sm text-[#64ffda]">{status}</p>}
                    </motion.form>
                </div>
            </div>
        </motion.section>
    );
};

export default Connect;