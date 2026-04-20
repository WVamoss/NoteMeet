# 🎙️ NoteMeet — Premium AI Meeting Assistant

NoteMeet adalah asisten pertemuan profesional yang dirancang untuk menangkap, mentranskripsikan, dan mengelola catatan pertemuan Anda dengan antarmuka yang modern dan elegan.

![NoteMeet Banner](https://raw.githubusercontent.com/WVamoss/NoteMeet/main/public/banner.png) *(Segera tambahkan screenshot jika sudah ada)*

## ✨ Fitur Unggulan

- **💎 Premium Dark UI**: Desain antarmuka modern yang futuristik, menggunakan Glassmorphism dan micro-animations.
- **🎙️ Real-time Audio Recorder**: Rekam suara pertemuan langsung dari browser dengan visualisator yang interaktif.
- **🤖 AI Transcription (Powered by Groq)**: Transkripsi suara ke teks secara instan menggunakan teknologi AI terbaru dari Groq (Llama-3/Whisper).
- **📂 Smart Organization**: Kelola rekaman dan catatan Anda dalam folder yang terorganisir.
- **🔍 Global Search**: Cari teks spesifik di dalam ribuan catatan pertemuan Anda dengan mudah.
- **⚡ Fast & Responsive**: Dibangun dengan Next.js 15 untuk performa maksimal.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Backend**: [Groq Cloud SDK](https://groq.com/)

## 🚀 Memulai (Get Started)

### Prasyarat
- Node.js 18+
- Akun Groq Cloud (untuk API Key)

### Instalasi

1. Clone repository:
   ```bash
   git clone https://github.com/WVamoss/NoteMeet.git
   cd NoteMeet
   ```

2. Install dependensi:
   ```bash
   npm install
   ```

3. Konfigurasi Environment Variables:
   Buat file `.env.local` di root direktori dan tambahkan API Key Anda:
   ```env
   NEXT_PUBLIC_GROQ_API_KEY=your_api_key_here
   ```

4. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 📖 Panduan Penggunaan (User Guide)

Ikuti langkah-langkah berikut untuk menggunakan NoteMeet secara maksimal:

1.  **Pengaturan AI (Wajib)**: 
    - Klik ikon **Settings** (roda gigi) di pojok kanan atas Dashboard.
    - Masukkan **API Key** dari [Groq](https://console.groq.com/keys) atau [OpenAI](https://platform.openai.com/api-keys).
    - Pilih provider yang ingin Anda gunakan. AI digunakan untuk transkripsi kualitas tinggi dan pembuatan ringkasan otomatis.

2.  **Membuat Catatan Baru**:
    - Klik tombol **"New Note"** atau **"Start Recording"** di Dashboard.
    - Tekan **"Allow"** pada prompt browser untuk memberikan akses microphone.
    - Sesi rekaman akan dimulai dengan visualisasi suara real-time.

3.  **Selama Pertemuan**:
    - Anda bisa menjeda rekaman dengan tombol **Pause** dan melanjutkannya kembali.
    - Transkripsi standar akan muncul secara langsung di layar saat Anda berbicara.

4.  **Menyelesaikan & Memproses AI**:
    - Klik tombol **"Finish Meeting"** untuk mengakhiri sesi.
    - Tunggu beberapa saat selagi AI memproses audionya. NoteMeet akan melakukan transkripsi ulang menggunakan model Whisper AI untuk hasil yang jauh lebih akurat, lalu merangkum poin-poin pentingnya.

5.  **Review Catatan**:
    - Anda akan diarahkan ke halaman detail catatan.
    - Di sini Anda bisa membaca **AI Summary**, melihat **Key Takeaways**, dan membaca **Full Transcript**.
    - Anda juga bisa menambahkan catatan manual di editor teks yang disediakan.

6.  **Manajemen Rekaman**:
    - Klik menu **"Recordings"** di sidebar untuk melihat semua daftar pertemuan Anda.
    - Gunakan fitur **Search** untuk mencari kata kunci di judul atau ringkasan.
    - Anda bisa menghapus rekaman lama menggunakan ikon **Trash** pada daftar rekaman.

## 📸 Screenshots

| Dashboard | Recordings |
|---|---|
| ![Dashboard](https://raw.githubusercontent.com/WVamoss/NoteMeet/main/public/screenshots/dashboard.png) | ![Recordings](https://raw.githubusercontent.com/WVamoss/NoteMeet/main/public/screenshots/recordings.png) |

## 📄 Lisensi

Project ini dibuat oleh [WVamoss](https://github.com/WVamoss). Bebas digunakan untuk keperluan belajar!

---
*Dibuat dengan ❤️ untuk produktivitas yang lebih baik.*
