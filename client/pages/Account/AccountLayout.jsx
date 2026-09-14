// pages/Account/AccountLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AccountProvider } from '../../src/context/AccountContext';
import { AccountSidebar } from '../../src/components/ui/AccountSidebar';

export default function AccountLayout() {
  return (
    <AccountProvider>
      <div className="bg-cream min-h-screen py-8 px-4 sm:px-8">
        {/* Breadcrumb Section */}
        <div className="max-w-6xl mx-auto mb-6 font-sans text-xs font-bold tracking-widest text-muted">
          <span>HOME</span> &gt; <span className="text-ink">ACCOUNT</span>
        </div>

        {/* Main Layout Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 items-start">
          <AccountSidebar />
          <section className="min-w-0">
            <Outlet />
          </section>
        </div>
      </div>
    </AccountProvider>
  );
}