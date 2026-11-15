import { useState, type ReactNode } from 'react';
import { NavLink, Link, useLocation, Navigate } from 'react-router';
import { BarChart3, Bell, BookOpen, ChevronDown, Contact, FileText, GalleryHorizontal, Home, Image, Layers3, LogOut, Mail, Menu, Paintbrush2, Settings2, ShieldCheck, ShoppingBag, Star, Tag, Users, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { siteName } from '../lib/helpers';

const groups = [
  { title: 'İcmal', items: [{ url: '/admin', text: 'Dashboard', icon: BarChart3, end: true }] },
  { title: 'Qalereya idarəsi', items: [{ url: '/admin/artists', text: 'Rəssam müraciətləri', icon: Paintbrush2 }, { url: '/admin/artworks', text: 'Əsər moderasiyası', icon: GalleryHorizontal }, { url: '/admin/featured', text: 'Seçilmiş əsərlər', icon: Star }, { url: '/admin/categories', text: 'Kateqoriyalar', icon: Layers3 }, { url: '/admin/lookups', text: 'Texnika və seçimlər', icon: Tag }] },
  { title: 'Satış', items: [{ url: '/admin/orders', text: 'Sifarişlər', icon: ShoppingBag }, { url: '/admin/users', text: 'İstifadəçilər', icon: Users }] },
  { title: 'Məzmun', items: [{ url: '/admin/slides', text: 'Slider', icon: Image }, { url: '/admin/pages', text: 'Məlumat səhifələri', icon: FileText }, { url: '/admin/settings', text: 'Footer və əlaqə', icon: Settings2 }, { url: '/admin/messages', text: 'Müraciətlər', icon: Contact }, { url: '/admin/emails', text: 'Email növbəsi', icon: Mail }] }
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  if (!user) return <Navigate to={`/login?return=${encodeURIComponent(location.pathname)}`} replace />;
  if (!isAdmin) return <div className="admin-denied"><ShieldCheck size={36} /><h2>Administrator icazəsi tələb olunur</h2><p>Bu bölmə yalnız administratorlar üçündür.</p><Link to="/" className="btn btn-primary">Sayta qayıt</Link></div>;
  return <div className="admin-shell"><aside className={`admin-sidebar ${open ? 'open' : ''}`}><div className="admin-sidebar-top"><Link to="/" className="brand"><span className="brand-icon">✳</span><span>{siteName}<small>ADMIN PANEL</small></span></Link><button className="icon-button sidebar-close" onClick={() => setOpen(false)}><X size={20} /></button></div><div className="admin-side-scroll">{groups.map(group => <div key={group.title} className="admin-nav-group"><div className="admin-nav-title">{group.title}</div>{group.items.map(item => <NavLink key={item.url} onClick={() => setOpen(false)} to={item.url} end={'end' in item ? item.end : false} className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}><item.icon size={18} /><span>{item.text}</span></NavLink>)}</div>)}</div><div className="admin-sidebar-bottom"><Link to="/" className="admin-nav-link"><Home size={18} /> Sayta bax</Link><button onClick={() => void logout()} className="admin-nav-link"><LogOut size={18} /> Çıxış</button></div></aside>{open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}
    <div className="admin-content"><header className="admin-header"><div className="admin-header-left"><button className="icon-button admin-menu" onClick={() => setOpen(true)}><Menu size={21} /></button><span className="admin-crumb">İdarəetmə paneli</span><ChevronDown size={14} className="subtle" /><span className="admin-current">{groups.flatMap(x => x.items).find(x => x.url === location.pathname)?.text || 'Detallar'}</span></div><div className="admin-header-right"><Link to="/" className="admin-top-link"><BookOpen size={16} /> Sayta keç</Link><span className="admin-icon-circle"><Bell size={19} /></span><span className="admin-user-avatar">{user.fullName.charAt(0).toUpperCase()}</span><div className="admin-user-name"><b>{user.fullName}</b><small>Administrator</small></div></div></header><main className="admin-main">{children}</main><footer className="admin-footer">{siteName} Admin <span>© {new Date().getFullYear()}</span></footer></div></div>;
}
