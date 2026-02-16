import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { getIcon } from '../utils/iconMap';

const menuVariants = {
  hidden: { opacity: 0, y: "-100%" },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20, staggerChildren: 0.1 } },
  exit: { opacity: 0, y: "-100%", transition: { duration: 0.3 } },
};

const linkVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState([]);

  useEffect(() => {
    fetch('/api/data/hero').then(r => r.json()).then(data => {
      setSocialLinks(data.socialLinks || []);
    }).catch(() => { });
  }, []);

  const navLinks = [
    { title: "About", href: "/about" },
    { title: "Skills", href: "/skills" },
    { title: "Education", href: "/education" },
    { title: "Projects", href: "/projects" },
    { title: "Connect", href: "/connect" },
  ];

  const getNavLinkClass = ({ isActive }) => {
    return `transition-colors font-semibold ${isActive ? 'text-[#64ffda]' : 'text-[#ccd6f6] hover:text-[#64ffda]'}`;
  };

  const getMobileNavLinkClass = ({ isActive }) => {
    return `text-3xl font-bold transition-colors ${isActive ? 'text-[#64ffda]' : 'text-[#ccd6f6] hover:text-[#64ffda]'}`;
  };

  return (
    <>
      <nav className='bg-[#0a192f] shadow-md sticky top-0 z-50'>
        <div className='w-full px-6 md:px-10 lg:px-16 py-4 grid grid-cols-2 md:grid-cols-3 items-center'>
          <div className='flex justify-start'>
            <NavLink to="/" className='font-bold text-2xl text-white hover:text-[#64ffda] transition-colors'>
              Manoj Aberathna
            </NavLink>
          </div>

          <div className='hidden md:flex justify-center space-x-6'>
            {socialLinks.map((link, index) => (
              <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className='text-[#ccd6f6] hover:text-[#64ffda] transition-colors'>
                {getIcon(link.icon, 22)}
              </a>
            ))}
          </div>

          <div className='hidden md:flex justify-end space-x-6'>
            {navLinks.map((link) => (
              <NavLink key={link.title} to={link.href} className={getNavLinkClass}>
                {link.title}
              </NavLink>
            ))}
          </div>

          <div className='md:hidden flex justify-end'>
            <button onClick={() => setIsOpen(!isOpen)} className='text-[#64ffda] z-50'>
              {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div className='md:hidden fixed top-0 left-0 w-full h-screen bg-[#0a192f] text-white flex flex-col items-center justify-center space-y-8 z-40 pt-20'
            initial="hidden" animate="visible" exit="hidden" variants={menuVariants}>
            {navLinks.map((link) => (
              <motion.div key={link.title} variants={linkVariants}>
                <NavLink to={link.href} className={getMobileNavLinkClass} onClick={() => setIsOpen(false)}>
                  {link.title}
                </NavLink>
              </motion.div>
            ))}
            <motion.div variants={linkVariants} className='flex space-x-8 pt-8'>
              {socialLinks.map((link, index) => (
                <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className='text-[#ccd6f6] hover:text-[#64ffda] transition-colors' onClick={() => setIsOpen(false)}>
                  {getIcon(link.icon, 30)}
                </a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;