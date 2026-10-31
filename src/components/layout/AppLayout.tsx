import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { CartDrawer } from '../cart/CartDrawer';
import { CommandPalette } from './CommandPalette';

export const AppLayout: React.FC = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-[#12304A]">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <TopBar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Global Slide-in Cart Drawer */}
        <CartDrawer />

        {/* Global Command Palette (Cmd+K) */}
        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
        />

        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </div>
    </div>
  );
};
