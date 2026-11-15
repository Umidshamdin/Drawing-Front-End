import { ArrowLeft, ArrowRight, AlertCircle, ChevronLeft, ChevronRight, Heart, ImageOff, LoaderCircle, Search, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router';
import { fileUrl, isAvailable, money, saleLabel } from '../lib/helpers';
import type { ArtworkCard } from '../lib/types';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { post, readAuth } from '../lib/api';
import { apiBase } from '../lib/helpers';

export function Loader({ label = 'Yüklənir...' }: { label?: string }) { return <div className="state-loader"><LoaderCircle size={28} className="spin" /><span>{label}</span></div>; }
export function Empty({ title = 'Hələ məlumat yoxdur', text, icon, action }: { title?: string; text?: string; icon?: ReactNode; action?: ReactNode }) { return <div className="state-empty"><div className="state-empty-icon">{icon || <ImageOff size={28} />}</div><h3>{title}</h3>{text && <p>{text}</p>}{action && <div className="state-action">{action}</div>}</div>; }
export function ErrorState({ message, retry }: { message: string; retry?: () => void }) { return <div className="state-empty error-state"><AlertCircle size={28} /><h3>Məlumatları yükləmək alınmadı</h3><p>{message}</p>{retry && <button className="btn btn-outline" onClick={retry}>Yenidən yoxla</button>}</div>; }
export function PageHeading({ eyebrow, title, desc, back }: { eyebrow?: string; title: string; desc?: string; back?: string }) { return <div className="page-heading">{back && <Link to={back} className="back-link"><ArrowLeft size={16} /> Geri qayıt</Link>}{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1>{desc && <p>{desc}</p>}</div>; }
export function SectionHeading({ eyebrow, title, subtitle, link, linkText = 'Hamısına bax' }: { eyebrow?: string; title: string; subtitle?: string; link?: string; linkText?: string }) { return <div className="section-heading"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{link && <Link className="section-link" to={link}>{linkText}<ArrowRight size={17} /></Link>}</div>; }
export function ArtworkImage({ src, alt, className = '', style }: { src?: string | null; alt: string; className?: string; style?: CSSProperties }) {
  const [failed, setFailed] = useState(false);
  const [secured, setSecured] = useState('');
  const [tryAuth, setTryAuth] = useState(false);
  useEffect(() => {
    setFailed(false);
    setSecured('');
    setTryAuth(false);
  }, [src]);
  useEffect(() => {
    if (!tryAuth || !src || !src.startsWith('/api/v1/media/')) return;
    const token = readAuth()?.accessToken;
    if (!token) { setFailed(true); return; }
    let alive = true;
    let objectUrl = '';
    fetch(`${apiBase}${src}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(response => { if (!response.ok) throw new Error('Şəkil açılmadı'); return response.blob(); })
      .then(blob => { objectUrl = URL.createObjectURL(blob); if (alive) setSecured(objectUrl); else URL.revokeObjectURL(objectUrl); })
      .catch(() => { if (alive) setFailed(true); });
    return () => { alive = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [tryAuth, src]);
  return src && !failed ? <img className={className} src={secured || fileUrl(src)} alt={alt} loading="lazy" style={style} onError={() => { if (!tryAuth) setTryAuth(true); else setFailed(true); }} /> : <div className={`art-placeholder ${className}`} style={style}><Sparkles size={26} /><span>Sənət əsəri</span></div>;
}
export function Status({ text, variant = 'neutral' }: { text: string; variant?: 'success' | 'pending' | 'danger' | 'neutral' }) { return <span className={`status-pill status-${variant}`}>{text}</span>; }
export function Modal({ title, children, onClose, wide = false }: { title: string; children: ReactNode; onClose: () => void; wide?: boolean }) { return <div className="modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><div className={`modal ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}><div className="modal-header"><h3>{title}</h3><button className="icon-button" onClick={onClose} aria-label="Bağla"><span className="close-symbol">×</span></button></div><div className="modal-body">{children}</div></div></div>; }
export function ArtworkCardView({ artwork, onFavorite, favorite = false }: { artwork: ArtworkCard; onFavorite?: (id: string) => void; favorite?: boolean }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [liked, setLiked] = useState(favorite);
  const [busy, setBusy] = useState(false);
  const toggleFavorite = async () => {
    if (!user) { toast('Əsəri yadda saxlamaq üçün hesabınıza daxil olun.', 'info'); return; }
    if (onFavorite) { onFavorite(artwork.id); return; }
    setBusy(true);
    try { const result = await post<{ isFavorite: boolean }>(`/api/v1/favorites/${artwork.id}/toggle`); setLiked(result.isFavorite); toast(result.isFavorite ? 'Əsər bəyənilənlərə əlavə edildi.' : 'Əsər bəyənilənlərdən çıxarıldı.'); }
    catch { toast('Bəyənilənlər yenilənmədi.', 'error'); }
    finally { setBusy(false); }
  };
  return <article className="art-card"><Link to={`/artworks/${artwork.id}`} className="art-card-visual"><ArtworkImage src={artwork.mainImageUrl} alt={artwork.title} /><span className="art-card-badge">{saleLabel(artwork.saleStatus)}</span></Link><button onClick={toggleFavorite} disabled={busy} className={`art-favorite ${liked ? 'active' : ''}`} aria-label="Bəyənilənlərə əlavə et"><Heart size={19} fill={liked ? 'currentColor' : 'none'} /></button><div className="art-card-body"><p className="art-card-artist">{artwork.artistName}</p><Link to={`/artworks/${artwork.id}`} className="art-card-title">{artwork.title}</Link><div className="art-card-bottom"><b>{money(artwork.price)}</b><span>{artwork.city}</span></div></div>{!isAvailable(artwork) && <span className="sr-only">Satışda deyil</span>}</article>;
}
export function ProductCarousel({ artworks }: { artworks: ArtworkCard[] }) { const ref = useRef<HTMLDivElement>(null); return <div className="carousel-shell"><div className="carousel-actions"><button className="icon-button border" aria-label="Əvvəlki əsərlər" onClick={() => ref.current?.scrollBy({ left: -320, behavior: 'smooth' })}><ChevronLeft size={19} /></button><button className="icon-button border" aria-label="Növbəti əsərlər" onClick={() => ref.current?.scrollBy({ left: 320, behavior: 'smooth' })}><ChevronRight size={19} /></button></div><div ref={ref} className="product-carousel">{artworks.map(artwork => <ArtworkCardView key={artwork.id} artwork={artwork} />)}</div></div>; }
export function BackTop() { return <button className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Yuxarı qalx"><ArrowRight size={20} style={{ transform: 'rotate(-90deg)' }} /></button>; }
export function SearchInline({ value, onChange, placeholder = 'Axtar...' }: { value: string; onChange: (value: string) => void; placeholder?: string }) { return <div className="search-inline"><Search size={17} /><input value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} /></div>; }
