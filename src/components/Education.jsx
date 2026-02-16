import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Education = () => {
    const [data, setData] = useState({ educationData: [], certificationGroups: [] });

    useEffect(() => {
        fetch('/api/data/education').then(r => r.json()).then(setData).catch(() => { });
    }, []);

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

    const sortedEdu = [...data.educationData].sort((a, b) => a.order - b.order);
    const sortedGroups = [...data.certificationGroups].sort((a, b) => a.order - b.order);

    return (
        <motion.section id="education" className="py-24 page-background text-white" initial="hidden" animate="visible" variants={containerVariants}>
            <div className="container mx-auto px-6">
                <motion.div variants={itemVariants} className="text-center mb-16">
                    <h2 className="text-4xl font-bold">My Education</h2>
                    <p className="text-[#8892b0] mt-2">My academic journey and qualifications.</p>
                </motion.div>

                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-24" variants={containerVariants}>
                    {sortedEdu.map((edu) => (
                        <motion.div key={edu.id} className="bg-[#112240] rounded-lg shadow-lg p-6 text-center transition-all duration-300 hover:shadow-2xl hover:shadow-[#64ffda]/20"
                            variants={itemVariants} whileHover={{ scale: 1.05 }}>
                            <div className="w-full h-44 mb-4 flex items-center justify-center">
                                <img src={edu.image} alt={edu.institution} className="h-40 w-auto object-contain" />
                            </div>
                            <h3 className="text-xl font-bold text-white">{edu.title}</h3>
                            <p className="text-lg font-semibold text-[#64ffda] mt-1">{edu.institution}</p>
                            <p className="text-sm text-slate-400 mt-2 mb-3">{edu.date}</p>
                            <p className="text-sm text-[#8892b0]">{edu.description}</p>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div variants={itemVariants} className="text-center mb-16">
                    <h2 className="text-4xl font-bold">Professional Qualifications</h2>
                    <p className="text-[#8892b0] mt-2">Certifications and courses I've completed.</p>
                </motion.div>

                {sortedGroups.map((group) => (
                    <motion.div key={group.id} variants={itemVariants} className="mb-12">
                        <h3 className="text-2xl font-bold text-[#64ffda] mb-6 text-left max-w-6xl mx-auto">{group.provider}</h3>
                        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto" variants={containerVariants}>
                            {[...group.certs].sort((a, b) => a.order - b.order).map((cert) => (
                                <motion.div key={cert.id} className="bg-[#112240] rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#64ffda]/10"
                                    variants={itemVariants} whileHover={{ scale: 1.02 }}>
                                    {cert.image ? (
                                        <div className="w-full">
                                            <img src={cert.image} alt={cert.title} className="w-full h-auto object-contain" />
                                            <div className="p-3 bg-[#0a192f] text-center">
                                                <p className="text-[#ccd6f6] text-sm font-medium">{cert.title}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4">
                                            <h4 className="text-white font-semibold text-sm">{cert.title}</h4>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
};

export default Education;