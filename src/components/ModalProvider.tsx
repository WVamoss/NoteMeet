"use client";

import React from "react";
import { useNoteStore } from "@/lib/store";
import { SettingsModal } from "./SettingsModal";
import { RecorderOverlay } from "./RecorderOverlay";

export function ModalProvider() {
  const { 
    isSettingsOpen, 
    setSettingsOpen, 
    isRecordingOpen, 
    setRecordingOpen 
  } = useNoteStore();

  return (
    <>
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setSettingsOpen(false)} 
      />
      <RecorderOverlay 
        isOpen={isRecordingOpen} 
        onClose={() => setRecordingOpen(false)} 
      />
    </>
  );
}
