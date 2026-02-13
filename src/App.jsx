import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import { ProjectList } from './features/list';
import { ProjectProgress } from './features/progress';
import { ProjectPosture } from './features/posture';

/**
 * komponen utama aplikasi yang mengatur routing
 * @returns {JSX.Element} struktur routing aplikasi dengan MainLayout sebagai wrapper
 */
function App() {
  return (
    <MainLayout>
      <Routes>
        {/* jika user buka halaman awal (root), langsung ke dashboard */}
        <Route path="/" element={<Navigate to="/posture" replace />} />

        {/* rute halaman dashboard */}
        <Route path="/posture" element={<ProjectPosture />} />

        {/* rute halaman posture */}
        <Route path="/list" element={<ProjectList />} />

        {/* rute halaman progress */}
        <Route path="/progress" element={<ProjectProgress />} />
      </Routes>
    </MainLayout>
  );
}

export default App;