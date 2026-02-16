import React, { useEffect } from 'react';
import { motion, useAnimate } from 'framer-motion'; 
import { FaReact, FaNodeJs, FaPython, FaJava, FaDocker } from 'react-icons/fa';
import { SiJavascript, SiMongodb, SiTailwindcss } from 'react-icons/si';

const icons = [
    { component: FaReact, color: '#61DAFB' },
    { component: FaNodeJs, color: '#339933' },
    { component: SiJavascript, color: '#F7DF1E' },
    { component: FaPython, color: '#3776AB' },
    { component: FaJava, color: '#f89820' },
    { component: SiMongodb, color: '#47A248' },
    { component: FaDocker, color: '#2496ED' },
    { component: SiTailwindcss, color: '#06B6D4' },
];

// separate component for a single icon to handle its own animation logic
const IconAnimator = ({ Icon }) => {
    const [scope, animate] = useAnimate();
    
    useEffect(() => {
        const animateIcon = async () => {
            //infinite loop 
            while (true) {
                const duration = Math.random() * 10 + 10; // 10s to 20s
                const x = (Math.random() - 0.5) * 40; // Random horizontal movement
                const y = (Math.random() - 0.5) * 40; // Random vertical movement

                // Animate to the new random position
                await animate(scope.current, { x, y }, { duration, ease: 'easeInOut' });
            }
        };
        animateIcon();
    }, [animate, scope]);

    return (
        <motion.div ref={scope}>
            <Icon.component size={Math.random() * 20 + 25} />
        </motion.div>
    );
};

const FloatingIcons = () => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-10">
            {icons.map((Icon, index) => {
                const top = `${Math.random() * 90}%`;
                const left = `${Math.random() * 90}%`;

                return (
                    <div
                        key={index}
                        className="absolute"
                        style={{
                            top,
                            left,
                            color: Icon.color,
                        }}
                    >
                        <IconAnimator Icon={Icon} />
                    </div>
                );
            })}
        </div>
    );
};

export default FloatingIcons;