import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return <div className={className} style={{ ...style, display: "block", right: "10px", zIndex: 1 }} onClick={onClick} />;
}
function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return <div className={className} style={{ ...style, display: "block", left: "10px", zIndex: 1 }} onClick={onClick} />;
}

const ProjectCard = ({ project, isFeatured, index }) => {
    const sliderSettings = {
        dots: true, infinite: true, speed: 500,
        slidesToShow: 1, slidesToScroll: 1, autoplay: true, autoplaySpeed: 3000,
        nextArrow: <SampleNextArrow />, prevArrow: <SamplePrevArrow />
    };

    const getImgSrc = (img) => {
        if (img.startsWith('/') || img.startsWith('http')) return img;
        return `/${img}`;
    };

    if (isFeatured) {
        return (
            <motion.div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center mb-16"
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8 }}>
                <div className={`md:col-span-7 text-left ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                    <p className="text-[#64ffda] text-sm mb-2">Featured Project</p>
                    <h3 className="text-3xl font-bold text-white mb-4 hover:text-[#64ffda] transition-colors">
                        <a href={project.live || project.github} target="_blank" rel="noopener noreferrer">{project.title}</a>
                    </h3>
                    <div className="bg-[#112240] p-6 rounded-md shadow-lg mb-4"><p className="text-[#ccd6f6]">{project.description}</p></div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">{project.tags.map(tag => (<span key={tag} className="text-slate-400 text-sm font-mono">{tag}</span>))}</div>
                    <div className="flex justify-start space-x-4">
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-[#ccd6f6] hover:text-[#64ffda] transition-colors"><FaGithub size={24} /></a>
                        <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-[#ccd6f6] hover:text-[#64ffda] transition-colors"><FiExternalLink size={24} /></a>
                    </div>
                </div>
                <div className={`md:col-span-5 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                    <div className="rounded-lg overflow-hidden shadow-2xl slick-container">
                        <Slider {...sliderSettings}>
                            {project.images.map((img, i) => (<div key={i}><img src={getImgSrc(img)} alt={`${project.title} screenshot ${i + 1}`} className="w-full h-80 object-contain bg-[#0a192f]" /></div>))}
                        </Slider>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div className="bg-[#112240] rounded-lg overflow-hidden shadow-lg flex flex-col group"
            variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
            whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 300 }}>
            <div className="overflow-hidden h-48 bg-[#0a192f]">
                {project.images && project.images.length > 0 ? (
                    <Slider {...sliderSettings}>
                        {project.images.map((img, i) => (<div key={i}><img src={getImgSrc(img)} alt={`${project.title} screenshot ${i + 1}`} className="w-full h-48 object-contain bg-[#0a192f]" /></div>))}
                    </Slider>
                ) : (
                    <div className="flex items-center justify-center h-full text-4xl">💻</div>
                )}
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-sm text-[#ccd6f6] mb-4 flex-grow">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map(tag => (<span key={tag} className="bg-[#0a192f] text-[#64ffda] text-xs font-semibold px-2.5 py-1 rounded-full">{tag}</span>))}
                </div>
                <div className="mt-auto flex justify-end space-x-4">
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-[#ccd6f6] hover:text-[#64ffda] transition-colors"><FaGithub size={24} /></a>
                    <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-[#ccd6f6] hover:text-[#64ffda] transition-colors"><FiExternalLink size={24} /></a>
                </div>
            </div>
        </motion.div>
    );
};

const Projects = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetch('/api/data/projects').then(r => r.json()).then(data => {
            setProjects(data.sort((a, b) => a.order - b.order));
        }).catch(() => { });
    }, []);

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
    const featuredProject = projects.find(p => p.featured);
    const otherProjects = projects.filter(p => !p.featured);

    return (
        <motion.section id="projects" className="pt-12 pb-24 page-background text-white" initial="hidden" animate="visible" variants={containerVariants}>
            <div className="container mx-auto px-6">
                <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="text-center mb-16">
                    <h2 className="text-4xl font-bold">My Projects</h2>
                    <p className="text-[#8892b0] mt-2">A selection of my AI/ML and full-stack projects. Feel free to explore.</p>
                </motion.div>
                {featuredProject && <ProjectCard project={featuredProject} isFeatured={true} index={0} />}
                {otherProjects.length > 0 && (
                    <motion.div className="text-center my-16">
                        <h3 className="text-3xl font-bold">Other Noteworthy Projects</h3>
                    </motion.div>
                )}
                <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" variants={containerVariants}>
                    {otherProjects.map((project, index) => (
                        <ProjectCard project={project} key={project.id || index} isFeatured={false} index={index + 1} />
                    ))}
                </motion.div>
            </div>
        </motion.section>
    );
};

export default Projects;