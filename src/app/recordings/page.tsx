"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Play, 
  Search, 
  Filter, 
  MoreVertical,
  Calendar,
  Clock,
  Mic,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useNoteStore } from "@/lib/store";
import { Trash2 } from "lucide-react";

const ALL_RECORDINGS = [
  {
    id: 1,
    title: "Project Alpha Kickoff",
    date: "April 20, 2026",
    duration: "45:12",
    workspace: "Engineering",
    summary: "Discussion on system architecture and database schema.",
    color: "bg-blue-500",
    isAi: true
  },
  {
    id: 2,
    title: "Weekly Design Sync",
    date: "April 19, 2026",
    duration: "1:20:05",
    workspace: "Product Design",
    summary: "Reviewed new landing page concepts and mobile app navigation flow.",
    color: "bg-purple-500",
    isAi: true
  },
  {
    id: 3,
    title: "Marketing Strategy",
    date: "April 18, 2026",
    duration: "32:10",
    workspace: "Marketing",
    summary: "Planning for the Q3 campaign and social media outreach.",
    color: "bg-pink-500",
    isAi: false
  },
  {
    id: 4,
    title: "Client Feedback: Redesign",
    date: "April 17, 2026",
    duration: "15:45",
    workspace: "Product Design",
    summary: "Direct feedback from the client on the V2 prototype color scheme.",
    color: "bg-purple-500",
    isAi: true
  }
];

export default function RecordingsPage() {
  const { notes, deleteNote } = useNoteStore();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Mic className="w-8 h-8 text-primary" />
            All Recordings
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Browse and manage all your transcribed meeting sessions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search recordings..."
              className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-all w-64"
            />
          </div>
          <button className="p-2.5 hover:bg-white/5 rounded-xl text-muted-foreground border border-white/5 transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4">
        {(notes.length > 0 ? notes : ALL_RECORDINGS).map((recording: any, i: number) => (
          <motion.div 
            key={recording.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass group p-5 rounded-[24px] border border-white/5 hover:border-primary/20 transition-all flex flex-col md:flex-row md:items-center gap-6"
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg", recording.color + "/20")}>
               <Play className={cn("w-5 h-5 fill-current", recording.isAi ? "text-white" : "text-white/50")} />
            </div>

            <div className="flex-1 space-y-1">
               <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                    {recording.title}
                  </h3>
                  {recording.isAi && (
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">AI Ready</span>
                  )}
               </div>
               <p className="text-sm text-muted-foreground line-clamp-1">{recording.summary}</p>
            </div>

            <div className="flex items-center gap-8 text-[11px] text-muted-foreground border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-8">
               <div className="flex flex-col">
                  <span className="uppercase font-bold tracking-widest text-[9px] text-white/30">Date</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    {recording.date}
                  </div>
               </div>
               <div className="flex flex-col">
                  <span className="uppercase font-bold tracking-widest text-[9px] text-white/30">Duration</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {recording.duration}
                  </div>
               </div>
               <div className="flex flex-col">
                  <span className="uppercase font-bold tracking-widest text-[9px] text-white/30">Workspace</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className={cn("w-2 h-2 rounded-full", recording.color)} />
                    {recording.workspace}
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-2">
               <Link 
                href={`/notes/${recording.id}`}
                className="p-3 bg-white/5 hover:bg-primary hover:text-white rounded-xl text-muted-foreground transition-all group/btn"
               >
                 <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" />
               </Link>
               {notes.length > 0 && (
                 <button 
                  onClick={() => {
                    if(confirm("Are you sure you want to delete this recording?")) {
                      deleteNote(recording.id);
                    }
                  }}
                  className="p-3 hover:bg-red-500/20 hover:text-red-500 rounded-xl text-muted-foreground transition-all"
                 >
                   <Trash2 className="w-5 h-5" />
                 </button>
               )}
               <button className="p-3 hover:bg-white/5 rounded-xl text-muted-foreground transition-all">
                 <MoreVertical className="w-5 h-5" />
               </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
