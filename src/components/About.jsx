import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import Tilt from 'react-parallax-tilt';
import { getIcon } from '../utils/iconMap';

const About = () => {
    const [aboutData, setAboutData] = useState(null);

    useEffect(() => {
        fetch('/api/data/about').then(r => r.json()).then(setAboutData).catch(() => { });
    }, []);

    const d = aboutData || {
        introText: 'Loading...',
        philosophyData: [],
        journeyData: []
    };

    const [introText] = useTypewriter({
        words: [d.introText],
        loop: 1, typeSpeed: 25,
    });

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

    const typedText = introText.slice(0, -1);
    const typingChar = introText.slice(-1);

    const sortedPhilosophy = [...(d.philosophyData || [])].sort((a, b) => a.order - b.order);
    const sortedJourney = [...(d.journeyData || [])].sort((a, b) => a.order - b.order);

    return (
        <motion.section id="about" className="pt-16 pb-24 page-background text-white" initial="hidden" animate="visible" transition={{ duration: 0.5 }}>
            <div className="container mx-auto px-6">
                {/* Typewriter and Photo Section */}
                <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    className="max-w-5xl mx-auto bg-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg ring-1 ring-white/10 mb-24 p-6">
                    <div className="p-4 border-b border-slate-600 flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center p-6">
                        <div className="md:col-span-2 text-left min-h-[220px]">
                            <p className="font-mono text-lg whitespace-pre-wrap leading-relaxed">
                                <span className="text-slate-300">{typedText}</span>
                                <span className="text-[#64ffda]">{typingChar}</span>
                                <Cursor cursorStyle='_' cursorColor='#64ffda' />
                            </p>
                        </div>
                        <div className="md:col-span-1 flex justify-center items-center">
                            <motion.img src="/profile.png" alt="Profile" className="w-50 h-50 object-cover border-4 border-[#64ffda] shadow-lg"
                                initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8, delay: 0.3 }} />
                        </div>
                    </div>
                </motion.div>

                {/* My Philosophy */}
                <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center max-w-5xl mx-auto mb-24">
                    <h2 className="text-3xl font-bold mb-4">My Philosophy</h2>
                    <p className="text-[#8892b0] mb-12">Technology should solve problems and make life easier. For me, that means:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {sortedPhilosophy.map((item, index) => (
                            <motion.div key={item.id || index} variants={itemVariants}>
                                <Tilt className="p-1 rounded-xl" glareEnable={true} glareMaxOpacity={0.15} glareColor="#ffffff" glarePosition="all" tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000}>
                                    <div className="bg-[#112240] p-6 rounded-lg text-center h-55 flex flex-col justify-center items-center shadow-lg ring-1 ring-slate-700">
                                        <div className="text-[#64ffda] mb-3">{getIcon(item.icon, 40)}</div>
                                        <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                        <p className="text-sm text-[#8892b0]">{item.text}</p>
                                    </div>
                                </Tilt>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* My Developer Journey */}
                <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-16">My Developer Journey</h2>
                    <div className="relative">
                        <div className="absolute top-0 h-full w-0.5 bg-slate-700 left-1/2 -translate-x-1/2"></div>
                        {sortedJourney.map((item, index) => (
                            <motion.div key={item.id || index}
                                className={`flex items-center w-full mb-8 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.8 }}>
                                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-lg ring-1 ring-white/10 shadow-lg">
                                        <p className="text-[#64ffda] font-semibold mb-1">{item.year}</p>
                                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                        <p className="text-[#ccd6f6]">{item.description}</p>
                                    </div>
                                </div>
                                <div className="absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#64ffda] border-4 border-[#112240]"></div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default About;