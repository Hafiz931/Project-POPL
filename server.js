import express from "express";
import path from "path";
import winston from "winston";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// --- KONFIGURASI WINSTON ---
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.json() // Format log sebagai JSON agar mudah diparsing oleh Promtail/Loki
  ),
  defaultMeta: { service: "note-do-service" },
  transports: [
    // Tulis ke console (akan ditangkap oleh 'docker logs')
    new winston.transports.Console(),
    // Tulis ke file (akan dibaca oleh Promtail lewat volume)
    new winston.transports.File({ filename: "/var/log/app/app.log" }),
    new winston.transports.File({
      filename: "/var/log/app/error.log",
      level: "error",
    }),
  ],
});

// --- API ENDPOINT UNTUK MENERIMA LOG DARI FRONTEND ---
app.post("/api/log", (req, res) => {
  const { level, message, details } = req.body;

  // Validasi level log
  const validLevels = ["info", "warn", "error", "debug"];
  const logLevel = validLevels.includes(level) ? level : "info";

  logger.log({
    level: logLevel,
    message: message,
    ...details,
    source: "frontend", // Tandai bahwa log ini dari frontend (React)
  });

  res.status(200).send({ status: "logged" });
});

// --- SERVE STATIC FILES (React App) ---
// Menyajikan file statis dari folder 'dist' hasil build Vite
app.use(express.static(path.join(__dirname, "dist")));

// Handle React Routing (kembalikan index.html untuk semua route yang tidak dikenal)
// Handle React Routing (kembalikan index.html untuk semua route yang tidak dikenal)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  logger.info(`Server berjalan di port ${PORT}`);
});
