import React, { useRef, useState, useCallback } from 'react';
import { Upload, X, Loader2, CheckCircle2, ImageIcon } from 'lucide-react';
import { uploadToImageKit } from '../../lib/imagekit';

const inputBase = `w-full px-5 py-4 rounded-xl border-2 border-slate-200 dark:border-[#1e293b]
  bg-white dark:bg-[#131d31] text-slate-900 dark:text-white font-medium text-sm
  focus:ring-2 focus:ring-blue-500/10 focus:border-[#0f639e] outline-none
  transition-all duration-200`;

const labelStyle = `block text-[10px] font-black text-slate-400 dark:text-slate-500
  uppercase tracking-[0.15em] px-1`;

export const InputField = ({ label, value, onChange, textAlign = 'left', type = 'text', placeholder }: {
  label: string; value: string; onChange: (v: string) => void; textAlign?: string; type?: string; placeholder?: string;
}) => (
  <div className="space-y-1.5">
    <label className={labelStyle}>{label}</label>
    {type === 'textarea' ? (
      <textarea value={value} onChange={e => onChange(e.target.value)}
        className={`${inputBase} min-h-[120px] resize-y ${textAlign === 'right' ? 'text-right' : 'text-left'}`} />
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className={`${inputBase} ${textAlign === 'right' ? 'text-right' : 'text-left'}`} />
    )}
  </div>
);

export const FieldGroup = ({ label, valueEn, valueAr, onUpdateEn, onUpdateAr, isTextArea = false, textAreaHeight = "h-40", isRTL: _isRTL }: {
  label: string; valueEn: string; valueAr: string; onUpdateEn: (v: string) => void; onUpdateAr: (v: string) => void; isTextArea?: boolean; textAreaHeight?: string; isRTL?: boolean;
}) => {
  const C = isTextArea ? 'textarea' : 'input';
  const cls = `${inputBase} ${isTextArea ? `${textAreaHeight} resize-y` : 'min-h-[60px]'}`;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <div className="w-1 h-5 bg-[#0f639e] rounded-full shrink-0" />
        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">{label}</label>
      </div>
      <div className="space-y-3">
        <div className="space-y-1">
          <span className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">EN</span>
          <C value={valueEn} onChange={(e: any) => onUpdateEn(e.target.value)} className={`${cls} text-left`} />
        </div>
        <div className="space-y-1">
          <span className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1 text-right">AR</span>
          <C value={valueAr} onChange={(e: any) => onUpdateAr(e.target.value)} className={`${cls} text-right`} />
        </div>
      </div>
    </div>
  );
};

export const CloudImageUploader = ({ label, value, onChange }: {
  label: string; value: string; onChange: (url: string) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) { setUploadError('Please select an image file'); return; }
    if (file.size > 10 * 1024 * 1024) { setUploadError('Image must be under 10MB'); return; }
    try {
      setIsUploading(true); setUploadProgress(10); setUploadError('');
      const result = await uploadToImageKit(file);
      setUploadProgress(100); onChange(result);
    } catch (error: any) { setUploadError(error.message || 'Upload failed');
    } finally { setIsUploading(false); setUploadProgress(0); }
  }, [onChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (file) handleUpload(file);
    if (e.target) e.target.value = '';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <div className="w-1 h-5 bg-[#0f639e] rounded-full shrink-0" />
        <label className={labelStyle}>{label}</label>
      </div>
      <div className="space-y-3">
        <div className="flex gap-2">
          <input type="text" value={value} onChange={e => onChange(e.target.value)}
            className={`${inputBase} font-mono text-xs flex-grow`} placeholder="https://ik.imagekit.io/..." />
          <button onClick={() => fileInputRef.current?.click()} disabled={isUploading}
            className="px-6 py-4 bg-slate-100 dark:bg-[#1a2744] text-[#0f639e] dark:text-[#3292ca] rounded-xl hover:bg-[#0f639e] hover:text-white dark:hover:bg-[#0f639e] dark:hover:text-white transition-all shadow-sm disabled:opacity-50 shrink-0">
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
        </div>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full h-2 bg-slate-100 dark:bg-[#1a2744] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#0f639e] to-[#3292ca] rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
          </div>
        )}

        {uploadError && (
          <div className="px-4 py-3 bg-rose-50 dark:bg-rose-500/10 border-2 border-rose-200 dark:border-rose-500/20 rounded-xl">
            <p className="text-rose-600 dark:text-rose-400 text-xs font-bold">{uploadError}</p>
          </div>
        )}

        <div
          onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleUpload(f); }}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            dragOver
              ? 'border-[#0f639e] bg-[#0f639e]/5 dark:bg-[#0f639e]/10 shadow-inner'
              : 'border-slate-200 dark:border-[#1e293b] hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-[#131d31]'
          }`}
        >
          {value ? (
            <div className="relative inline-block">
              <img src={value} alt="Preview"
                className="h-48 w-auto max-w-full rounded-xl border-2 border-white dark:border-[#1e293b] shadow-lg object-contain mx-auto" loading="lazy" />
              <button onClick={() => onChange('')}
                className="absolute -top-3 -right-3 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600 shadow-lg transition-all hover:scale-110">
                <X className="w-4 h-4" />
              </button>
              <div className="mt-3 flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" /> Uploaded to ImageKit CDN
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-14 h-14 bg-slate-100 dark:bg-[#1a2744] rounded-xl flex items-center justify-center">
                <ImageIcon className="w-7 h-7 text-slate-400 dark:text-slate-500" />
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">Drop image here or click to upload</p>
                <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">PNG, JPG, WebP up to 10MB</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const sectionHeaderAccent = `text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]`;

export const SectionHeader = ({ icon: Icon, title, subtitle, isRTL }: { icon: any; title: string; subtitle: string; isRTL: boolean }) => (
  <div className="flex items-center gap-5 pb-8 border-b border-slate-100 dark:border-[#1e293b]">
    <div className="w-14 h-14 bg-gradient-to-br from-[#f1f5f0] to-[#e2e8f0] dark:from-[#1a2744] dark:to-[#131d31] text-[#0f639e] dark:text-[#3292ca] rounded-2xl flex items-center justify-center shadow-inner shrink-0">
      <Icon className="w-7 h-7" />
    </div>
    <div className={isRTL ? 'text-right' : 'text-left'}>
      <h3 className="text-2xl font-black text-[#0f639e] dark:text-white tracking-tight leading-none mb-1">{title}</h3>
      <p className={sectionHeaderAccent}>{subtitle}</p>
    </div>
  </div>
);

export const ToggleField = ({ label, checked, onChange, description }: {
  label: string; checked: boolean; onChange: (v: boolean) => void; description?: string;
}) => (
  <label className="flex items-center justify-between gap-4 px-5 py-4 rounded-xl border-2 border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#131d31] cursor-pointer hover:border-[#0f639e]/40 transition-all duration-200">
    <div className="min-w-0 flex-1">
      <span className="block text-sm font-bold text-slate-900 dark:text-white">{label}</span>
      {description && <span className="block text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">{description}</span>}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={(e) => { e.preventDefault(); onChange(!checked); }}
      className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${
        checked ? 'bg-[#0f639e]' : 'bg-slate-200 dark:bg-[#1e293b]'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </label>
);

export const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, isRTL }: {
  isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string; isRTL: boolean;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />
      <div className={`relative bg-white dark:bg-[#131d31] w-full max-w-md rounded-[2rem] p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border border-slate-100 dark:border-[#1e293b] ${isRTL ? 'font-tajawal' : 'font-inter'}`}>
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mb-6">
            <span className="text-3xl font-black">!</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">{title}</h3>
          <p className="text-slate-400 dark:text-slate-500 font-bold text-sm leading-relaxed mb-8">{message}</p>
          <div className="flex w-full gap-3">
            <button onClick={onConfirm} className="flex-grow py-4 bg-rose-500 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 active:scale-95">
              {isRTL ? 'تأكيد الحذف' : 'Confirm Delete'}
            </button>
            <button onClick={onClose} className="flex-grow py-4 bg-slate-100 dark:bg-[#1a2744] text-slate-400 dark:text-slate-500 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-[#1e293b] transition-all active:scale-95">
              {isRTL ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
