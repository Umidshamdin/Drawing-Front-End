import { useState, type FormEvent } from 'react';
import { Link, Navigate, useParams } from 'react-router';
import { ArrowRight, CheckCircle2, MapPin, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { post } from '../../lib/api';
import { demoArtworks } from '../../data/demo';
import { demoMode, errText, guid, money } from '../../lib/helpers';
import { useRemote } from '../../lib/hooks';
import type { ArtworkDetails, Order } from '../../lib/types';
import { ArtworkImage, ErrorState, Loader, PageHeading } from '../../components/Ui';

export function CheckoutPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const demo = demoArtworks.find(x => x.id === id);
  const demoDetails: ArtworkDetails | undefined = demo ? { id: demo.id, title: demo.title, description: null, price: demo.price, widthCm: 60, heightCm: 80, city: demo.city, artistName: demo.artistName, artistId: demo.id, saleStatus: demo.saleStatus, imageUrls: [demo.mainImageUrl || ''], categories: [] } : undefined;
  const { data, loading, error } = useRemote<ArtworkDetails>(id ? `/api/v1/artworks/${id}` : null, demoMode ? demoDetails : undefined);
  const [form, setForm] = useState({ fullName: user?.fullName || '', email: user?.email || '', phone: user?.phoneNumber || '', address: '', city: 'Bakı' });
  const [requestId] = useState(guid);
  const [busy, setBusy] = useState(false);
  const [orderId, setOrderId] = useState('');
  if (!user) return <Navigate to={`/login?return=${encodeURIComponent(`/checkout/${id}`)}`} replace />;
  const send = async (event: FormEvent) => { event.preventDefault(); if (!id) return; setBusy(true); try { const order = await post<Order>('/api/v1/orders', { ...form, artworkId: id, requestId }); setOrderId(order.id); toast('Sifariş sorğunuz qəbul edildi.'); } catch (e) { toast(errText(e), 'error'); } finally { setBusy(false); } };
  if (loading) return <Loader />;
  if (error) return <div className="container section-padding"><ErrorState message={error} /></div>;
  if (!data) return <div className="container section-padding"><PageHeading title="Əsər tapılmadı" /></div>;
  return <div className="container section-padding"><PageHeading eyebrow="SİFARİŞ SORĞUSU" title={orderId ? 'Sorğunuz qəbul edildi!' : 'Əsər üçün sifariş sorğusu'} desc="Əsər rezerv edilməzdən əvvəl administrator mövcudluğunu təsdiqləyəcək." back={`/artworks/${id}`} />{orderId ? <div className="success-order panel"><PackageCheck size={58} /><h2>Təşəkkür edirik!</h2><p>Sifariş sorğunuz qeydiyyata alındı. Vəziyyəti şəxsi kabinetinizdən izləyə bilərsiniz.</p><div className="order-confirm-id">Sifariş nömrəsi: <b>{orderId}</b></div><Link className="btn btn-primary btn-large" to={`/orders/${orderId}`}>Sifarişimi izlə <ArrowRight size={17} /></Link></div> : <div className="checkout-grid"><form className="panel checkout-form" onSubmit={send}><h2>Əlaqə və çatdırılma məlumatları</h2><div className="form-grid"><div className="field"><label>Ad və soyad</label><input required maxLength={200} value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} /></div><div className="field"><label>Email</label><input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div><div className="field"><label>Telefon</label><input required maxLength={30} value={form.phone} placeholder="+994..." onChange={e => setForm({ ...form, phone: e.target.value })} /></div><div className="field"><label>Şəhər</label><input value="Bakı" disabled /></div><div className="field full"><label>Çatdırılma ünvanı</label><textarea required rows={3} maxLength={1000} value={form.address} placeholder="Rayon, küçə, bina, mənzil" onChange={e => setForm({ ...form, address: e.target.value })} /></div></div><div className="checkout-notice"><ShieldCheck size={21} /><p>Bu mərhələdə kartınızdan pul tutulmur. Yekun ödəniş və çatdırılma məlumatları sonradan təsdiqlənəcək.</p></div><button className="btn btn-primary btn-large" disabled={busy || demoMode} type="submit">{busy ? 'Göndərilir...' : demoMode ? 'Demo rejimində sifariş bağlıdır' : 'Sifariş sorğusu göndər'} <ArrowRight size={17} /></button></form><aside className="panel checkout-summary"><h3>Seçilmiş əsər</h3><div className="checkout-art"><ArtworkImage src={data.imageUrls[0]} alt={data.title} /><div><h4>{data.title}</h4><p>{data.artistName}</p><b>{money(data.price)}</b></div></div><div className="divider" /><div className="order-summary-row"><span>Əsərin qiyməti</span><b>{money(data.price)}</b></div><div className="order-summary-row"><span>Çatdırılma</span><span>Təsdiqdən sonra</span></div><div className="divider" /><div className="order-summary-row total"><b>İlkin məbləğ</b><b>{money(data.price)}</b></div><p className="checkout-foot"><Truck size={17} /> Bakı daxilində çatdırılma <MapPin size={15} /></p></aside></div>}</div>;
}
