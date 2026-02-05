import React from 'react';
import { Menu } from 'lucide-react'; // Ikon Menu

const Sidebar = () => {
  return (
    <aside className="w-64 h-full bg-white border-r border-gray-200 flex flex-col pt-4">
      
      {/* Label Menu Header */}
      <div className="px-6 mb-6 flex items-center gap-2 text-gray-800 font-bold text-lg">
        <Menu size={24} />
        <span>Menu</span>
      </div>

      {/* Navigasi Link */}
      <nav className="flex-1 px-4 space-y-2">
        
        {/* Item 1: Active State (Sesuai Gambar) */}
        <a 
          href="#" 
          className="block w-full px-4 py-3 bg-[#1e293b] text-white rounded-md font-medium shadow-sm transition-colors"
        >
          Project Posture
        </a>

        {/* Item 2: Inactive State */}
        <a 
          href="#" 
          className="block w-full px-4 py-3 text-gray-400 font-medium hover:bg-gray-50 hover:text-gray-600 rounded-md transition-colors"
        >
          Project Progress
        </a>

      </nav>

      {/* Footer Sidebar (Opsional) */}
      <div className="p-4 text-xs text-gray-400 text-center">
        v1.0.0
      </div>
    </aside>
  );
};

export default Sidebar;