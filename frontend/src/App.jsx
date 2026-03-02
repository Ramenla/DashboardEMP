/**
 * @file App.jsx
 * @description Komponen root aplikasi yang mengatur routing halaman.
 * Menggunakan React.lazy untuk code-splitting pada setiap halaman fitur,
 * sehingga bundle awal tetap ringan dan halaman dimuat sesuai kebutuhan.
 *
 * Rute yang tersedia:
 * - `/`         → Redirect ke `/posture`
 * - `/posture`  → Dashboard postur proyek (KPI, chart status & prioritas)
 * - `/list`     → Tabel daftar proyek dengan filter
 * - `/progress` → Gantt chart progres timeline proyek
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

const LazyProjectList = React.lazy(() => import('./features/list/ProjectList'));
const LazyProjectProgress = React.lazy(() => import('./features/progress/ProjectProgress'));
const LazyProjectPosture = React.lazy(() => import('./features/posture/ProjectPosture'));

/**
 * @returns {JSX.Element} Struktur routing aplikasi dengan MainLayout sebagai wrapper.
 */
function App() {
  return (
    <MainLayout>
      <React.Suspense fallback={
        <div className="flex items-center justify-center h-full w-full p-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Navigate to="/posture" replace />} />
          <Route path="/posture" element={<LazyProjectPosture />} />
          <Route path="/list" element={<LazyProjectList />} />
          <Route path="/progress" element={<LazyProjectProgress />} />
        </Routes>
      </React.Suspense>
    </MainLayout>
  );
}

export default App;