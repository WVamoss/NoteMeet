import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Note {
  id: string;
  title: string;
  transcript: { speaker: string; text: string; time: string }[];
  summary: string;
  keyTakeaways: string[];
  date: string;
  duration?: string;
  participants?: string[];
  audioUrl?: string | null;
  isAiTranscribed?: boolean;
}

interface NoteStore {
  currentNote: Note | null;
  openAiKey: string | null;
  groqKey: string | null;
  aiProvider: 'openai' | 'groq';
  isSettingsOpen: boolean;
  isRecordingOpen: boolean;
  notes: Note[];
  setCurrentNote: (note: Note) => void;
  addNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  setOpenAiKey: (key: string) => void;
  setGroqKey: (key: string) => void;
  setAiProvider: (provider: 'openai' | 'groq') => void;
  setSettingsOpen: (open: boolean) => void;
  setRecordingOpen: (open: boolean) => void;
  addWorkspace: (label: string, color: string) => void;
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      currentNote: null,
      openAiKey: null,
      groqKey: null,
      aiProvider: 'groq',
      isSettingsOpen: false,
      isRecordingOpen: false,
      workspaces: [
        { label: "Engineering", color: "bg-blue-500" },
        { label: "Product Design", color: "bg-purple-500" },
        { label: "Marketing", color: "bg-pink-500" },
      ],
      notes: [],
      setCurrentNote: (note) => set({ currentNote: note }),
      addNote: (note) => set((state) => ({ 
        notes: [note, ...state.notes],
        currentNote: note 
      })),
      deleteNote: (id) => set((state) => ({ 
        notes: state.notes.filter(n => n.id !== id) 
      })),
      setOpenAiKey: (key) => set({ openAiKey: key }),
      setGroqKey: (key) => set({ groqKey: key }),
      setAiProvider: (provider) => set({ aiProvider: provider }),
      setSettingsOpen: (open) => set({ isSettingsOpen: open }),
      setRecordingOpen: (open) => set({ isRecordingOpen: open }),
      addWorkspace: (label, color) => set((state) => ({ 
        workspaces: [...state.workspaces, { label, color }] 
      })),
    }),
    {
      name: 'notemeet-storage',
    }
  )
);
