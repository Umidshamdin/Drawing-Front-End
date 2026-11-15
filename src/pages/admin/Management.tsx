import { useEffect, useState, type FormEvent } from 'react';
import { Check, Mail, RotateCcw, Save, ShieldBan, Trash2 } from 'lucide-react';
import { AdminHeading, AdminPageState, ConfirmButton } from './AdminShared';
import { Empty, Status } from '../../components/Ui';
import { useRemote } from '../../lib/hooks';
import { dateText, errText } from '../../lib/helpers';
import { del, patch, post, put } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import type { ContactAdmin, FailedEmail, FooterData, ReferenceItem, UserAdmin } from '../../lib/types';

export function AdminSettingsPage() {
  const { data, reload } = useRemote<FooterData>('/api/v1/footer');
  const { toast } = useToast();
  const [form, setForm] = useState({ email: '', phone: '', instagram: '', facebook: '' });
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (data) setForm({ email: data.email || '', phone: data.phone || '', instagram: data.instagram || '', facebook: data.facebook || '' }); }, [data]);
  const save = async (event: FormEvent) => { event.preventDefault(); setBusy(true); try { for (const [key, value] of Object.entries(form)) await put(`/api/v1/admin/settings/footer.${key}`, { value }); toast('Footer məlumatları yeniləndi.'); reload(); } catch (e) { toast(errText(e), 'error'); } finally { setBusy(false); } };
  return <><AdminHeading title="Footer və əlaqə" description="Saytın aşağı hissəsində görünəcək əlaqə məlumatlarını idarə edin." /><div className="admin-panel"><form className="form-stack settings-form" onSubmit={save}><div className="field-hint">Cari məlumatlar: {data?.email || 'Email əlavə edilməyib'} · {data?.phone || 'Telefon əlavə edilməyib'}</div>{([['email','Email'],['phone','Telefon'],['instagram','Instagram URL'],['facebook','Facebook URL']] as const).map(([key, label]) => <div className="field" key={key}><label>{label}</label><input type={key === 'email' ? 'email' : 'text'} placeholder={data?.[key] || ''} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} /></div>)}<button className="btn btn-primary" disabled={busy}><Save size={17} /> Daxil edilənləri saxla</button></form><p className="field-hint">Boş buraxdığınız sahələr backend-də boş dəyərə dəyişdiriləcək. Lazım olan sahələri doldurun.</p></div></>;
}
export function AdminUsersPage() {
  const { data, loading, error, reload } = useRemote<UserAdmin[]>('/api/v1/admin/users');
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const filtered = (data || []).filter(x => `${x.fullName} ${x.email}`.toLowerCase().includes(search.toLowerCase()));
  const block = async (id: string, blocked: boolean) => { try { await patch(`/api/v1/admin/users/${id}/blocked`, { blocked }); toast(blocked ? 'İstifadəçi bloklandı.' : 'Bloklama ləğv edildi.'); reload(); } catch (e) { toast(errText(e), 'error'); } };
  return <><AdminHeading title="İstifadəçilər" description="Qeydiyyatdan keçmiş hesabları izləyin və təhlükəsizlik tədbirlərini idarə edin." /><div className="admin-panel"><div className="admin-filter-bar"><input className="admin-search" placeholder="Ad və email ilə axtar..." value={search} onChange={e => setSearch(e.target.value)} /><span>{filtered.length} hesab</span></div><AdminPageState loading={loading} error={error} onRetry={reload}>{filtered.length ? <div className="table-scroll"><table className="data-table"><thead><tr><th>İstifadəçi</th><th>Email</th><th>Qeydiyyat</th><th>Status</th><th>Əməliyyat</th></tr></thead><tbody>{filtered.map(user => <tr key={user.id}><td><b>{user.fullName}</b></td><td>{user.email}</td><td>{dateText(user.createdAt)}</td><td><Status text={user.isBlocked ? 'Bloklanıb' : 'Aktiv'} variant={user.isBlocked ? 'danger' : 'success'} /></td><td><ConfirmButton danger={!user.isBlocked} onConfirm={() => block(user.id, !user.isBlocked)} message="İstifadəçinin vəziyyətini dəyişmək istəyirsiniz?">{user.isBlocked ? 'Aktiv et' : <><ShieldBan size={15} /> Blokla</>}</ConfirmButton></td></tr>)}</tbody></table></div> : <Empty title="İstifadəçi tapılmadı" />}</AdminPageState></div></>;
}
export function AdminMessagesPage() {
  const { data, loading, error, reload } = useRemote<ContactAdmin[]>('/api/v1/admin/contact-messages');
  const { toast } = useToast();
  const mark = async (id: string) => { try { await patch(`/api/v1/admin/contact-messages/${id}/read`, {}); reload(); toast('Oxunmuş olaraq işarələndi.'); } catch (e) { toast(errText(e), 'error'); } };
  return <><AdminHeading title="Əlaqə müraciətləri" description="Saytın əlaqə formasından göndərilən mesajları oxuyun." /><AdminPageState loading={loading} error={error} onRetry={reload}>{data?.length ? <div className="admin-card-list">{data.map(x => <div className="admin-panel message-card" key={x.id}><div className="section-flex"><div><h3>{x.fullName}</h3><a href={`mailto:${x.email}`}><Mail size={14} /> {x.email}</a></div><Status text={x.isRead ? 'Oxunub' : 'Yeni'} variant={x.isRead ? 'neutral' : 'pending'} /></div><p>{x.message}</p><div className="section-flex"><small>{dateText(x.createdAt)}</small>{!x.isRead && <button className="btn btn-outline btn-mini" onClick={() => mark(x.id)}><Check size={16} /> Oxunmuş et</button>}</div></div>)}</div> : <Empty title="Müraciət yoxdur" />}</AdminPageState></>;
}
export function AdminLookupsPage() {
  const { toast } = useToast();
  const [type, setType] = useState('techniques');
  const { data, loading, error, reload } = useRemote<ReferenceItem[]>(`/api/v1/lookups/${type}`);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const save = async (e: FormEvent) => { e.preventDefault(); try { if (editing) await put(`/api/v1/admin/lookups/${type}/${editing}`, { name }); else await post(`/api/v1/admin/lookups/${type}`, { name }); setName(''); setEditing(null); reload(); toast('Məlumat saxlanıldı.'); } catch (e) { toast(errText(e), 'error'); } };
  const remove = async (id: string) => { try { await del(`/api/v1/admin/lookups/${type}/${id}`); reload(); toast('Siyahıdan silindi.'); } catch (e) { toast(errText(e), 'error'); } };
  return <><AdminHeading title="Əsər məlumatları" description="Texnika, material, mövzu və üslub dropdown siyahılarını idarə edin." /><div className="admin-tabs">{[['techniques','Texnika'],['materials','Material'],['subjects','Mövzu'],['styles','Üslub']].map(([key,label]) => <button key={key} className={type === key ? 'active' : ''} onClick={() => { setType(key); setEditing(null); setName(''); }}>{label}</button>)}</div><div className="admin-two-cols"><div className="admin-panel"><h2>Siyahı</h2><AdminPageState loading={loading} error={error} onRetry={reload}>{data?.length ? <div className="lookup-list">{data.map(x => <div key={x.id}><span>{x.name}</span><div className="table-actions"><button className="btn btn-outline btn-mini" onClick={() => { setEditing(x.id); setName(x.name); }}>Redaktə</button><ConfirmButton danger onConfirm={() => remove(x.id)} message="Bu dəyər əsərlərdə istifadə oluna bilər. Silinsin?" >Sil</ConfirmButton></div></div>)}</div> : <Empty title="Siyahı boşdur" />}</AdminPageState></div><div className="admin-panel"><h2>{editing ? 'Redaktə et' : 'Yeni dəyər'}</h2><form className="form-stack" onSubmit={save}><div className="field"><label>Adı</label><input required maxLength={100} value={name} onChange={e => setName(e.target.value)} /></div><button className="btn btn-primary"><Save size={17} /> Saxla</button>{editing && <button type="button" className="btn btn-outline" onClick={() => { setEditing(null); setName(''); }}>Ləğv et</button>}</form></div></div></>;
}
export function AdminEmailsPage() {
  const { data, loading, error, reload } = useRemote<FailedEmail[]>('/api/v1/admin/email-queue/failed');
  const { toast } = useToast();
  const retry = async (id: string) => { try { await post(`/api/v1/admin/email-queue/${id}/retry`); reload(); toast('Email yenidən göndərmə növbəsinə alındı.'); } catch (e) { toast(errText(e), 'error'); } };
  return <><AdminHeading title="Email növbəsi" description="Göndərilməsi mümkün olmayan məktubları yoxlayın və təkrar göndərin." /><AdminPageState loading={loading} error={error} onRetry={reload}><div className="admin-panel table-scroll">{data?.length ? <table className="data-table"><thead><tr><th>Alıcı</th><th>Mövzu</th><th>Cəhd</th><th>Xəta</th><th>Əməliyyat</th></tr></thead><tbody>{data.map(x => <tr key={x.id}><td>{x.toEmail}</td><td>{x.subject}</td><td>{x.attempts}</td><td>{x.lastError || '—'}</td><td><button onClick={() => retry(x.id)} className="btn btn-outline btn-mini"><RotateCcw size={16} /> Təkrar göndər</button></td></tr>)}</tbody></table> : <Empty title="Uğursuz email yoxdur" />}</div></AdminPageState></>;
}
