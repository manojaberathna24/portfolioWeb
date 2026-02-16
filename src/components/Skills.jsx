import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconMap';

const Skills = () => {
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        fetch('/api/data/skills').then(r => r.json()).then(data => {
            setSkills(data.sort((a, b) => a.order - b.order));
        }).catch(() => { });
    }, []);

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

    return (
        <motion.section id="skills" className="pt-12 pb-24 page-background text-white" initial="hidden" animate="visible" viewport={{ once: true }} variants={containerVariants}>
            <div className="container mx-auto px-6">
                <motion.div variants={itemVariants} className="text-center">
                    <h2 className="text-4xl font-bold mb-4">My Tech Stack</h2>
                    <p className="text-[#8892b0] mb-12">The tools and technologies I love to work with.</p>
                </motion.div>
                <motion.div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-8" variants={containerVariants}>
                    {skills.map((skill) => (
                        <motion.div key={skill.id || skill.name} className="flex flex-col items-center justify-center space-y-2" variants={itemVariants}
                            whileHover={{ scale: 1.1, y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                            <div style={{ color: skill.color }}>
                                {getIcon(skill.icon, 50)}
                            </div>
                            <p className="text-[#ccd6f6] text-sm">{skill.name}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    );
};

export default Skills;