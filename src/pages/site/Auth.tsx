import { useState, type FormEvent, type ReactNode } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Palette, ShieldCheck, UserRound } from 'lucide-react';
import { post } from '../../lib/api';
import { errText } from '../../lib/helpers';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) { return <div className="auth-page"><div className="auth-visual"><img src="/artworks/art-hero.svg" alt="Atelye rəng palitrası" /><div><span className="eyebrow">ATELYE GALLERY</span><h2>Hekayəsi olan əsərlər. İlham verən məkanlar.</h2><p>Sənət səni gözləyir.</p></div></div><div className="auth-content"><div className="auth-card"><div className="eyebrow">XOŞ GƏLMİSİNİZ</div><h1>{title}</h1><p>{subtitle}</p>{children}</div></div></div>; }
export function LoginPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const submit = async (e: FormEvent) => { e.preventDefault(); try { await login(form.email, form.password); toast('Xoş gəlmisiniz!'); const destination = params.get('return') || '/account'; navigate(destination.startsWith('/') && !destination.startsWith('//') ? destination : '/account'); } catch (error) { toast(errText(error), 'error'); } };
  return <AuthShell title="Hesabınıza daxil olun" subtitle="Sənət dolu dünyanıza qayıdın."><form onSubmit={submit} className="auth-form"><div className="field"><label>Email ünvanı</label><div className="input-icon"><Mail size={18} /><input required type="email" autoComplete="email" placeholder="email@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div></div><div className="field"><div className="field-label-row"><label>Şifrə</label><Link to="/forgot-password">Şifrəni unutmusunuz?</Link></div><div className="input-icon"><LockKeyhole size={18} /><input required type={show ? 'text' : 'password'} autoComplete="current-password" placeholder="Şifrənizi daxil edin" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /><button type="button" onClick={() => setShow(!show)} className="password-toggle">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div><button className="btn btn-primary btn-large auth-submit" disabled={loading}>{loading ? 'Yoxlanılır...' : 'Daxil ol'} <ArrowRight size={18} /></button></form><div className="auth-bottom">Hesabınız yoxdur? <Link to="/register">Qeydiyyatdan keçin</Link></div></AuthShell>;
}
export function RegisterPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', phoneNumber: '', password: '', confirm: '' });
  const submit = async (event: FormEvent) => { event.preventDefault(); if (form.password !== form.confirm) { toast('Şifrələr eyni deyil.', 'error'); return; } setLoading(true); try { await post('/api/v1/auth/register', { fullName: form.fullName, email: form.email, phoneNumber: form.phoneNumber || null, password: form.password }, false); setDone(true); toast('Qeydiyyat sorğusu qəbul edildi.'); } catch (e) { toast(errText(e), 'error'); } finally { setLoading(false); } };
  return <AuthShell title="Sənət dünyasına qoşulun" subtitle="Bir hesabla həm əsər ala, həm də rəssam kimi müraciət edə bilərsiniz.">{done ? <div className="success-block"><ShieldCheck size={38} /><h3>Email təsdiqi gözlənilir</h3><p>Emailinizə göndərilən keçidlə hesabınızı təsdiqləyin. Sonra daxil ola bilərsiniz.</p><Link className="btn btn-primary" to="/login">Giriş səhifəsi <ArrowRight size={17} /></Link></div> : <form onSubmit={submit} className="auth-form"><div className="field"><label>Ad və soyad</label><input required minLength={2} maxLength={200} value={form.fullName} placeholder="Adınız Soyadınız" onChange={e => setForm({ ...form, fullName: e.target.value })} /></div><div className="field"><label>Email</label><input required type="email" value={form.email} placeholder="email@example.com" onChange={e => setForm({ ...form, email: e.target.value })} /></div><div className="field"><label>Telefon nömrəsi</label><input value={form.phoneNumber} placeholder="+994 50 123 45 67" onChange={e => setForm({ ...form, phoneNumber: e.target.value })} /></div><div className="field"><label>Şifrə</label><input required type="password" minLength={8} value={form.password} placeholder="Böyük, kiçik hərf, rəqəm və simvol" onChange={e => setForm({ ...form, password: e.target.value })} /></div><div className="field"><label>Şifrə təkrarı</label><input required type="password" minLength={8} value={form.confirm} placeholder="Şifrəni təkrar edin" onChange={e => setForm({ ...form, confirm: e.target.value })} /></div><button disabled={loading} type="submit" className="btn btn-primary btn-large auth-submit">{loading ? 'Göndərilir...' : 'Hesab yarat'} <ArrowRight size={18} /></button><p className="field-hint">Qeydiyyatdan keçməklə <Link to="/terms">istifadə şərtlərini</Link> qəbul edirsiniz.</p></form>}<div className="auth-bottom">Artıq hesabınız var? <Link to="/login">Daxil olun</Link></div></AuthShell>;
}
export function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent) => { event.preventDefault(); setBusy(true); try { await post('/api/v1/auth/forgot-password', { email }, false); setDone(true); } catch (e) { toast(errText(e), 'error'); } finally { setBusy(false); } };
  return <AuthShell title="Şifrəni bərpa edin" subtitle="Email ünvanınızı daxil edin, sizə şifrə bərpası keçidi göndərək.">{done ? <div className="success-block"><Mail size={36} /><h3>Poçtunuzu yoxlayın</h3><p>Uyğun hesab mövcuddursa, bərpa məktubu göndəriləcək.</p></div> : <form className="auth-form" onSubmit={submit}><div className="field"><label>Email ünvanı</label><input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></div><button disabled={busy} className="btn btn-primary btn-large auth-submit">Bərpa keçidini göndər <ArrowRight size={18} /></button></form>}<div className="auth-bottom"><Link to="/login">Giriş səhifəsinə qayıt</Link></div></AuthShell>;
}
export function TokenActionPage({ mode }: { mode: 'verify' | 'reset' }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const userId = params.get('userId') || '';
  const token = params.get('token') || '';
  const submit = async (event: FormEvent) => { event.preventDefault(); if (!userId || !token) { toast('Keçid məlumatları düzgün deyil.', 'error'); return; } setBusy(true); try { if (mode === 'verify') await post('/api/v1/auth/confirm-email', { userId, token }, false); else await post('/api/v1/auth/reset-password', { userId, token, newPassword: password }, false); setDone(true); toast(mode === 'verify' ? 'Email təsdiqləndi.' : 'Şifrə dəyişdirildi.'); setTimeout(() => navigate('/login'), 1200); } catch (e) { toast(errText(e), 'error'); } finally { setBusy(false); } };
  return <AuthShell title={mode === 'verify' ? 'Email təsdiqi' : 'Yeni şifrə'} subtitle={mode === 'verify' ? 'Hesabınızı aktivləşdirmək üçün təsdiq edin.' : 'Yeni təhlükəsiz şifrə təyin edin.'}>{done ? <div className="success-block"><ShieldCheck size={38} /><h3>Uğurla tamamlandı</h3><p>Giriş səhifəsinə yönləndirilirsiniz.</p></div> : <form className="auth-form" onSubmit={submit}>{mode === 'reset' && <div className="field"><label>Yeni şifrə</label><input required type="password" minLength={8} value={password} onChange={e => setPassword(e.target.value)} placeholder="Böyük, kiçik hərf, rəqəm və simvol" /></div>}<button disabled={busy || !token || !userId} className="btn btn-primary btn-large auth-submit">{mode === 'verify' ? 'Emailimi təsdiqlə' : 'Şifrəni dəyiş'} <ArrowRight size={18} /></button></form>}</AuthShell>;
}
