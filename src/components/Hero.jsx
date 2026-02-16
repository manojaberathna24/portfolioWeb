import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter, FaReact, FaNodeJs, FaPython, FaJava, FaDocker, FaAngular, FaInstagram, FaDownload } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import { SiJavascript, SiMongodb, SiTailwindcss, SiCplusplus, SiFirebase, SiTensorflow, SiFlask, SiOpenai } from 'react-icons/si';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import ParticleBackground from './ParticleBackground';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconMap';

// Background floating icons
const bgIcons = [
    { component: FaReact, color: '#61DAFB' }, { component: FaNodeJs, color: '#339933' },
    { component: SiJavascript, color: '#F7DF1E' }, { component: FaPython, color: '#3776AB' },
    { component: FaJava, color: '#f89820' }, { component: SiMongodb, color: '#47A248' },
    { component: FaDocker, color: '#2496ED' }, { component: SiTailwindcss, color: '#06B6D4' },
    { component: SiTensorflow, color: '#FF6F00' }, { component: SiFlask, color: '#000000' },
    { component: SiFirebase, color: '#FFCA28' },
];

const MemoizedFloatingIcons = React.memo(() => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
            {bgIcons.map((Icon, index) => {
                const duration = Math.random() * 15 + 15;
                const size = Math.random() * 25 + 30;
                const top = `${Math.random() * 90}%`;
                const left = `${Math.random() * 90}%`;
                return (
                    <motion.div key={index} className="absolute" style={{ top, left, color: Icon.color }}
                        animate={{ y: [0, -10, 5, 10, 0, -5], x: [0, 5, -10, 0, 10, 0] }}
                        transition={{ duration, ease: 'linear', repeat: Infinity, repeatType: 'mirror' }}>
                        <Icon.component size={size} />
                    </motion.div>
                );
            })}
        </div>
    );
});

const MemoizedParticleBackground = React.memo(ParticleBackground);

const Hero = () => {
    const [heroData, setHeroData] = useState(null);

    useEffect(() => {
        fetch('/api/data/hero').then(r => r.json()).then(setHeroData).catch(() => { });
    }, []);

    const d = heroData || {
        name: 'Manoj Aberathna',
        title: 'AI/ML Engineer & Full-Stack Developer',
        bio: 'I build intelligent AI solutions that solve real-world problems.',
        profileImage: '/profile.png',
        typewriterWords: ['AI/ML Engineer', 'Full Stack Developer', 'Data Science Enthusiast'],
        cvFile: 'projects/Manoj_Aberathna_CV.pdf',
        socialLinks: []
    };

    const [text] = useTypewriter({
        words: d.typewriterWords || ['AI/ML Engineer', 'Full Stack Developer'],
        loop: {},
        typeSpeed: 100,
        deleteSpeed: 80,
    });

    return (
        <div className="relative pt-10 pb-16 md:pt-20 md:pb-15 flex items-center justify-center text-center overflow-hidden">
            <MemoizedParticleBackground />
            <MemoizedFloatingIcons />

            <div className="relative z-10 flex flex-col items-center px-4">
                <img src={d.profileImage} alt={d.name} className="w-48 h-48 rounded-full object-cover object-top border-4 border-[#64ffda] mb-6 bg-[#0a192f]" />
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">{d.name}</h1>
                <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-[#64ffda] to-blue-500 bg-clip-text text-transparent mb-2 min-h-[56px]">
                    <span>{text}</span>
                    <Cursor cursorStyle='|' />
                </h2>
                <p className="max-w-2xl text-lg text-[#ccd6f6] mb-6 leading-relaxed" dangerouslySetInnerHTML={{
                    __html: d.bio.replace(/intelligent AI solutions/g, '<span class="text-[#64ffda] font-semibold">intelligent AI solutions</span>')
                        .replace(/end-to-end AI applications/g, '<span class="text-[#64ffda] font-semibold">end-to-end AI applications</span>')
                }} />
                <div className="flex space-x-6 mb-8">
                    {d.socialLinks?.map((link, i) => (
                        <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="text-[#ccd6f6] hover:text-[#64ffda] transition-colors">
                            {getIcon(link.icon, 30)}
                        </a>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/projects" className="bg-transparent border-2 border-[#64ffda] text-[#64ffda] font-bold py-3 px-8 rounded hover:bg-[#64ffda] hover:text-[#0a1f2f] transition-all flex items-center justify-center gap-2">
                        View My Projects
                    </Link>
                    <a href={d.cvFile} download className="bg-transparent border-2 border-[#64ffda] text-[#64ffda] font-bold py-3 px-8 rounded hover:bg-[#64ffda] hover:text-[#0a1f2f] transition-all flex items-center justify-center gap-2">
                        <FaDownload />
                        <span>Grab my CV</span>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Hero;