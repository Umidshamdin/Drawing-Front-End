import { Link } from 'react-router';
import { ArrowRight, Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import { ErrorState, Loader } from '../../components/Ui';

export function AdminHeading({ title, description, action, actionText, onAction }: { title: string; description?: string; action?: string; actionText?: string; onAction?: () => void }) { return <div className="admin-page-head"><div><span className="eyebrow">ATELYE İDARƏETMƏ</span><h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <Link className="btn btn-primary" to={action}><Plus size={18} /> {actionText || 'Yeni əlavə et'}</Link>}{onAction && <button className="btn btn-primary" onClick={onAction}><Plus size={18} /> {actionText || 'Yeni əlavə et'}</button>}</div>; }
export function AdminPageState({ loading, error, onRetry, children }: { loading: boolean; error: string; onRetry?: () => void; children: ReactNode }) { return loading ? <Loader /> : error ? <ErrorState message={error} retry={onRetry} /> : <>{children}</>; }
export function AdminPanel({ children, title, action, link }: { children: ReactNode; title?: string; action?: string; link?: string }) { return <section className="admin-panel"><div className="admin-panel-heading">{title && <h2>{title}</h2>}{action && link && <Link to={link}>{action} <ArrowRight size={16} /></Link>}</div>{children}</section>; }
export function ConfirmButton({ onConfirm, children, message = 'Bu əməliyyatı təsdiqləyirsiniz?', danger = false }: { onConfirm: () => void | Promise<void>; children: ReactNode; message?: string; danger?: boolean }) { return <button type="button" className={`btn btn-mini ${danger ? 'btn-danger-light' : 'btn-outline'}`} onClick={() => { if (window.confirm(message)) void onConfirm(); }}>{children}</button>; }
