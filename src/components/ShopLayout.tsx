import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router';
import { ArrowRight, Heart, Instagram, Mail, Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import { get } from '../lib/api';
import { demoMode, siteName } from '../lib/helpers';
import type { Category, FooterData, NavbarData } from '../lib/types';
import { demoCategories } from '../data/demo';
import { useAuth } from '../contexts/AuthContext';
import { BackTop } from './Ui';

export function ShopLayout({ children }: { children: ReactNode }) {
  const { user, isAdmin } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [footer, setFooter] = useState<FooterData | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => { setMenuOpen(false); window.scrollTo(0, 0); }, [location.pathname]);
  useEffect(() => {
    if (demoMode) { setCategories(demoCategories); return; }
    get<NavbarData>('/api/v1/navbar').then(data => setCategories(data.categories || [])).catch(() => setCategories([]));
  }, []);
  useEffect(() => { get<FooterData>('/api/v1/footer').then(setFooter).catch(() => {}); }, []);
  const submit = (event: FormEvent) => { event.preventDefault(); navigate(`/artworks${search.trim() ? `?q=${encodeURIComponent(search.trim())}` : ''}`); setMenuOpen(false); };
  return <div className="site-shell">
    <div className="announcement">Azərbaycan rəssamlarının orijinal əsərləri <span>•</span> Sənətə öz məkanında yer aç</div>
    <header className="site-header"><div className="container header-inner">
      <Link className="brand" to="/"><span className="brand-icon">✳</span><span>{siteName}<small>ART GALLERY</small></span></Link>
      <nav className="desktop-nav" aria-label="Əsas menyu"><NavLink to="/artworks">Əsərlər</NavLink><NavLink to="/artists">Rəssamlar</NavLink><NavLink to="/about">Haqqımızda</NavLink><NavLink to="/how-it-works">Necə işləyir?</NavLink></nav>
      <form className="header-search" onSubmit={submit}><Search size={18} /><input aria-label="Rəsm əsəri axtar" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rəsm və ya rəssam axtar..." /><button aria-label="Axtar" type="submit"><ArrowRight size={17} /></button></form>
      <div className="header-actions"><Link to="/favorites" aria-label="Bəyənilənlər" className="icon-button"><Heart size={21} /></Link><Link to="/orders" aria-label="Sifarişlər" className="icon-button"><ShoppingBag size={21} /></Link><Link to={user ? '/account' : '/login'} aria-label="Hesab" className="icon-button"><UserRound size={21} /></Link>{isAdmin && <Link to="/admin" className="btn btn-mini btn-primary">Admin</Link>}<button className="icon-button mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menyunu aç">{menuOpen ? <X size={23} /> : <Menu size={23} />}</button></div>
    </div><div className="category-strip"><div className="container category-strip-inner"><Link to="/artworks">Bütün əsərlər</Link>{categories.slice(0, 8).map(category => <Link key={category.id} to={`/artworks?categoryId=${category.id}`}>{category.name}</Link>)}<Link to="/artist/apply" className="category-sell">Əsərini satışa çıxar <ArrowRight size={14} /></Link></div></div>
    {menuOpen && <div className="mobile-nav"><form onSubmit={submit} className="mobile-search"><Search size={18} /><input placeholder="Əsər axtar..." value={search} onChange={e => setSearch(e.target.value)} /><button type="submit">Axtar</button></form>{[['/artworks','Bütün əsərlər'],['/artists','Rəssamlar'],['/about','Haqqımızda'],['/how-it-works','Necə işləyir?'],['/artist','Rəssam kabineti'],['/account','Hesabım']].map(([url, label]) => <Link key={url} to={url}>{label}<ArrowRight size={16} /></Link>)}</div>}
    </header>
    {demoMode && <div className="demo-notice">Nümunə baxış rejimi — göstərilən əsərlər real satış məhsulu deyil. Backend bağlantısı üçün .env faylında VITE_DEMO_MODE=false təyin edin.</div>}
    <main className="site-main">{children}</main>
    <footer className="footer"><div className="container"><div className="footer-grid"><div><Link className="brand footer-brand" to="/"><span className="brand-icon">✳</span><span>{siteName}<small>ART GALLERY</small></span></Link><p>Azərbaycan sənətini hər evə, hər məkana və hər günə yaxınlaşdıran rəqəmsal qalereya.</p><div className="social-links">{footer?.instagram && <a href={footer.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a>}{footer?.email && <a href={`mailto:${footer.email}`} aria-label="Email"><Mail size={18} /></a>}</div></div><div><h4>Kəşf et</h4><Link to="/artworks">Bütün əsərlər</Link><Link to="/artists">Rəssamlar</Link><Link to="/favorites">Bəyənilənlər</Link><Link to="/artist/apply">Rəssam ol</Link></div><div><h4>Məlumat</h4><Link to="/about">Haqqımızda</Link><Link to="/how-it-works">Alış və satış</Link><Link to="/delivery">Çatdırılma</Link><Link to="/privacy">Məxfilik siyasəti</Link><Link to="/terms">İstifadə şərtləri</Link>{footer?.links.filter(x => !['about','delivery','privacy','terms'].includes(x.slug)).slice(0, 4).map(x => <Link key={x.slug} to={`/pages/${x.slug}`}>{x.title}</Link>)}</div><div><h4>Əlaqə</h4><p>Suallarınız və təklifləriniz üçün bizə yazın.</p><Link className="footer-contact" to="/contact">Bizə yazın <ArrowRight size={16} /></Link>{footer?.email && <a href={`mailto:${footer.email}`}>{footer.email}</a>}{footer?.phone && <a href={`tel:${footer.phone}`}>{footer.phone}</a>}</div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {siteName}. Bütün hüquqlar qorunur.</span><span>Azərbaycan rəssamlarının sənəti ilə.</span></div></div></footer>
    <BackTop />
  </div>;
}
