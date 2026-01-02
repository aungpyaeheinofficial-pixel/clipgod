
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: 'fa-gauge-high' },
    { id: AppView.CODE, label: 'Source Code', icon: 'fa-code' },
    { id: AppView.DOCS, label: 'Documentation', icon: 'fa-book' },
  ];

  return (
    <aside className="w-64 hidden md:flex flex-col border-r border-white/5 bg-[#0D0D0E]">
      <div className="p-6 flex items-center space-x-3">
        <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
          <i className="fa-solid fa-bolt text-black text-lg"></i>
        </div>
        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          OpusClone
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              currentView === item.id
                ? 'bg-white/10 text-white shadow-lg'
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-lg`}></i>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-yellow-400/5 border border-yellow-400/10 rounded-2xl p-4">
          <p className="text-xs text-yellow-400 font-semibold uppercase tracking-wider mb-2">Pro Version</p>
          <p className="text-sm text-gray-400 mb-4">Unlock multi-speaker tracking and 4K exports.</p>
          <button className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-bold rounded-lg transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
