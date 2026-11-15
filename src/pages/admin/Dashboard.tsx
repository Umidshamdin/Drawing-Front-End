import { Link } from 'react-router';
import { ArrowRight, Brush, GalleryHorizontal, Package, Paintbrush2, Plus, Users } from 'lucide-react';
import { AdminHeading, AdminPageState, AdminPanel } from './AdminShared';
import { useRemote } from '../../lib/hooks';
import { dateText, money, orderLabel } from '../../lib/helpers';
import type { AdminDashboard, Order } from '../../lib/types';
import { Empty, Status } from '../../components/Ui';

export function AdminDashboardPage() {
  const { data, loading, error, reload } = useRemote<AdminDashboard>('/api/v1/admin/dashboard');
  const { data: orders } = useRemote<Order[]>('/api/v1/admin/orders');
  const stats = [
    { title: 'İstifadəçilər', value: data?.users || 0, icon: Users, color: 'blue', link: '/admin/users' },
    { title: 'Gözləyən rəssam', value: data?.artistsPending || 0, icon: Paintbrush2, color: 'orange', link: '/admin/artists' },
    { title: 'Moderasiya', value: data?.artworksPending || 0, icon: GalleryHorizontal, color: 'purple', link: '/admin/artworks' },
    { title: 'Yayımlanan əsər', value: data?.artworksLive || 0, icon: Brush, color: 'green', link: '/admin/featured' },
    { title: 'Yeni sifarişlər', value: data?.ordersPending || 0, icon: Package, color: 'orange', link: '/admin/orders' },
    { title: 'Tamamlanan satışlar', value: data?.ordersCompleted || 0, icon: Package, color: 'green', link: '/admin/orders' }
  ];
  return <><AdminHeading title="İdarəetmə paneli" description="Platformanın gündəlik fəaliyyətini bir ekrandan izləyin." /><AdminPageState loading={loading} error={error} onRetry={reload}><div className="admin-stats">{stats.map(item => <Link key={item.title} to={item.link} className="stat-card"><span className={`stat-icon ${item.color}`}><item.icon size={22} /></span><span className="stat-label">{item.title}</span><strong>{item.value}</strong><span className="stat-detail">Detallara bax <ArrowRight size={14} /></span></Link>)}</div></AdminPageState><div className="admin-two-cols"><AdminPanel title="Son sifarişlər" action="Hamısına bax" link="/admin/orders">{orders?.length ? <div className="table-scroll"><table className="data-table"><thead><tr><th>Sifariş</th><th>Məbləğ</th><th>Status</th><th>Tarix</th></tr></thead><tbody>{orders.slice(0, 6).map(order => <tr key={order.id}><td><Link to={`/admin/orders/${order.id}`}><b>#{order.id.slice(0, 8)}</b></Link></td><td>{money(order.totalAmount)}</td><td><Status text={orderLabel(order.status)} variant="pending" /></td><td>{dateText(order.createdAt)}</td></tr>)}</tbody></table></div> : <Empty title="Sifariş yoxdur" />}</AdminPanel><AdminPanel title="Sürətli əməliyyatlar"><div className="quick-actions"><Link to="/admin/categories"><Plus size={18} /> Yeni kateqoriya <ArrowRight size={16} /></Link><Link to="/admin/slides"><Plus size={18} /> Slider əlavə et <ArrowRight size={16} /></Link><Link to="/admin/artists"><Paintbrush2 size={18} /> Rəssam müraciətləri <ArrowRight size={16} /></Link><Link to="/admin/artworks"><GalleryHorizontal size={18} /> Əsər təsdiqləri <ArrowRight size={16} /></Link><Link to="/admin/pages"><Plus size={18} /> Məlumat səhifələri <ArrowRight size={16} /></Link></div></AdminPanel></div></>;
}
