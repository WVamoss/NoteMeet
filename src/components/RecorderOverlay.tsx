"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Mic, 
  Square, 
  Pause, 
  Play,
  Sparkles, 
  BrainCircuit,
  MessageSquare,
  Waveform
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useNoteStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface RecorderOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RecorderOverlay({ isOpen, onClose }: RecorderOverlayProps) {
  const router = useRouter();
  const addNote = useNoteStore(state => state.addNote);
  const [status, setStatus] = React.useState<"idle" | "recording" | "processing">("idle");
  const [isPaused, setIsPaused] = React.useState(false);
  const [time, setTime] = React.useState(0);
  const [transcript, setTranscript] = React.useState<string[]>([]);
  const [interimText, setInterimText] = React.useState("");
  const [visualizerData, setVisualizerData] = React.useState<number[]>(new Array(32).fill(10));
  
  const recognitionRef = React.useRef<any>(null);
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const analyserRef = React.useRef<AnalyserNode | null>(null);
  const animationRef = React.useRef<number | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const transcriptRef = React.useRef<string[]>([]);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);

  // Real-time Timer
  React.useEffect(() => {
    let interval: any;
    if (status === "recording" && !isPaused) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  React.useEffect(() => {
    async function startCapture() {
      if (isOpen) {
        setStatus("recording");
        setIsPaused(false);
        setTime(0);
        transcriptRef.current = [];
        
        try {
          // 1. Capture Sources
          let systemStream: MediaStream | null = null;
          let micStream: MediaStream | null = null;

          try {
            systemStream = await navigator.mediaDevices.getDisplayMedia({ 
              audio: true, 
              video: { width: 1, height: 1 }
            });
          } catch (e) {
            console.log("System audio denied");
          }

          try {
            micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          } catch (e) {
            console.log("Mic audio denied");
          }

          // 2. Setup Studio Mixer (Web Audio API)
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          const mixerDestination = audioContextRef.current.createMediaStreamDestination();
          
          if (systemStream && systemStream.getAudioTracks().length > 0) {
            const systemSource = audioContextRef.current.createMediaStreamSource(systemStream);
            systemSource.connect(mixerDestination);
            streamRef.current = systemStream; // For visualizer tracker
          }

          if (micStream && micStream.getAudioTracks().length > 0) {
            const micSource = audioContextRef.current.createMediaStreamSource(micStream);
            micSource.connect(mixerDestination);
            if (!streamRef.current) streamRef.current = micStream;
          }

          if (!systemStream && !micStream) throw new Error("No audio sources");

          // The FINAL combined stream for recording
          const combinedRecordingStream = mixerDestination.stream;

          // 3. Audio Visualizer (Use the mixed stream)
          analyserRef.current = audioContextRef.current.createAnalyser();
          const visualizerSource = audioContextRef.current.createMediaStreamSource(combinedRecordingStream);
          visualizerSource.connect(analyserRef.current);
          analyserRef.current.fftSize = 64; 

          const bufferLength = analyserRef.current.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          const updateVisualizer = () => {
            if (analyserRef.current && audioContextRef.current?.state !== "closed" && !isPaused) {
              analyserRef.current.getByteFrequencyData(dataArray);
              const scaledData = Array.from(dataArray).map(v => Math.max(10, (v / 255) * 100));
              setVisualizerData(scaledData);
            } else if (isPaused) {
              setVisualizerData(new Array(32).fill(10));
            }
            animationRef.current = requestAnimationFrame(updateVisualizer);
          };
          updateVisualizer();

          // 4. Setup MediaRecorder with Mixed Audio
          audioChunksRef.current = [];
          const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';
          mediaRecorderRef.current = new MediaRecorder(combinedRecordingStream, { mimeType });
          
          mediaRecorderRef.current.ondataavailable = (e) => {
            if (e.data.size > 0) audioChunksRef.current.push(e.data);
          };
          mediaRecorderRef.current.start(1000);

          // 3. Speech Recognition
          const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
          if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'id-ID';

            recognitionRef.current.onresult = (event: any) => {
              let interim = "";
              for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                  const text = event.results[i][0].transcript;
                  transcriptRef.current = [...transcriptRef.current, text];
                  setTranscript([...transcriptRef.current]);
                  setInterimText("");
                } else {
                  interim += event.results[i][0].transcript;
                  setInterimText(interim);
                }
              }
            };

            recognitionRef.current.start();
          }
        } catch (err) {
          console.error("Capture Error:", err);
          onClose();
        }
      } else {
        stopEverything();
      }
    }

    function stopEverything() {
      if (recognitionRef.current) try { recognitionRef.current.stop(); } catch(e) {}
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        try { mediaRecorderRef.current.stop(); } catch(e) {}
      }
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== "closed") try { audioContextRef.current.close(); } catch(e) {}
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
      
      if (status !== "processing") {
        setStatus("idle");
        setTranscript([]);
        setInterimText("");
        setTime(0);
        setVisualizerData(new Array(32).fill(10));
        audioChunksRef.current = [];
      }
    }

    startCapture();
    return () => stopEverything();
  }, [isOpen]);

  const togglePause = () => {
    if (isPaused) {
      recognitionRef.current?.start();
      if (mediaRecorderRef.current?.state === "paused") mediaRecorderRef.current.resume();
      setIsPaused(false);
    } else {
      recognitionRef.current?.stop();
      if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const handleFinish = async () => {
    setStatus("processing");

    // 0. Wait for MediaRecorder to stop and flush all chunks
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      const stopPromise = new Promise((resolve) => {
        mediaRecorderRef.current!.onstop = resolve;
        mediaRecorderRef.current!.stop();
      });
      await stopPromise;
    }

    const { openAiKey, groqKey, aiProvider } = useNoteStore.getState();
    const finalTranscript = transcriptRef.current;
    let fullText = finalTranscript.join(" ");
    let statusSummary = "Standar Browser";
    let isAi = false;

    // 1. Unified Transcription Flow (OpenAI or Groq)
    const activeKey = aiProvider === 'openai' ? openAiKey : groqKey;
    const isConfigured = activeKey && (aiProvider === 'openai' ? activeKey.startsWith("sk-") : activeKey.startsWith("gsk_"));

    if (isConfigured && audioChunksRef.current.length > 0) {
      try {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append("file", audioBlob, "recording.webm");
        formData.append("model", aiProvider === 'openai' ? "whisper-1" : "whisper-large-v3");
        formData.append("language", "id");

        const endpoint = aiProvider === 'openai' 
          ? "https://api.openai.com/v1/audio/transcriptions" 
          : "https://api.groq.com/openai/v1/audio/transcriptions";

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${activeKey}`
          },
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          fullText = data.text;
          statusSummary = `${aiProvider === 'openai' ? 'OpenAI' : 'Groq'} Whisper AI (Success)`;
          isAi = true;
        } else {
          try {
            const errData = await response.json();
            statusSummary = `${aiProvider} Error: ${errData.error?.message || "Gagal menghubungi AI"}`;
          } catch(e) {
            statusSummary = `${aiProvider} API Error (Status: ${response.status})`;
          }
        }
      } catch (err) {
        statusSummary = `Error: Koneksi bermasalah saat mengirim ke ${aiProvider}.`;
      }
    } else if (!isConfigured) {
      statusSummary = `${aiProvider.toUpperCase()} Belum Aktif (Gunakan Key di Settings)`;
    }

    const currentAudioChunks = [...audioChunksRef.current];
    const hasAudio = currentAudioChunks.length > 0;

    const noteId = Date.now().toString();
    const mockNote = {
      id: noteId,
      title: "Recording Session " + new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      duration: formatTime(time),
      audioUrl: hasAudio ? URL.createObjectURL(new Blob(currentAudioChunks, { type: 'audio/webm' })) : null,
      isAiTranscribed: isAi,
      transcript: fullText.length > 2 
        ? fullText.split('. ').map((text, i) => ({
            speaker: i % 2 === 0 ? "Speaker 1" : "Speaker 2",
            text: text.trim(),
            time: formatTime(Math.floor((time / Math.max(1, fullText.split('. ').length)) * i))
          }))
        : [
            { speaker: "System", text: "Note: Real-time transcription using browser mic detected no speech.", time: "00:00" },
            { speaker: "System", text: "System Audio was recorded in the background. Use the Download button to verify.", time: "00:01" }
          ],
      summary: isAi 
        ? `Ringkasan: "${fullText.substring(0, 150)}...". Transkripsi berhasil diproses oleh ${aiProvider === 'openai' ? 'OpenAI' : 'Groq'} Whisper.`
        : `Sesi rekaman selesai (${statusSummary}). Karena AI Belum siap, transkripsi terbatas pada mic standar.`,
      keyTakeaways: [
        hasAudio ? "File Audio (.webm) berhasil direkam" : "Gagal merekam audio file",
        isAi ? "Transkripsi High-Fidelity Berhasil" : `Status AI: ${statusSummary}`,
        "Silakan tekan tombol 'Download' untuk mengecek rekaman"
      ],
      participants: ["User", "System Audio Capture"]
    };

    addNote(mockNote);
    setTimeout(() => {
      onClose();
      router.push(`/notes/${noteId}`);
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="glass w-full max-w-2xl rounded-[40px] border border-white/10 overflow-hidden relative"
        >
          {status === "processing" ? (
            <div className="p-20 flex flex-col items-center justify-center text-center space-y-6">
               <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center"
               >
                  <Sparkles className="w-10 h-10 text-primary" />
               </motion.div>
               <div className="space-y-2">
                 <h2 className="text-2xl font-bold text-white">AI is Working...</h2>
                 <p className="text-muted-foreground">Transcribing, summarizing, and organizing your meeting notes.</p>
               </div>
               <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.5 }}
                    className="h-full bg-primary"
                  />
               </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <Mic className="w-5 h-5 text-primary animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Live Session</h3>
                    <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest">Recording in Progress...</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-full text-muted-foreground"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Waveform Visualization */}
              <div className="px-12 py-4 flex items-end justify-center gap-1.5 h-32">
                {visualizerData.map((height, i) => (
                  <motion.div
                    key={i}
                    animate={{ height }}
                    className="w-1.5 bg-gradient-to-t from-primary/80 to-blue-500/80 rounded-full"
                  />
                ))}
              </div>

              {/* Transcript Preview */}
              <div className="p-10 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 flex items-center gap-2">
                      <div className={cn("w-1.5 h-1.5 rounded-full", isPaused ? "bg-yellow-500" : "bg-primary animate-pulse")} />
                      <span className="text-[10px] font-bold text-white/50 uppercase">
                        {isPaused ? "Recording Paused" : (interimText ? "Hearing your voice..." : "Real-time Transcription")}
                      </span>
                    </div>
                </div>
                
                <div className="space-y-3 min-h-[120px]">
                    {transcript.slice(-3).map((line, i) => (
                      <motion.p 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 0.4, x: 0 }}
                        className="text-white text-lg font-medium leading-tight"
                      >
                        {line}
                      </motion.p>
                    ))}
                    {interimText && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-primary text-lg font-bold leading-tight italic"
                      >
                        {interimText}...
                      </motion.p>
                    )}
                    {transcript.length === 0 && !interimText && (
                      <p className="text-white/20 text-lg font-medium italic">
                        {isPaused ? "Paused. Click resume to continue." : "Listening for speech..."}
                      </p>
                    )}
                </div>
              </div>

              {/* Footer Controls */}
              <div className="p-8 bg-white/5 flex items-center justify-between border-t border-white/5">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Time Elapsed</span>
                      <span className="text-xl font-mono font-bold text-white">{formatTime(time)}</span>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">AI Status</span>
                      <span className="text-sm font-bold text-primary flex items-center gap-1">
                        <BrainCircuit className="w-3 h-3" />
                        Summarizing Live
                      </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={togglePause}
                    className={cn(
                      "p-4 rounded-2xl transition-all",
                      isPaused ? "bg-primary text-white" : "bg-white/5 hover:bg-white/10 text-white"
                    )}
                  >
                    {isPaused ? <Play className="w-6 h-6 fill-current" /> : <Pause className="w-6 h-6" />}
                  </button>
                  <button 
                    onClick={handleFinish}
                    disabled={status === "processing"}
                    className="flex items-center gap-3 px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-red-500/20 active:scale-95 disabled:opacity-50"
                  >
                    <Square className="w-5 h-5 fill-current" />
                    Finish Meeting
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
