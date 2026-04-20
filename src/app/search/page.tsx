"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Search as SearchIcon, 
  History, 
  Tag, 
  FileText, 
  User,
  ArrowRight,
  Filter
} from "lucide-react";
import Link from "next/link";

const SUGGESTIONS = ["Project Alpha", "Q3 Marketing", "Architecture", "Design Sync", "Alex"];

export default function SearchPage() {
  const [query, setQuery] = React.useState("");
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 pt-10">
      {/* Search Bar Area */}
      <div className="space-y-6 text-center">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Find anything in your <span className="text-primary italic">meetings.</span>
        </h1>
        <div className="relative group max-w-2xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-2xl blur opacity-25 group-focus-within:opacity-100 transition duration-500" />
          <div className="relative glass p-2 rounded-2xl border border-white/10 flex items-center gap-4">
             <div className="p-3 bg-primary/10 rounded-xl">
                <SearchIcon className="w-6 h-6 text-primary" />
             </div>
             <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for keywords, speakers, or dates..."
              className="bg-transparent flex-1 border-none outline-none text-xl text-white placeholder:text-white/20 px-2"
              autoFocus
             />
             <button className="p-3 hover:bg-white/5 rounded-xl text-muted-foreground transition-all">
                <Filter className="w-5 h-5" />
             </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 flex-wrap">
           <span className="text-xs font-bold text-white/30 uppercase tracking-widest mr-2">Suggestions:</span>
           {SUGGESTIONS.map(s => (
             <button 
              key={s} 
              onClick={() => setQuery(s)}
              className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-xs text-muted-foreground hover:text-white transition-all"
             >
               {s}
             </button>
           ))}
        </div>
      </div>

      {query.length > 2 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
             <h2 className="text-lg font-bold text-white">Results for "{query}"</h2>
             <span className="text-xs text-muted-foreground">Found 12 matches</span>
          </div>

          <div className="space-y-4">
             {[1, 2, 3].map((i) => (
               <div key={i} className="glass p-6 rounded-2xl border border-white/5 hover:border-primary/20 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between">
                     <div className="space-y-2">
                        <div className="flex items-center gap-3">
                           <FileText className="w-4 h-4 text-primary" />
                           <h3 className="font-bold text-white group-hover:text-primary transition-colors">Meeting Transcript Section</h3>
                           <span className="text-[10px] bg-white/5 text-muted-foreground px-2 py-0.5 rounded">Page 2</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          "...we talked about <mark className="bg-primary/30 text-white px-1 rounded">{query}</mark> in the context of the next sprint. Sarah mentioned that it should be a priority for the engineering team..."
                        </p>
                     </div>
                     <ArrowRight className="w-5 h-5 text-white/10 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5 text-[10px] uppercase font-bold tracking-widest text-white/30">
                     <span className="flex items-center gap-1"><History className="w-3 h-3" /> April {10 + i}, 2026</span>
                     <span className="flex items-center gap-1"><User className="w-3 h-3" /> Speaker: Alex K.</span>
                  </div>
               </div>
             ))}
          </div>
        </motion.div>
      ) : (
        <div className="py-20 text-center space-y-6 opacity-40">
           <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
              <SearchIcon className="w-10 h-10 text-white/20" />
           </div>
           <p className="text-muted-foreground">Type at least 3 characters to start searching through your meeting library.</p>
        </div>
      )}
    </div>
  );
}
