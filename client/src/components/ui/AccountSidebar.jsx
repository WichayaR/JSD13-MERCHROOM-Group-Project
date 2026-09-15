// src/components/ui/AccountSidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAccount } from '../../context/AccountContext';

export const AccountSidebar = () => {
  const { profile, orderCount } = useAccount();
  const navigate = useNavigate();

  const navItems = [
    { label: 'MY PROFILE', path: '/account/profile', icon: '👤' },
    { label: 'ORDER HISTORY', path: '/account/orders', icon: '📦', badge: orderCount },
    { label: 'WISHLIST', path: '/account/wishlist', icon: '❤️' },
    { label: 'PAYMENT METHODS', path: '/account/payment-methods', icon: '💳' },
  ];

  const fullName = `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || 'CUSTOMER';

  return (
    <aside className="flex flex-col gap-6 p-6 bg-white border border-ink shadow-card rounded-card">
      {/* Profile Card Header */}
      <div className="flex items-center gap-4 pb-5 border-b-2 border-ink">
        <div className="w-12 h-12 rounded-full overflow-hidden border border-ink bg-cream shrink-0">
          <img
            src={profile?.profilePicture || 'https://via.placeholder.com/60'}
            alt={fullName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <h4 className="font-sans font-extrabold text-sm text-ink uppercase truncate">
            {fullName}
          </h4>
          <span className="text-xs text-muted truncate">{profile?.email}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex md:flex-col gap-2 overflow-x-auto scrollbar-hide pb-1 md:pb-0">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 font-sans font-bold text-xs tracking-wider border rounded-btn transition-all shrink-0 md:shrink ${
                isActive
                  ? 'bg-ink text-cream-text border-ink'
                  : 'bg-transparent text-ink border-transparent hover:bg-cream hover:border-ink'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            <span className="whitespace-nowrap">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="ml-auto bg-highlight text-ink text-[10px] font-black px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="hidden md:block pt-4 border-t border-dashed border-muted/50 mt-auto">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-full py-2.5 px-4 bg-transparent text-ink border border-ink font-sans font-bold text-xs tracking-wider rounded-btn hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer"
        >
          LOGOUT ↵
        </button>
      </div>
    </aside>
  );
};