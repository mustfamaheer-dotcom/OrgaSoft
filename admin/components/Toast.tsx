import React from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[300] flex flex-col gap-3 max-w-sm">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-sm animate-in slide-in-from-right-2 fade-in duration-200 ${
            toast.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20'
              : 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          )}
          <p className={`text-sm font-semibold flex-grow ${
            toast.type === 'success' ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
          }`}>
            {toast.message}
          </p>
          <button onClick={() => onDismiss(toast.id)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
