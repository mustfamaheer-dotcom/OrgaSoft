import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Sparkles, ChevronRight, Bot, User, RefreshCw } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { processMessage, createSession } from '../lib/chatEngine';
import type { ChatResponse, SessionState, Suggestion } from '../lib/chatEngine';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  suggestions?: Suggestion[];
  quickReplies?: { label: string; labelAr: string; value: string }[];
  typing?: boolean;
}

const ChatBot: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  const { siteData, lang, isRTL } = useSite();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const sessionRef = useRef<SessionState>(createSession());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const settings = siteData?.chatbot;
  const botName = settings?.name?.[lang] || (lang === 'ar' ? 'أورجا بوت' : 'OrgaBot');

  const greetingText = settings?.greeting?.[lang] || (lang === 'ar'
    ? 'مرحباً! 👋 أنا **أورجا بوت** المساعد الذكي\nيمكنني مساعدتك في:\n• اختيار البرنامج المناسب لنشاطك التجاري\n• معلومات عن خدماتنا ومنتجاتنا\n• فروعنا وعناويننا\n• أرقام التواصل\n• معلومات عامة عن الشركة\n\nاكتب استفسارك وسأجيبك فوراً!'
    : "Hi! 👋 I'm **OrgaBot** your smart assistant\nI can help you with:\n• Choosing the right software for your business\n• Information about our services & products\n• Our branches and locations\n• Contact information\n• General company info\n\nJust ask away!");

  const defaultQuickReplies: Message['quickReplies'] = [
    { label: 'I need a system', labelAr: 'أريد نظاماً', value: 'I need a management system for my business' },
    { label: 'Our Services', labelAr: 'خدماتنا', value: 'What IT services do you offer?' },
    { label: 'Contact', labelAr: 'اتصال', value: 'What is your phone number?' },
    { label: 'Locations', labelAr: 'فروعنا', value: 'Where are your branches?' },
  ];

  const quickReplies: Message['quickReplies'] = settings?.quickReplies && settings.quickReplies.length > 0
    ? settings.quickReplies.map(qr => ({
        label: qr.label?.en || '',
        labelAr: qr.label?.ar || '',
        value: lang === 'ar' ? qr.value?.ar || qr.value?.en || '' : qr.value?.en || qr.value?.ar || '',
      }))
    : defaultQuickReplies;

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      if (messages.length === 0) {
        const greeting: Message = {
          id: 'greeting',
          text: greetingText,
          sender: 'bot',
          quickReplies,
        };
        setMessages([greeting]);
      }
    }
  }, [open, lang, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const typeText = useCallback(async (fullText: string, msgId: string) => {
    const words = fullText.split(' ');
    let displayed = '';
    for (let i = 0; i < words.length; i++) {
      displayed += (i > 0 ? ' ' : '') + words[i];
      setMessages(prev => prev.map(m =>
        m.id === msgId ? { ...m, text: displayed + (i < words.length - 1 ? ' ▊' : ''), typing: i < words.length - 1 } : m
      ));
      await new Promise(r => setTimeout(r, 30 + Math.random() * 20));
    }
    setMessages(prev => prev.map(m =>
      m.id === msgId ? { ...m, typing: false } : m
    ));
  }, []);

  const addBotResponse = useCallback(async (response: ChatResponse) => {
    const text = lang === 'ar' ? response.textAr : response.text;
    const msgId = `bot-${Date.now()}`;
    const msg: Message = {
      id: msgId,
      text: '',
      sender: 'bot',
      suggestions: response.suggestions,
      quickReplies: response.quickReplies,
      typing: true,
    };
    setMessages(prev => [...prev, msg]);
    await new Promise(r => setTimeout(r, 400 + Math.random() * 300));
    await typeText(text, msgId);
  }, [lang, typeText]);

  const handleSend = useCallback(async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput('');
    const userMsg: Message = { id: `user-${Date.now()}`, text: msg, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 300 + Math.random() * 400));
    const websiteData = {
      products: siteData?.products || [],
      services: siteData?.services || { items: [] },
      orgaProServices: siteData?.orgaProServices || { items: [] },
      partners: siteData?.partners || [],
      contacts: {
        address: siteData?.contacts?.address || { en: '', ar: '' },
        phoneSupport: siteData?.contacts?.phoneSupport || '',
        phoneAdmin: siteData?.contacts?.phoneAdmin || '',
        email: siteData?.contacts?.email || '',
        whatsapp: siteData?.contacts?.whatsapp || '',
        branches: siteData?.contacts?.branches || [],
      },
      about: {
        title: siteData?.about?.title || { en: '', ar: '' },
        content: siteData?.about?.content || { en: '', ar: '' },
      },
      companyName: siteData?.companyName || { en: '', ar: '' },
      hero: {
        stats: siteData?.hero?.stats || [],
      },
    };
    const response = processMessage(msg, websiteData, sessionRef.current, lang);
    setIsTyping(false);
    await addBotResponse(response);
  }, [input, siteData, lang, addBotResponse]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReply = (value: string) => {
    handleSend(value);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (!onNavigate) return;
    if (suggestion.type === 'product') {
      onNavigate(`product-${suggestion.id}`);
    } else if (suggestion.type === 'service') {
      onNavigate('services');
    } else if (suggestion.type === 'orga-service') {
      onNavigate('services');
    } else if (suggestion.type === 'branch') {
      onNavigate('contact');
    }
    setOpen(false);
  };

  const handleReset = () => {
    sessionRef.current = createSession();
    setMessages([]);
    setInput('');
  };

  if (settings?.enabled === false) return null;

  const positionClass = settings?.position === 'right'
    ? 'right-4 xs:right-6 sm:right-10'
    : 'left-4 xs:left-6 sm:left-10';

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[150] md:bg-transparent md:backdrop-blur-none md:pointer-events-none"
          onClick={() => setOpen(false)} />
      )}
      <div className={`fixed bottom-4 ${positionClass} xs:bottom-6 sm:bottom-10 z-[200] flex flex-col ${settings?.position === 'right' ? 'items-end' : 'items-start'}`}
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        {open && (
          <div className="mb-3 w-[360px] sm:w-[400px] bg-white dark:bg-[#131d31] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#1e293b] overflow-hidden animate-fadeInUp"
            onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-[#0f639e] to-[#3292ca] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-black text-sm leading-none">{botName}</h3>
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  </div>
                  <p className="text-white/60 text-[9px] font-bold uppercase tracking-[0.2em] mt-0.5">SMART ASSISTANT</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={handleReset}
                  className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-all group" title={lang === 'ar' ? 'محادثة جديدة' : 'New conversation'}>
                  <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                </button>
                <button onClick={() => setOpen(false)}
                  className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="h-[380px] overflow-y-auto p-4 space-y-3 custom-scrollbar bg-[#f8fafc] dark:bg-[#0b1121]/60">
              {messages.map(msg => (
                <div key={msg.id}
                  className={`flex items-end gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} message-enter`}>
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    msg.sender === 'user'
                      ? 'bg-[#0f639e] text-white'
                      : 'bg-gradient-to-br from-[#0f639e] to-[#3292ca] text-white'
                  }`}>
                    {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>
                  <div className={`max-w-[80%] space-y-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`rounded-2xl px-4 py-2.5 ${
                      msg.sender === 'user'
                        ? 'bg-[#0f639e] text-white rounded-tr-md shadow-md'
                        : 'bg-white dark:bg-[#131d31] text-slate-800 dark:text-slate-200 rounded-tl-md shadow-sm border border-slate-100 dark:border-[#1e293b]'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-line">
                        {msg.text}
                        {msg.typing && <span className="inline-block w-1.5 h-4 bg-[#0f639e] dark:bg-[#3292ca] ml-0.5 animate-pulse" style={{ animationDuration: '0.6s' }} />}
                      </p>
                    </div>

                    {msg.suggestions && msg.suggestions.length > 0 && !msg.typing && (
                      <div className="space-y-1.5 pt-1">
                        {msg.suggestions.map(s => (
                          <button key={s.id} onClick={() => handleSuggestionClick(s)}
                            className="w-full flex items-center gap-3 p-3 bg-white dark:bg-[#131d31] rounded-xl border border-slate-100 dark:border-[#1e293b] hover:border-[#0f639e]/40 hover:shadow-md transition-all group active:scale-[0.98]">
                            {s.image ? (
                              <img src={s.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-[#0f639e] to-[#3292ca] rounded-lg flex items-center justify-center shrink-0">
                                <Sparkles className="w-5 h-5 text-white" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0 text-left" style={{ direction: 'ltr' }}>
                              <p className="text-xs font-black text-[#0f639e] dark:text-white truncate group-hover:text-[#df4d21] transition-colors">
                                {lang === 'ar' ? s.name.ar : s.name.en}
                              </p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                {lang === 'ar' ? 'اضغط لعرض التفاصيل ←' : 'CLICK TO VIEW →'}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0f639e] shrink-0" />
                          </button>
                        ))}
                      </div>
                    )}

                    {msg.quickReplies && msg.quickReplies.length > 0 && !msg.typing && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.quickReplies.map((qr, i) => (
                          <button key={i} onClick={() => handleQuickReply(qr.value)}
                            className="px-3.5 py-2 bg-white dark:bg-[#131d31] border border-[#0f639e]/20 dark:border-[#3292ca]/30 rounded-xl text-[11px] font-bold text-[#0f639e] dark:text-[#3292ca] hover:bg-[#0f639e] hover:text-white dark:hover:bg-[#0f639e] dark:hover:text-white hover:border-[#0f639e] transition-all active:scale-95 shadow-sm whitespace-nowrap">
                            {lang === 'ar' ? qr.labelAr : qr.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-end gap-2 message-enter">
                  <div className="w-7 h-7 bg-gradient-to-br from-[#0f639e] to-[#3292ca] text-white rounded-xl flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-white dark:bg-[#131d31] rounded-2xl rounded-tl-md px-5 py-3.5 shadow-sm border border-slate-100 dark:border-[#1e293b]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-[#0f639e] dark:bg-[#3292ca] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-[#0f639e] dark:bg-[#3292ca] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-[#0f639e] dark:bg-[#3292ca] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-[#1e293b] bg-white dark:bg-[#131d31]">
              <div className="flex items-center gap-2">
                <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                  placeholder={lang === 'ar' ? 'اكتب رسالتك هنا...' : 'Type your message here...'}
                  className="flex-1 px-4 py-3 bg-slate-50 dark:bg-[#1a2744] rounded-xl border-2 border-slate-200 dark:border-[#1e293b] text-slate-900 dark:text-white text-sm font-medium outline-none focus:border-[#0f639e] dark:focus:border-[#3292ca] transition-all placeholder:text-slate-400" />
                <button onClick={() => handleSend()} disabled={!input.trim() || isTyping}
                  className="w-11 h-11 bg-gradient-to-r from-[#0f639e] to-[#3292ca] text-white rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-[#0f639e]/20 transition-all disabled:opacity-40 shrink-0 active:scale-90">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
        <button onClick={() => setOpen(!open)}
          className="w-14 h-14 bg-gradient-to-br from-[#0f639e] to-[#3292ca] text-white rounded-2xl shadow-2xl flex items-center justify-center hover:shadow-[#0f639e]/30 hover:scale-110 active:scale-90 transition-all duration-300 relative border border-white/10 group">
          {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />}
          {!open && (
            <>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-[#131d31] animate-ping opacity-75" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-[#131d31]" />
            </>
          )}
        </button>
      </div>
      <style>{`
        .message-enter { animation: msgIn 0.3s ease-out; }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(10px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
};

export default ChatBot;
