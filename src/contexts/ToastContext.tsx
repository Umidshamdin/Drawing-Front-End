import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

type ToastItem = { id: number; text: string; kind: 'success' | 'error' | 'info' };
type ToastContextValue = { toast: (text: string, kind?: ToastItem['kind']) => void };
const Context = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const toast = useCallback((text: string, kind: ToastItem['kind'] = 'success') => {
    const id = Date.now() + Math.random();
    setItems(previous => [...previous, { id, text, kind }].slice(-4));
    setTimeout(() => setItems(previous => previous.filter(x => x.id !== id)), 4700);
  }, []);
  return <Context.Provider value={{ toast }}>
    {children}
    <div className="toast-stack" aria-live="polite">{items.map(item => <div className={`toast toast-${item.kind}`} key={item.id}>{item.kind === 'error' ? <AlertCircle size={19} /> : <CheckCircle2 size={19} />}<span>{item.text}</span><button className="icon-button" aria-label="Bildirişi bağla" onClick={() => setItems(old => old.filter(x => x.id !== item.id))}><X size={16} /></button></div>)}</div>
  </Context.Provider>;
}
export function useToast() { const context = useContext(Context); if (!context) throw new Error('ToastProvider mövcud deyil'); return context; }
