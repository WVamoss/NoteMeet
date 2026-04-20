"use client";

import React from "react";
import { 
  Home, 
  Mic, 
  Settings, 
  Search, 
  Clock, 
  FolderIcon, 
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useNoteStore } from "@/lib/store";

const NAV_ITEMS = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Mic, label: "Recordings", href: "/recordings" },
  { icon: Search, label: "Search", href: "/search" },
  { icon: Clock, label: "History", href: "/history" },
];

const WORKSPACES = [
  { label: "Engineering", color: "bg-blue-500" },
  { label: "Product Design", color: "bg-purple-500" },
  { label: "Marketing", color: "bg-pink-500" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { 
    setSettingsOpen, 
    setRecordingOpen, 
    workspaces, 
    addWorkspace 
  } = useNoteStore();
  const [collapsed, setCollapsed] = React.useState(false);

  const handleNewWorkspace = () => {
    const name = window.prompt("Workspace Name:");
    if (name) {
      const colors = ["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-green-500", "bg-yellow-500"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      addWorkspace(name, randomColor);
    }
  };

  return (
    <motion.div 
      animate={{ width: collapsed ? 80 : 260 }}
      className="h-screen glass flex flex-col border-r border-white/5 relative z-20"
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            NoteMeet
          </span>
        )}
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group",
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
              {isActive && !collapsed && (
                <motion.div 
                  layoutId="active-pill"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" 
                />
              )}
            </Link>
          );
        })}

        <div className="pt-8 mb-2 px-3">
          {!collapsed ? (
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">
              Workspaces
            </span>
          ) : (
             <div className="h-px bg-white/5 my-4" />
          )}
        </div>

        {workspaces.map((ws) => (
          <Link 
            key={ws.label} 
            href="#"
            className="flex items-center gap-3 p-3 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-white transition-all group"
          >
            <div className={cn("w-2 h-2 rounded-full shrink-0", ws.color)} />
            {!collapsed && <span className="font-medium">{ws.label}</span>}
          </Link>
        ))}

        <button 
          onClick={handleNewWorkspace}
          className="flex items-center gap-3 p-3 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-white transition-all group w-full"
        >
          <Plus className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="font-medium">New Workspace</span>}
        </button>
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={() => setSettingsOpen(true)}
          className="flex items-center gap-3 p-3 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-white transition-all w-full"
        >
          <Settings className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Settings</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-secondary border border-white/10 flex items-center justify-center hover:bg-primary transition-colors hover:border-primary group"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-white" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-muted-foreground group-hover:text-white" />
        )}
      </button>
    </motion.div>
  );
}
