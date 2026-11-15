import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowRight, BookOpen, Brush, CheckCircle2, Clock3, Heart, Mail, MapPin, Phone, ShieldCheck, Truck, UserRound } from 'lucide-react';
import { demoMode } from '../../lib/helpers';
import { useRemote } from '../../lib/hooks';
import { post } from '../../lib/api';
import type { ArtistCard, ArtistPublic, SitePage } from '../../lib/types';
import { ArtworkCardView, ArtworkImage, Empty, ErrorState, Loader, PageHeading, SectionHeading } from '../../components/Ui';
import { useToast } from '../../contexts/ToastContext';

export function ArtistsPage() {
  const { data, loading, error } = useRemote<ArtistCard[]>('/api/v1/artists/featured', demoMode ? [] : undefined);
  return <div className="container section-padding"><PageHeading eyebrow="YARADICILAR" title="Rəssamlarımız" desc="Azərbaycan sənətinin ilhamverici imzalarını kəşf edin." />{loading ? <Loader /> : error ? <ErrorState message={error} /> : !data?.length ? <Empty title="Seçilmiş rəssam yoxdur" text="Administrator seçilmiş rəssamları təsdiqlədikdən sonra burada görünəcəklər." /> : <div className="artist-list-grid">{data.map(artist => <Link key={artist.id} to={`/artists/${artist.id}`} className="artist-profile-card"><ArtworkImage src={artist.profileImageUrl} alt={artist.displayName} /><div><h3>{artist.displayName}</h3><p><MapPin size={15} /> {artist.city}</p><span>Əsərlərini kəşf et <ArrowRight size={16} /></span></div></Link>)}</div>}</div>;
}
export function ArtistPublicPage() {
  const { id } = useParams();
  const { data, loading, error } = useRemote<ArtistPublic>(id ? `/api/v1/artists/${id}` : null);
  if (loading) return <Loader />;
  if (error) return <div className="container section-padding"><ErrorState message={error} /></div>;
  if (!data) return <div className="container section-padding"><PageHeading title="Rəssam tapılmadı" back="/artists" /></div>;
  return <div className="container section-padding"><div className="artist-public-hero"><ArtworkImage src={data.profileImageUrl} alt={data.displayName} /><div><span className="eyebrow">RƏSSAM PROFİLİ</span><h1>{data.displayName}</h1><p className="with-icon"><MapPin size={17} /> {data.city}</p><p>{data.biography || 'Rəssam haqqında məlumat tezliklə əlavə ediləcək.'}</p><span className="status-pill status-success"><CheckCircle2 size={14} /> Təsdiqlənmiş rəssam</span></div></div><div className="section-padding"><SectionHeading title="Rəssamın əsərləri" subtitle={`${data.artworks.length} əsər`} />{data.artworks.length ? <div className="art-grid">{data.artworks.map(item => <ArtworkCardView key={item.id} artwork={item} />)}</div> : <Empty title="Hələ ictimai əsər yoxdur" />}</div></div>;
}
const staticContent: Record<string, { title: string; eyebrow: string; paragraphs: string[]; items?: string[] }> = {
  about: { title: 'Sənətə daha yaxın', eyebrow: 'HAQQIMIZDA', paragraphs: ['Atelye Azərbaycan rəssamlarını və orijinal rəsm əsərlərinə maraq göstərən insanları bir araya gətirən rəqəmsal qalereya layihəsidir.', 'Məqsədimiz hər bir əsərin hekayəsini görünən etmək, yerli yaradıcılığı dəstəkləmək və sənətə çatımı asanlaşdırmaqdır.'], items: ['Yerli rəssamların yaradıcılığı', 'Administrator təsdiqli orijinal əsərlər', 'Şəffaf sifariş sorğusu prosesi'] },
  'how-it-works': { title: 'Sənətə aparan yol', eyebrow: 'ALIŞ VƏ SATIŞ QAYDALARI', paragraphs: ['Alıcı əsəri seçib sifariş sorğusu göndərir. Bu addım dərhal ödəniş deyil.', 'Administrator rəssamla əlaqə saxlayaraq əsərin mövcudluğunu təsdiqləyir və yekun məbləğlə ödəniş qaydasını alıcıya bildirir.', 'Rəssam olmaq üçün hesab yaradın, müraciət göndərin və təsdiqdən sonra əsərlərinizi yerləşdirin.'], items: ['Əsəri kəşf edin', 'Sifariş sorğusunu göndərin', 'Təsdiq və ödəniş qaydasını gözləyin', 'Çatdırılma statusunu kabinetinizdə izləyin'] },
  delivery: { title: 'Çatdırılma', eyebrow: 'SİFARİŞ VƏ ÇATDIRILMA', paragraphs: ['İlkin versiyada fiziki əsərlərin Bakı daxilində sifariş edilməsi nəzərdə tutulur.', 'Çatdırılmanın konkret şərtləri, vaxtı və məbləği sifariş administrator tərəfindən təsdiqləndikdən sonra alıcıya bildirilir.', 'Bu səhifədəki mətn layihə üçün ilkin izahdır. Yekun çatdırılma qaydaları administrator tərəfindən rəsmi məzmun kimi dərc edilməlidir.'] },
  privacy: { title: 'Məxfilik siyasəti', eyebrow: 'HÜQUQİ MƏLUMAT', paragraphs: ['Bu səhifədəki mətn hüquqi siyasət deyil, layihə üçün müvəqqəti şablondur.', 'Sayt istifadəyə verilməzdən əvvəl fərdi məlumatların emalı, saxlanması, istifadəçi hüquqları və əlaqə məlumatları barədə hüquqşünas tərəfindən təsdiqlənmiş məxfilik siyasəti əlavə edilməlidir.'] },
  terms: { title: 'İstifadə şərtləri', eyebrow: 'HÜQUQİ MƏLUMAT', paragraphs: ['Bu səhifə istifadə şərtlərinin müvəqqəti mətnidir və hüquqi sənəd sayılmır.', 'Rəssam, alıcı və platformanın məsuliyyəti, ödəniş, çatdırılma, ləğv, qaytarılma və müəllif hüquqları üzrə yekun qaydalar istifadəyə verilməzdən əvvəl təsdiqlənməlidir.'] }
};
export function ContentPage({ slug }: { slug?: string }) {
  const params = useParams();
  const pageSlug = slug || params.slug || 'about';
  const { data } = useRemote<SitePage>(`/api/v1/pages/${pageSlug}`);
  const fallback = staticContent[pageSlug] || { title: 'Səhifə tapılmadı', eyebrow: 'MƏLUMAT', paragraphs: ['Axtardığınız səhifə hələ dərc edilməyib.'] };
  return <div className="container content-page"><div className="content-header"><span className="eyebrow">{fallback.eyebrow}</span><h1>{data?.title || fallback.title}</h1><div className="title-decoration" /></div><div className="content-columns"><article className="content-article">{data?.content ? <div className="preformatted-content">{data.content}</div> : <>{fallback.paragraphs.map((p, i) => <p key={i}>{p}</p>)}{'items' in fallback && fallback.items && <ul className="content-list">{fallback.items.map(item => <li key={item}><CheckCircle2 size={17} /> {item}</li>)}</ul>}</>}</article><aside className="content-aside"><div className="info-card"><Brush size={29} /><h3>Sənətə öz məkanında yer aç.</h3><p>Orijinal əsərləri kəşf edin və yerli sənətkarları dəstəkləyin.</p><Link to="/artworks" className="btn btn-primary">Əsərlərə bax <ArrowRight size={16} /></Link></div></aside></div></div>;
}
export function ContactPage() {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', message: '' });
  const send = async (event: FormEvent) => { event.preventDefault(); setBusy(true); try { await post('/api/v1/contact', form, false); toast('Müraciətiniz qəbul edildi.'); setForm({ fullName: '', email: '', message: '' }); } catch (e) { toast(e instanceof Error ? e.message : 'Müraciət göndərilmədi.', 'error'); } finally { setBusy(false); } };
  return <div className="container section-padding"><PageHeading eyebrow="BİZƏ YAZIN" title="Əlaqə" desc="Sualınız, təklifiniz və ya köməyə ehtiyacınız var? Bizə yazın." /><div className="contact-grid"><div className="contact-info"><h2>Sizinlə əlaqədə olaq</h2><p>Rəssam və alıcılar üçün hər zaman ünsiyyətə açığıq.</p><div><Mail size={20} /><span>Suallarınız üçün əlaqə formasından istifadə edin.</span></div><div><Clock3 size={20} /><span>Müraciətlər administrator tərəfindən nəzərdən keçirilir.</span></div><div><MapPin size={20} /><span>Bakı, Azərbaycan</span></div><div><Phone size={20} /><span>Əlaqə məlumatları administrator tərəfindən əlavə ediləcək.</span></div></div><form className="panel contact-form" onSubmit={send}><h3>Mesaj göndərin</h3><div className="field"><label>Ad və soyad</label><input required maxLength={150} value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder="Adınız və soyadınız" /></div><div className="field"><label>Email</label><input required type="email" maxLength={256} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" /></div><div className="field"><label>Mesajınız</label><textarea required minLength={10} maxLength={4000} rows={6} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Necə kömək edə bilərik?" /></div><button disabled={busy} className="btn btn-primary btn-large" type="submit">{busy ? 'Göndərilir...' : 'Mesajı göndər'} <ArrowRight size={18} /></button></form></div></div>;
}
export function NotFoundPage() { return <div className="container section-padding not-found"><BookOpen size={44} /><h1>404</h1><h2>Bu səhifə tapılmadı</h2><p>Axtardığınız ünvan mövcud deyil.</p><Link to="/" className="btn btn-primary">Ana səhifəyə qayıt <ArrowRight size={17} /></Link></div>; }
