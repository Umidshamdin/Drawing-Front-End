import { useState, type FormEvent } from 'react';
import { Link, Navigate, useParams } from 'react-router';
import { ArrowRight, CalendarDays, Heart, Lock, LogOut, Package, Settings2, UserRound } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { del, get, post, put } from '../../lib/api';
import { dateText, errText, money, orderLabel } from '../../lib/helpers';
import { useRemote } from '../../lib/hooks';
import type { ArtworkCard, Order, Page, Tracking } from '../../lib/types';
import { ArtworkCardView, Empty, ErrorState, Loader, PageHeading, Status } from '../../components/Ui';

export function AccountPage() {
  const { user, logout, refreshMe } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ fullName: user?.fullName || '', phoneNumber: user?.phoneNumber || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [busy, setBusy] = useState(false);
  if (!user) return <Navigate to="/login?return=/account" replace />;
  const save = async (e: FormEvent) => { e.preventDefault(); setBusy(true); try { await put('/api/v1/auth/me', form); await refreshMe(); toast('Profil məlumatları yeniləndi.'); } catch (e) { toast(errText(e), 'error'); } finally { setBusy(false); } };
  const changePassword = async (e: FormEvent) => { e.preventDefault(); setBusy(true); try { await post('/api/v1/auth/change-password', passwords); toast('Şifrə dəyişdirildi. Yenidən daxil olun.', 'info'); await logout(); } catch (e) { toast(errText(e), 'error'); } finally { setBusy(false); } };
  return <div className="container section-padding"><PageHeading eyebrow="ŞƏXSİ KABİNET" title={`Salam, ${user.fullName.split(' ')[0]}!`} desc="Profilinizi, bəyənilənlərinizi və sifarişlərinizi idarə edin." /><div className="account-layout"><aside className="account-nav"><Link className="active" to="/account"><UserRound size={18} /> Profilim</Link><Link to="/favorites"><Heart size={18} /> Bəyənilənlər</Link><Link to="/orders"><Package size={18} /> Sifarişlərim</Link><Link to="/artist"><Settings2 size={18} /> Rəssam kabineti</Link><button onClick={() => void logout()}><LogOut size={18} /> Çıxış</button></aside><div className="account-main"><div className="panel"><h2>Profil məlumatlarım</h2><form onSubmit={save} className="form-grid"><div className="field"><label>Ad və soyad</label><input required value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} /></div><div className="field"><label>Email</label><input disabled value={user.email} /></div><div className="field"><label>Telefon nömrəsi</label><input value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} placeholder="+994..." /></div><div className="form-actions"><button disabled={busy} className="btn btn-primary">Yadda saxla <ArrowRight size={16} /></button></div></form></div><div className="panel"><h2><Lock size={21} /> Şifrənin dəyişdirilməsi</h2><form className="form-grid" onSubmit={changePassword}><div className="field"><label>Cari şifrə</label><input type="password" required value={passwords.currentPassword} onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })} /></div><div className="field"><label>Yeni şifrə</label><input type="password" required minLength={8} value={passwords.newPassword} onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })} /></div><div className="form-actions"><button disabled={busy} className="btn btn-outline">Şifrəni yenilə</button></div></form></div></div></div></div>;
}
export function FavoritesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data, loading, error, reload } = useRemote<ArtworkCard[]>(user ? '/api/v1/favorites' : null);
  if (!user) return <Navigate to="/login?return=/favorites" replace />;
  const toggle = async (id: string) => { try { await post(`/api/v1/favorites/${id}/toggle`); reload(); toast('Əsər siyahıdan silindi.'); } catch (e) { toast(errText(e), 'error'); } };
  return <div className="container section-padding"><PageHeading eyebrow="ŞƏXSİ KOLLEKSİYA" title="Bəyənilən əsərlər" desc="Seçib saxladığınız əsərlər burada toplanır." />{loading ? <Loader /> : error ? <ErrorState message={error} retry={reload} /> : data?.length ? <div className="art-grid">{data.map(item => <ArtworkCardView key={item.id} artwork={item} onFavorite={toggle} favorite />)}</div> : <Empty title="Bəyənilən əsər yoxdur" text="Qalereyada ürəyinizcə olan əsərləri yadda saxlayın." icon={<Heart size={28} />} action={<Link className="btn btn-primary" to="/artworks">Əsərləri kəşf et <ArrowRight size={16} /></Link>} />}</div>;
}
export function OrdersPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useRemote<Page<Order>>(user ? `/api/v1/orders/my?page=${page}&pageSize=15` : null);
  if (!user) return <Navigate to="/login?return=/orders" replace />;
  return <div className="container section-padding"><PageHeading eyebrow="SİFARİŞ TARİXÇƏSİ" title="Sifarişlərim" desc="Sifarişlərinizi və çatdırılma vəziyyətini burada izləyin." />{loading ? <Loader /> : error ? <ErrorState message={error} retry={reload} /> : !data?.items.length ? <Empty icon={<Package size={29} />} title="Hələ sifarişiniz yoxdur" text="İlk əsərinizi kəşf etməyin tam zamanıdır." action={<Link to="/artworks" className="btn btn-primary">Qalereyaya keç</Link>} /> : <div className="order-list">{data.items.map(order => <div className="order-list-card" key={order.id}><div><span className="eyebrow">SİFARİŞ #{order.id.slice(0, 8).toUpperCase()}</span><h3>{order.items.map(x => x.title).join(', ') || 'Sifariş'}</h3><p><CalendarDays size={15} /> {dateText(order.createdAt)}</p></div><div className="order-list-right"><b>{money(order.totalAmount)}</b><Status text={orderLabel(order.status)} variant={order.status === 'Completed' ? 'success' : order.status === 'Rejected' || order.status === 'Cancelled' ? 'danger' : 'pending'} /><Link to={`/orders/${order.id}`} className="text-link">İzləmə <ArrowRight size={16} /></Link></div></div>)}{data.total > data.pageSize && <div className="pagination"><button disabled={page <= 1} onClick={() => setPage(page - 1)}>Əvvəlki</button><span>{page}</span><button disabled={page * data.pageSize >= data.total} onClick={() => setPage(page + 1)}>Növbəti</button></div>}</div>}</div>;
}
export function OrderTrackingPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const { data, loading, error, reload } = useRemote<Tracking>(user && id ? `/api/v1/orders/${id}/tracking` : null);
  if (!user) return <Navigate to="/login" replace />;
  if (loading) return <Loader />;
  if (error) return <div className="container section-padding"><ErrorState message={error} retry={reload} /></div>;
  if (!data) return <div className="container section-padding"><Empty title="Sifariş tapılmadı" /></div>;
  return <div className="container section-padding"><PageHeading eyebrow="SİFARİŞİN İZLƏNMƏSİ" title={`Sifariş #${data.order.id.slice(0, 8)}`} back="/orders" /><div className="tracking-layout"><div className="panel"><h2>Sifarişin mərhələləri</h2><div className="timeline">{data.history.map((item, i) => <div className="timeline-item" key={i}><div className="timeline-marker" /><div><h4>{orderLabel(item.newStatus)}</h4><small>{dateText(item.changedAt)}</small>{item.note && <p>{item.note}</p>}</div></div>)}</div></div><aside className="panel"><h3>Sifariş məlumatı</h3><p className="muted">{dateText(data.order.createdAt)}</p><Status text={orderLabel(data.order.status)} variant="pending" /><div className="divider" />{data.order.items.map(item => <div className="order-summary-row" key={item.artworkId}><span>{item.title}</span><b>{money(item.unitPrice)}</b></div>)}<div className="order-summary-row total"><span>Yekun</span><b>{money(data.order.totalAmount)}</b></div>{data.delivery && <><div className="divider" /><h4>Çatdırılma</h4><p>{data.delivery.courierName || 'Kuryer təyin edilməyib'}</p><p>{data.delivery.trackingNumber || 'İzləmə nömrəsi yoxdur'}</p>{data.delivery.deliveryNotes && <p>{data.delivery.deliveryNotes}</p>}</>}</aside></div></div>;
}
