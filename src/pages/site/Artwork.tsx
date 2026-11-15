import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, ArrowRight, CheckCircle2, Heart, MapPin, Maximize2, Ruler, Share2, ShieldCheck, Truck, UserRound } from 'lucide-react';
import { demoArtworks } from '../../data/demo';
import { demoMode, fileUrl, isAvailable, money, saleLabel } from '../../lib/helpers';
import { useRemote } from '../../lib/hooks';
import { post } from '../../lib/api';
import type { ArtworkDetails } from '../../lib/types';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { ArtworkImage, ErrorState, Loader, Modal, PageHeading, Status } from '../../components/Ui';

export function ArtworkPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const demo = demoArtworks.find(x => x.id === id);
  const demoDetails: ArtworkDetails | undefined = demo ? { id: demo.id, title: demo.title, description: 'Orijinal sənət əsəri. Bu təsvir nümayiş üçün əlavə edilib.', price: demo.price, widthCm: 60, heightCm: 80, city: demo.city, artistName: demo.artistName, artistId: demo.id, saleStatus: demo.saleStatus, imageUrls: [demo.mainImageUrl || ''], categories: ['Orijinal əsər'] } : undefined;
  const { data, loading, error, reload } = useRemote<ArtworkDetails>(id ? `/api/v1/artworks/${id}` : null, demoMode ? demoDetails : undefined);
  if (loading) return <Loader />;
  if (error) return <div className="container section-padding"><ErrorState message={error} retry={reload} /></div>;
  if (!data) return <div className="container section-padding"><PageHeading title="Əsər tapılmadı" desc="Axtardığınız əsər mövcud deyil və ya ictimai qalereyada deyil." back="/artworks" /></div>;
  const images = data.imageUrls?.length ? data.imageUrls : [''];
  const current = images[Math.min(index, images.length - 1)];
  const favorite = async () => { if (!user) { navigate('/login'); return; } try { const result = await post<{ isFavorite: boolean }>(`/api/v1/favorites/${data.id}/toggle`); toast(result.isFavorite ? 'Bəyənilənlərə əlavə edildi.' : 'Bəyənilənlərdən çıxarıldı.'); } catch { toast('Əməliyyat baş tutmadı.', 'error'); } };
  const share = async () => { try { if (navigator.share) await navigator.share({ title: data.title, url: window.location.href }); else { await navigator.clipboard.writeText(window.location.href); toast('Keçid kopyalandı.'); } } catch { } };
  return <div className="container details-page"><div className="breadcrumb"><Link to="/">Ana səhifə</Link><span>/</span><Link to="/artworks">Əsərlər</Link><span>/</span><b>{data.title}</b></div><div className="details-grid"><div className="details-gallery"><button className="details-main-photo" onClick={() => setZoom(true)} aria-label="Şəkli böyüt"><ArtworkImage src={current} alt={data.title} /><span className="zoom-hint"><Maximize2 size={17} /> Tam baxış</span></button><div className="details-thumbs">{images.map((url, i) => <button key={`${url}-${i}`} onClick={() => setIndex(i)} className={index === i ? 'active' : ''}><ArtworkImage src={url} alt={`${data.title} — ${i + 1}`} /></button>)}</div></div><div className="details-info"><span className="eyebrow">ORİJİNAL RƏSM ƏSƏRİ</span><h1>{data.title}</h1><Link to={`/artists/${data.artistId}`} className="details-artist"><UserRound size={17} /> {data.artistName} <ArrowRight size={15} /></Link><div className="details-price">{money(data.price)}</div><Status text={saleLabel(data.saleStatus)} variant={isAvailable(data) ? 'success' : 'pending'} /><div className="details-divider" /><h3>Əsər haqqında</h3><p className="details-description">{data.description || 'Bu əsər üçün əlavə təsvir yerləşdirilməyib.'}</p><div className="details-specs"><div><Ruler size={18} /><span>Ölçü</span><b>{data.widthCm} × {data.heightCm} sm</b></div><div><MapPin size={18} /><span>Məkan</span><b>{data.city}</b></div><div><CheckCircle2 size={18} /><span>Kateqoriya</span><b>{data.categories.join(', ') || '—'}</b></div></div><div className="details-actions">{isAvailable(data) ? <Link className="btn btn-primary btn-large" to={`/checkout/${data.id}`}>Sifariş sorğusu göndər <ArrowRight size={19} /></Link> : <button className="btn btn-muted btn-large" disabled>Hazırda satışda deyil</button>}<button className="btn btn-outline details-square" onClick={favorite} aria-label="Bəyən"><Heart size={20} /></button><button className="btn btn-outline details-square" onClick={share} aria-label="Paylaş"><Share2 size={20} /></button></div><p className="details-note">Sifariş dərhal ödəniş deyil. Administrator əsərin mövcudluğunu təsdiqləyəcək.</p><div className="details-assurance"><div><ShieldCheck size={23} /><span><b>Yoxlanılmış əsər</b>Administrator təsdiqindən sonra dərc edilir.</span></div><div><Truck size={23} /><span><b>Çatdırılma</b>İlkin mərhələdə Bakı daxilində.</span></div></div></div></div>{zoom && <Modal title={data.title} onClose={() => setZoom(false)} wide><div className="lightbox"><img src={fileUrl(current)} alt={data.title} /><div className="lightbox-actions"><button className="btn btn-outline" onClick={() => setIndex(i => (i - 1 + images.length) % images.length)}><ArrowLeft size={17} /> Əvvəlki</button><span>{index + 1} / {images.length}</span><button className="btn btn-outline" onClick={() => setIndex(i => (i + 1) % images.length)}>Növbəti <ArrowRight size={17} /></button></div></div></Modal>}</div>;
}
