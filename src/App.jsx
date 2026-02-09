import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import { Dashboard } from './features/dashboard';
import { ProjectProgress } from './features/progress';

function App() {
  return (
    <MainLayout>
      <Routes>
        {/* Jika user buka halaman awal (root), lempar ke dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Rute Halaman Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Rute Halaman Progress */}
        <Route path="/progress" element={<ProjectProgress />} />
      </Routes>
    </MainLayout>
  );
}

export default App;