# --- TAHAP 1: BUILD STAGE ---
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for building)
RUN npm install

# Copy source code
COPY . .

# Build the React app
RUN npm run build


# --- TAHAP 2: PRODUCTION STAGE (NODE.JS SERVER) ---
# Kita gunakan Node.js untuk serving + logging (Winston), BUKAN Nginx lagi.
FROM node:18-alpine AS runner

WORKDIR /app

# Buat folder log agar bisa di-mount volume
RUN mkdir -p /var/log/app

# Copy package files lagi untuk install dependencies production (express, winston)
COPY package*.json ./

# Install ONLY production dependencies
RUN npm install --omit=dev

# Copy hasil build React dari stage builder ke folder 'dist'
COPY --from=builder /app/dist ./dist

# Copy file server Node.js kita
COPY server.js .

# Expose port aplikasi (Express berjalan di 3000)
EXPOSE 3000

# Jalankan server
CMD ["node", "server.js"]