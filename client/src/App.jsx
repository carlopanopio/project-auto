import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { isAuthenticated } from './lib/auth.js';
import { useScrollReveal } from './hooks/useScrollReveal.js';

import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import Hero from './sections/Hero.jsx';
import Tools from './sections/Tools.jsx';
import Services from './sections/Services.jsx';
import Portfolio from './sections/Portfolio.jsx';
import Process from './sections/Process.jsx';
import Testimonials from './sections/Testimonials.jsx';
import Certifications from './sections/Certifications.jsx';
import Contact from './sections/Contact.jsx';
import AdminLogin from './components/admin/AdminLogin.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';

function PublicSite() {
  useScrollReveal();
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Tools />
        <Services />
        <Portfolio />
        <Process />
        <Testimonials />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

function AdminRoute() {
  const [authed, setAuthed] = useState(isAuthenticated());
  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;
  return <AdminLayout onLogout={() => setAuthed(false)} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicSite />} />
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
