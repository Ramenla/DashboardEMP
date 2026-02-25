import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import { ProjectList } from './features/list';
import { ProjectProgress } from './features/progress';
import { ProjectPosture } from './features/posture';

// Lazy load komponen utama fitur
const LazyProjectList = React.lazy(() => import('./features/list/ProjectList'));
const LazyProjectProgress = React.lazy(() => import('./features/progress/ProjectProgress'));
const LazyProjectPosture = React.lazy(() => import('./features/posture/ProjectPosture'));

/**
 * komponen utama aplikasi yang mengatur routing
 * @returns {JSX.Element} struktur routing aplikasi dengan MainLayout sebagai wrapper
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
          {/* jika user buka halaman awal (root), langsung ke dashboard */}
          <Route path="/" element={<Navigate to="/posture" replace />} />

          {/* rute halaman dashboard */}
          <Route path="/posture" element={<LazyProjectPosture />} />

          {/* rute halaman posture */}
          <Route path="/list" element={<LazyProjectList />} />

          {/* rute halaman progress */}
          <Route path="/progress" element={<LazyProjectProgress />} />
        </Routes>
      </React.Suspense>
    </MainLayout>
  );
}

export default App;