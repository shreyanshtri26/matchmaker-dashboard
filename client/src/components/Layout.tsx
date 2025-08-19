import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/AppBar */}
      <header className="bg-primary-600 text-white shadow-md">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg sm:text-xl font-semibold">
              TDC Matchmaker Dashboard
            </h1>
            {/* Add user menu/avatar here */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-3 sm:p-6 bg-background">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="px-4 py-2 sm:px-6">
          <p className="text-center text-sm text-gray-600">
            {new Date().getFullYear()} TDC Matchmaker
          </p>
        </div>
      </footer>

      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          className: 'bg-white border border-gray-200 text-gray-900',
        }}
      />
    </div>
  );
};

export default Layout;