import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Education from './components/Education';
import Projects from './components/Projects';
import Connect from './components/Connect';

// Admin
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import ProtectedRoute from './admin/ProtectedRoute';
import HeroEditor from './admin/sections/HeroEditor';
import AboutEditor from './admin/sections/AboutEditor';
import SkillsEditor from './admin/sections/SkillsEditor';
import EducationEditor from './admin/sections/EducationEditor';
import ProjectsEditor from './admin/sections/ProjectsEditor';
import ConnectEditor from './admin/sections/ConnectEditor';

function App() {
  return (
    <div>
      <Routes>
        {/* Public Portfolio Routes */}
        <Route path="/" element={<><Navbar /><Hero /></>} />
        <Route path="/about" element={<><Navbar /><About /></>} />
        <Route path="/skills" element={<><Navbar /><Skills /></>} />
        <Route path="/education" element={<><Navbar /><Education /></>} />
        <Route path="/projects" element={<><Navbar /><Projects /></>} />
        <Route path="/connect" element={<><Navbar /><Connect /></>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="hero" element={<HeroEditor />} />
          <Route path="about" element={<AboutEditor />} />
          <Route path="skills" element={<SkillsEditor />} />
          <Route path="education" element={<EducationEditor />} />
          <Route path="projects" element={<ProjectsEditor />} />
          <Route path="connect" element={<ConnectEditor />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;