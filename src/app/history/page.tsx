"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  ChevronRight,
  MoreVertical,
  Activity,
  History as HistoryIcon
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const HISTORY_DATA = [
  {
    date: "Today",
    items: [
      { id: 1, title: "Project Alpha Kickoff", time: "08:30 AM", type: "meeting" },
      { id: 2, title: "Design Feedback Loop", time: "11:00 AM", type: "review" },
    ]
  },
  {
    date: "Yesterday",
    items: [
      { id: 3, title: "Weekly Planning", time: "09:00 AM", type: "meeting" },
      { id: 4, title: "Quick Sync: Marketing", time: "03:45 PM", type: "sync" },
      { id: 5, title: "1-on-1 with Alex", time: "04:30 PM", type: "chat" },
    ]
  },
  {
    date: "April 18, 2026",
    items: [
      { id: 6, title: "Client Presentation", time: "10:15 AM", type: "presentation" },
    ]
  }
];

export default function HistoryPage() {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <HistoryIcon className="w-8 h-8 text-primary" />
          Timeline History
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Trace back your meeting activity across time.
        </p>
      </div>

      <div className="space-y-12">
         {HISTORY_DATA.map((group, groupIdx) => (
           <div key={group.date} className="relative">
              {/* Vertical Line */}
              {groupIdx !== HISTORY_DATA.length - 1 && (
                <div className="absolute left-[23px] top-10 bottom-0 w-0.5 bg-gradient-to-b from-white/10 to-transparent" />
              )}
              
              <div className="flex items-center gap-6 mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative z-10">
                    <Calendar className="w-5 h-5 text-primary" />
                 </div>
                 <h2 className="text-xl font-bold text-white">{group.date}</h2>
              </div>

              <div className="ml-16 space-y-4">
                 {group.items.map((item, itemIdx) => (
                   <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (groupIdx * 3 + itemIdx) * 0.05 }}
                    className="glass group p-4 rounded-2xl border border-white/5 hover:border-primary/20 transition-all flex items-center justify-between"
                   >
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                           <Activity className="w-4 h-4" />
                        </div>
                        <div>
                           <h3 className="font-bold text-white group-hover:text-white transition-colors">{item.title}</h3>
                           <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-0.5">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.time}</span>
                              <span className="flex items-center gap-1">• {item.type}</span>
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center gap-2">
                        <Link 
                          href={`/notes/${item.id}`}
                          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-white transition-all"
                        >
                          View Details
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                        <button className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground">
                           <MoreVertical className="w-4 h-4" />
                        </button>
                     </div>
                   </motion.div>
                 ))}
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}
