import { Bell, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
export default function AdminTopbar() { const { user } = useAuth(); const page = useLocation().pathname.split('/').pop() || 'dashboard'; return <header className="admin-topbar"><div><small>HQ / ADMIN</small><h1>{page.replace(/^./, (x) => x.toUpperCase())}</h1></div><div className="top-actions"><span className="sync-pill">● Live Sync Active</span><Search size={19} /><Bell size={19} /><div className="profile"><b>{user?.firstName?.[0] || 'A'}</b><span>{user?.firstName} {user?.lastName}<small>{user?.employeeId || 'Admin'}</small></span></div></div></header>; }
