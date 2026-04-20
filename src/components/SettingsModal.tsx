"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Key, ShieldCheck, ExternalLink, Save } from "lucide-react";
import { useNoteStore } from "@/lib/store";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { openAiKey, setOpenAiKey, groqKey, setGroqKey, aiProvider, setAiProvider } = useNoteStore();
  const [tempOpenAiKey, setTempOpenAiKey] = React.useState(openAiKey || "");
  const [tempGroqKey, setTempGroqKey] = React.useState(groqKey || "");
  const [isSaved, setIsSaved] = React.useState(false);

  const handleSave = () => {
    setOpenAiKey(tempOpenAiKey);
    setGroqKey(tempGroqKey);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="glass w-full max-w-md rounded-[32px] border border-white/10 overflow-hidden"
        >
          <div className="p-6 flex items-center justify-between border-b border-white/5">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              AI Settings
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-muted-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Provider Toggle */}
            <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
              <button 
                onClick={() => setAiProvider('openai')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${aiProvider === 'openai' ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
              >
                OpenAI (Paid)
              </button>
              <button 
                onClick={() => setAiProvider('groq')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${aiProvider === 'groq' ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
              >
                Groq (Free!)
              </button>
            </div>

            <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                {aiProvider === 'openai' ? "OpenAI Integration" : "Groq AI Integration"}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {aiProvider === 'openai' 
                  ? "Standard professional transcription. Requires credit balance." 
                  : "High-performance free transcription via Groq Llama/Whisper API."}
              </p>
            </div>

            {aiProvider === 'openai' ? (
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest pl-1">
                  OpenAI API Key
                </label>
                <input 
                  type="password"
                  value={tempOpenAiKey}
                  onChange={(e) => setTempOpenAiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
                />
                <a href="https://platform.openai.com/api-keys" target="_blank" className="flex items-center gap-1 text-[10px] text-primary hover:underline mt-1">
                  Get OpenAI Key <ExternalLink className="w-2 h-2" />
                </a>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest pl-1">
                  Groq API Key
                </label>
                <input 
                  type="password"
                  value={tempGroqKey}
                  onChange={(e) => setTempGroqKey(e.target.value)}
                  placeholder="gsk-..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
                />
                <a href="https://console.groq.com/keys" target="_blank" className="flex items-center gap-1 text-[10px] text-primary hover:underline mt-1">
                  Get FREE Groq Key <ExternalLink className="w-2 h-2" />
                </a>
              </div>
            )}

            <button 
              onClick={handleSave}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${isSaved ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20'}`}
            >
              {isSaved ? "Saved Successfully!" : (
                <>
                  <Save className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
