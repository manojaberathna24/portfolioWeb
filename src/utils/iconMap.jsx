// Icon mapping utility - maps string icon names from JSON to actual React components
import {
    FaGithub, FaLinkedin, FaInstagram, FaTwitter, FaYoutube, FaFacebook, FaTiktok, FaWhatsapp, FaTelegram, FaDiscord,
    FaPython, FaJava, FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaPhp, FaGit, FaDocker, FaAngular, FaLinux, FaAws, FaKaggle,
    FaRobot, FaBrain, FaTools, FaInfinity, FaCode, FaLaptopCode, FaRocket, FaLightbulb, FaCogs, FaGraduationCap, FaDownload
} from 'react-icons/fa';
import { FaFlutter, FaXTwitter } from 'react-icons/fa6';
import { FiMail, FiPhone, FiMapPin, FiExternalLink } from 'react-icons/fi';
import { IoLogoAndroid, IoLogoDocker } from 'react-icons/io5';
import {
    SiJavascript, SiTypescript, SiMongodb, SiTailwindcss, SiCplusplus, SiC, SiKotlin,
    SiTensorflow, SiKeras, SiScikitlearn, SiNumpy, SiPandas, SiStreamlit,
    SiFlask, SiFastapi, SiExpress, SiFirebase, SiSupabase, SiMysql, SiOracle,
    SiPostman, SiN8N, SiOpenai, SiFigma, SiGooglecloud
} from 'react-icons/si';

const iconMap = {
    // Social
    FaGithub, FaLinkedin, FaInstagram, FaTwitter, FaYoutube, FaFacebook, FaTiktok, FaWhatsapp, FaTelegram, FaDiscord, FaXTwitter,
    FiMail, FiPhone, FiMapPin, FiExternalLink,
    // Tech
    FaPython, FaJava, FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaPhp, FaGit, FaDocker, FaAngular, FaLinux, FaAws, FaKaggle, FaFlutter,
    SiJavascript, SiTypescript, SiMongodb, SiTailwindcss, SiCplusplus, SiC, SiKotlin,
    SiTensorflow, SiKeras, SiScikitlearn, SiNumpy, SiPandas, SiStreamlit,
    SiFlask, SiFastapi, SiExpress, SiFirebase, SiSupabase, SiMysql, SiOracle,
    SiPostman, SiN8N, SiOpenai, SiFigma, SiGooglecloud,
    IoLogoAndroid, IoLogoDocker,
    // Philosophy
    FaRobot, FaBrain, FaTools, FaInfinity, FaCode, FaLaptopCode, FaRocket, FaLightbulb, FaCogs, FaGraduationCap,
    FaDownload,
};

export const getIcon = (name, size = 24) => {
    const IconComponent = iconMap[name];
    if (!IconComponent) return null;
    return <IconComponent size={size} />;
};

export default iconMap;
