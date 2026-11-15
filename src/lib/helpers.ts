import type { ArtworkCard } from './types';

export const siteName = import.meta.env.VITE_SITE_NAME || 'Atelye';
export const apiBase = (import.meta.env.VITE_API_URL || 'https://localhost:7138').replace(/\/$/, '');
export const demoMode = import.meta.env.VITE_DEMO_MODE === 'true';
export const money = (value: number) => new Intl.NumberFormat('az-AZ', { style: 'currency', currency: 'AZN', maximumFractionDigits: 0 }).format(value || 0);
export const dateText = (date?: string | null) => date ? new Intl.DateTimeFormat('az-AZ', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(date)) : '—';
export const fileUrl = (value?: string | null) => !value ? '' : value.startsWith('/artworks/') || /^https?:\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:') ? value : `${apiBase}${value.startsWith('/') ? '' : '/'}${value}`;
export const errText = (error: unknown) => error instanceof Error ? error.message : 'Gözlənilməyən xəta baş verdi.';
export const guid = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
export const isAvailable = (x: ArtworkCard | { saleStatus: string }) => x.saleStatus === 'Available' || x.saleStatus === '1';
export const saleLabel = (status?: string) => ({ Available: 'Satışda', Reserved: 'Rezerv edilib', Sold: 'Satılıb', '1': 'Satışda', '2': 'Rezerv edilib', '3': 'Satılıb' }[status || ''] || status || '—');
export const moderationLabel = (status?: string | number) => ({ '1': 'Qaralama', '2': 'Təsdiq gözləyir', '3': 'Təsdiqlənib', '4': 'Rədd edilib', '5': 'Düzəliş tələb olunur', '6': 'Gizlədilib', Draft: 'Qaralama', PendingReview: 'Təsdiq gözləyir', Approved: 'Təsdiqlənib', Rejected: 'Rədd edilib', ChangesRequested: 'Düzəliş tələb olunur', Hidden: 'Gizlədilib' }[String(status)] || String(status || '—'));
export const artistStatus = (status?: string | number) => ({ '1': 'Təsdiq gözləyir', '2': 'Təsdiqlənib', '3': 'Rədd edilib', '4': 'Dayandırılıb', Pending: 'Təsdiq gözləyir', Approved: 'Təsdiqlənib', Rejected: 'Rədd edilib', Suspended: 'Dayandırılıb' }[String(status)] || String(status || '—'));
export const orderLabel = (status: string) => ({ Pending: 'Gözləyir', Confirmed: 'Təsdiqlənib', AwaitingPayment: 'Ödəniş gözləyir', Paid: 'Ödənilib', PreparingDelivery: 'Hazırlanır', Shipped: 'Göndərilib', Completed: 'Tamamlanıb', Cancelled: 'Ləğv edilib', Rejected: 'Rədd edilib' }[status] || status);
export const qs = (values: Record<string, string | number | boolean | null | undefined>) => { const p = new URLSearchParams(); Object.entries(values).forEach(([key, value]) => { if (value !== undefined && value !== null && value !== '') p.set(key, String(value)); }); return p.toString(); };
