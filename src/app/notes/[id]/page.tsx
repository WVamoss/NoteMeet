"use client";

import React from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  Sparkles, 
  Clock, 
  Users, 
  Share2, 
  Download,
  BrainCircuit,
  MessageSquareText
} from "lucide-react";
import Link from "next/link";
import { NoteEditor } from "@/components/NoteEditor";

import { useNoteStore } from "@/lib/store";

const MOCK_NOTE = {
  title: "Project Alpha Kickoff Meeting",
  date: "April 20, 2026",
  duration: "45m 12s",
  participants: ["Jordy G.", "Sarah M.", "Alex K."],
  summary: "The meeting focused on the initial phase of Project Alpha. Sarah outlined the timeline, while Alex raised concerns about the database scaling. We agreed to use PostgreSQL with Prisma and a microservices architecture. Next steps include setting up the staging environment by Friday.",
  transcript: [
    { speaker: "Jordy G.", time: "00:05", text: "Welcome everyone to the Project Alpha kickoff. Ready to dive in?" },
    { speaker: "Sarah M.", time: "00:12", text: "Absolutely. I've prepared the initial timeline. We're looking at a 12-week development cycle." },
    { speaker: "Alex K.", time: "00:45", text: "Wait, the 12-week cycle seems tight given the complexity of the data synchronization layer." },
    { speaker: "Sarah M.", time: "01:20", text: "I understand, but we can prioritize the core modules first." }
  ],
  keyTakeaways: [
    "Timeline set to 12 weeks.",
    "Tech stack: PostgreSQL, Prisma, Microservices."
  ]
};

export default function NoteDetailPage() {
  const params = useParams();
  const currentNote = useNoteStore(state => state.currentNote);
  const [activeTab, setActiveTab] = React.useState<"summary" | "transcript">("summary");
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use real data if available, otherwise mock
  const noteData = (params.id === "latest" && currentNote) ? currentNote : MOCK_NOTE;

  if (!isMounted) return <div className="min-h-screen bg-[#09090b]" />;

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-3">
          {noteData.audioUrl && (
            <a 
              href={noteData.audioUrl} 
              download="meeting-recording.webm"
              className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 text-primary border border-primary/20 rounded-lg text-xs font-bold hover:bg-primary/30 transition-all shadow-lg shadow-primary/10"
            >
              <Download className="w-3 h-3" />
              Download Recording
            </a>
          )}
          <button className="flex items-center gap-2 px-3 py-1.5 glass rounded-lg text-xs font-medium text-muted-foreground hover:text-white transition-all">
            <Share2 className="w-3 h-3" />
            Share
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 glass rounded-lg text-xs font-medium text-muted-foreground hover:text-white transition-all">
            <Download className="w-3 h-3" />
            Export
          </button>
        </div>
      </div>

      {/* Title Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-xl">
             <BrainCircuit className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">{noteData.title}</h1>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{noteData.date} • {noteData.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>{noteData.participants?.join(", ")}</span>
            </div>
            {noteData.isAiTranscribed ? (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/10 text-green-500 rounded-full text-[10px] font-bold uppercase border border-green-500/20">
                <Sparkles className="w-3 h-3" />
                AI High-Fidelity
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/10 text-yellow-500 rounded-full text-[10px] font-bold uppercase border border-yellow-500/20">
                Standard Engine
              </div>
            )}
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: AI Content */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass rounded-2xl overflow-hidden border border-white/5">
            <div className="flex border-b border-white/5 bg-white/5 p-1">
              <button 
                onClick={() => setActiveTab("summary")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'summary' ? 'bg-white/10 text-white shadow-xl' : 'text-muted-foreground hover:text-white'}`}
              >
                <Sparkles className="w-4 h-4" />
                AI Summary
              </button>
              <button 
                onClick={() => setActiveTab("transcript")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'transcript' ? 'bg-white/10 text-white shadow-xl' : 'text-muted-foreground hover:text-white'}`}
              >
                <MessageSquareText className="w-4 h-4" />
                Transcript
              </button>
            </div>

            <div className="p-6">
              {activeTab === "summary" ? (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="prose prose-invert">
                    <p className="text-white/80 leading-relaxed italic">
                      " {noteData.summary} "
                    </p>
                  </div>
                  <div className="pt-4 space-y-2">
                     <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Key Takeaways</h4>
                     <ul className="space-y-2">
                        {noteData.keyTakeaways?.map((point, i) => (
                           <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                              {point}
                           </li>
                        ))}
                     </ul>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar"
                >
                  {noteData.transcript.map((item, i) => (
                    <div key={i} className="group">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">{item.speaker}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{item.time}</span>
                      </div>
                      <p className="text-sm text-white/70 group-hover:text-white transition-colors leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                  {noteData.transcript.length === 0 && (
                    <p className="text-muted-foreground text-center py-10 italic">No transcript recorded.</p>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Editor */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              My Notes
            </h3>
            <span className="text-[10px] text-muted-foreground flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Real-time collaboration active
            </span>
          </div>
          <NoteEditor initialContent={`<h3>Personal Meeting Notes</h3><p>Session recorded on ${noteData.date}.</p><ul><li>Points discussed during the live session are captured in the AI Transcript tab.</li></ul>`} />
        </div>
      </div>
    </div>
  );
}
