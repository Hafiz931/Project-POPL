# --- TAHAP 1: BUILD STAGE ---
# Menggunakan base image Node.js versi 18-alpine untuk membangun aplikasi.
# 'AS builder' memberi nama pada tahap ini agar bisa dirujuk nanti.
FROM node:18-alpine AS builder

# Menetapkan direktori kerja di dalam kontainer
WORKDIR /app

# Menyalin package.json dan package-lock.json untuk mengoptimalkan cache Docker
COPY package*.json ./

# Meng-install semua dependensi yang dibutuhkan proyek
RUN npm install

# Menyalin seluruh kode sumber proyek Anda ke dalam kontainer
COPY . .

# Menjalankan script 'build' dari package.json (vite build)
# Ini akan menghasilkan folder 'dist' yang berisi file statis siap produksi
RUN npm run build


# --- TAHAP 2: PRODUCTION STAGE ---
# Menggunakan base image Nginx yang sangat ringan untuk menjalankan aplikasi
FROM nginx:stable-alpine

# Menyalin file hasil build dari tahap 'builder' ke direktori web server Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Menimpa konfigurasi Nginx default dengan file konfigurasi kustom kita
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Memberi tahu Docker bahwa kontainer akan berjalan pada port 80
EXPOSE 80

# Perintah default dari image Nginx akan dijalankan untuk memulai server
# CMD ["nginx", "-g", "daemon off;"]