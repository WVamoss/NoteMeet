"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Play, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Calendar,
  Clock,
  MessageSquare,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNoteStore } from "@/lib/store";

const RECENT_MEETINGS = [
  {
    id: 1,
    title: "Project Alpha Kickoff",
    date: "2 hours ago",
    duration: "45m",
    workspace: "Engineering",
    summary: "Discussion on system architecture and database schema for the new project.",
    color: "bg-blue-500"
  },
  {
    id: 2,
    title: "Weekly Design Sync",
    date: "Today, 10:00 AM",
    duration: "1h 20m",
    workspace: "Product Design",
    summary: "Reviewed new landing page concepts and mobile app navigation flow.",
    color: "bg-purple-500"
  },
  {
    id: 3,
    title: "Marketing Strategy",
    date: "Yesterday",
    duration: "30m",
    workspace: "Marketing",
    summary: "Planning for the Q3 campaign and social media outreach.",
    color: "bg-pink-500"
  }
];

export default function HomePage() {
  const { setSettingsOpen, setRecordingOpen } = useNoteStore();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="min-h-screen bg-[#09090b]" />; // Simple loader or empty state
  }

  return (
    <div className="space-y-10 pb-20">

      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Welcome back, <span className="text-primary italic">Creative!</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            You have <span className="text-white font-medium">12 meetings</span> recorded this week.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSettingsOpen(true)}
            className="p-3 hover:bg-white/5 rounded-xl text-muted-foreground hover:text-white transition-all border border-transparent hover:border-white/10"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground transition-colors">
            <Filter className="w-5 h-5" />
          </button>
          <Link href="/notes/1" className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-xl font-medium transition-all shadow-lg shadow-primary/25">
            <Plus className="w-4 h-4" />
            New Note
          </Link>
        </div>
      </div>

      {/* Quick Record Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group cursor-pointer"
        onClick={() => setRecordingOpen(true)}
      >

        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-blue-500/50 rounded-3xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
        <div className="relative glass p-8 rounded-3xl flex items-center justify-between border border-white/10 overflow-hidden">
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-2 text-primary">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">Instant Assistant</span>
            </div>
            <h2 className="text-2xl font-bold text-white max-w-md leading-relaxed">
              Start a new meeting record and let NoteMeet handle the rest.
            </h2>
            <div className="flex items-center gap-4 pt-2">
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-2xl font-bold hover:bg-white/90 transition-all active:scale-95">
                <Play className="fill-current w-4 h-4" />
                Start Recording
              </button>
              <span className="text-muted-foreground text-xs">or press <kbd className="bg-white/10 px-2 py-1 rounded border border-white/10 font-mono text-[10px]">⌘ R</kbd></span>
            </div>
          </div>
          
          {/* Animated Waveform Decoration */}
          <div className="flex items-end gap-1 h-32 opacity-20 pr-10">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  height: [20, 60 + Math.random() * 40, 20],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1 + Math.random(),
                  ease: "easeInOut"
                }}
                className="w-1.5 bg-primary/40 rounded-full"
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Recent Meetings
          </h3>
          <Link href="/recordings" className="text-primary text-sm font-medium hover:underline">View All</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RECENT_MEETINGS.map((meeting, i) => (
            <motion.div 
              key={meeting.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-5 rounded-2xl border border-white/5 hover:border-primary/20 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn("px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight text-white/90", meeting.color)}>
                  {meeting.workspace}
                </div>
                <button className="p-1 hover:bg-white/5 rounded">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              
              <h4 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors cursor-pointer">
                {meeting.title}
              </h4>
              <p className="text-muted-foreground text-xs line-clamp-2 mb-6 min-h-[32px]">
                {meeting.summary}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {meeting.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {meeting.duration}
                  </span>
                </div>
                <div className="flex -space-x-2">
                  {[1, 2].map(avatar => (
                     <div key={avatar} className="w-6 h-6 rounded-full border-2 border-[#09090b] bg-secondary" />
                  ))}
                  <div className="w-6 h-6 rounded-full border-2 border-[#09090b] bg-primary/20 text-primary text-[8px] flex items-center justify-center font-bold">
                    +4
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="fixed bottom-8 right-8">
        <button 
          onClick={() => setRecordingOpen(true)}
          className="w-14 h-14 bg-primary rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-14 group-hover:translate-y-0 transition-transform" />
          <Plus className="w-6 h-6 text-white relative z-10" />
        </button>
      </div>
    </div>
  );
}
