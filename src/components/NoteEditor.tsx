"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Heading1, 
  Heading2, 
  Undo, 
  Redo 
} from "lucide-react";
import { cn } from "@/lib/utils";

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/5 bg-black/20 backdrop-blur-sm rounded-t-xl">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn("p-2 rounded hover:bg-white/5 transition-colors", editor.isActive("bold") && "text-primary bg-primary/10")}
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn("p-2 rounded hover:bg-white/5 transition-colors", editor.isActive("italic") && "text-primary bg-primary/10")}
      >
        <Italic className="w-4 h-4" />
      </button>
      <div className="w-px h-4 bg-white/10 mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={cn("p-2 rounded hover:bg-white/5 transition-colors", editor.isActive("heading", { level: 1 }) && "text-primary bg-primary/10")}
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn("p-2 rounded hover:bg-white/5 transition-colors", editor.isActive("heading", { level: 2 }) && "text-primary bg-primary/10")}
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <div className="w-px h-4 bg-white/10 mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn("p-2 rounded hover:bg-white/5 transition-colors", editor.isActive("bulletList") && "text-primary bg-primary/10")}
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn("p-2 rounded hover:bg-white/5 transition-colors", editor.isActive("orderedList") && "text-primary bg-primary/10")}
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={cn("p-2 rounded hover:bg-white/5 transition-colors", editor.isActive("blockquote") && "text-primary bg-primary/10")}
      >
        <Quote className="w-4 h-4" />
      </button>
      <div className="ml-auto flex items-center gap-1">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="p-2 rounded hover:bg-white/5 transition-colors"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="p-2 rounded hover:bg-white/5 transition-colors"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export function NoteEditor({ initialContent = "", placeholder = "Start typing your notes here..." }) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount,
    ],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none min-h-[400px] p-6",
      },
    },
  });

  if (!isMounted) {
    return (
      <div className="glass rounded-2xl border border-white/5 h-[450px] animate-pulse flex items-center justify-center">
        <span className="text-muted-foreground text-xs uppercase tracking-widest">Loading Editor...</span>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl border border-white/5 overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <div className="px-6 py-2 border-t border-white/5 flex items-center justify-between bg-black/10">
        <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
          {editor?.storage.characterCount.words()} Words
        </div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Auto-saved
        </div>
      </div>
    </div>
  );
}
