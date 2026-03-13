
'use client';

import React, { useState } from 'react';
import { useApp } from '../store/AppContext';

const FloatingContact: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { appConfig } = useApp();

  return (
    <div className="fixed bottom-20 md:bottom-10 right-6 z-[100] flex flex-col items-end gap-3">
      {/* Menu Options */}
      {isOpen && (
        <div className="flex flex-col gap-3 mb-2 animate-in slide-in-from-bottom-4 duration-300">
          {appConfig.messengerUrl && (
            <a 
              href={appConfig.messengerUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-3"
            >
              <span className="bg-white px-3 py-1 rounded-sm shadow-md text-[10px] font-black uppercase text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">Messenger</span>
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                <i className="fa-brands fa-facebook-messenger text-xl"></i>
              </div>
            </a>
          )}
          
          {appConfig.zaloUrl && (
            <a 
              href={appConfig.zaloUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-3"
            >
              <span className="bg-white px-3 py-1 rounded-sm shadow-md text-[10px] font-black uppercase text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">Chat Zalo</span>
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                <span className="font-black text-xs uppercase tracking-tighter">Zalo</span>
              </div>
            </a>
          )}

          {appConfig.hotline && (
            <a 
              href={`tel:${appConfig.hotline}`}
              className="group flex items-center gap-3"
            >
              <span className="bg-white px-3 py-1 rounded-sm shadow-md text-[10px] font-black uppercase text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">Hotline</span>
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                <i className="fa-solid fa-phone text-xl"></i>
              </div>
            </a>
          )}
        </div>
      )}

      {/* Main Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${isOpen ? 'bg-slate-900 rotate-90' : 'bg-[#ee4d2d] animate-pulse-slow'}`}
      >
        {isOpen ? (
          <i className="fa-solid fa-xmark text-white text-2xl"></i>
        ) : (
          <div className="relative">
            <i className="fa-solid fa-headset text-white text-2xl"></i>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
            </span>
          </div>
        )}
      </button>
    </div>
  );
};

export default FloatingContact;
