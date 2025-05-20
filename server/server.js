const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const path = require("path");
const multer = require("multer"); // Import multer
const app = express();
const fs = require("fs"); // Tambahkan ini
const port = 3000;
const cors = require("cors");
app.use(cors());

const session = require("express-session");

app.use(
  session({
    secret: "rahasia_kamu", // ganti dengan string acak rahasia
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // gunakan `true` jika pakai HTTPS
  })
);

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../client")));

// Koneksi ke database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "stroke_voice",
});

// Cek koneksi database
db.connect((err) => {
  if (err) {
    console.error("Gagal konek ke database:", err);
  } else {
    console.log("Terkoneksi ke database MySQL");
  }
});

app.post("/check-user", (req, res) => {
  const { nama } = req.body;
  if (!nama) return res.status(400).json({ error: "Nama harus diisi" });

  db.query(
    "SELECT * FROM user_profiles WHERE nama_lengkap = ? LIMIT 1",
    [nama],
    (err, results) => {
      if (err) {
        console.error("Query error:", err);
        return res.status(500).json({ exists: false });
      }

      if (results.length > 0) {
        const user = results[0];
        req.session.userId = user.id; // ⬅️ SIMPAN userId ke SESSION
        res.json({ exists: true });
      } else {
        res.json({ exists: false });
      }
    }
  );
});

app.get("/get-user-id", (req, res) => {
  if (req.session.userId) {
    res.json({ userId: req.session.userId });
  } else {
    res.status(401).json({ error: "Belum login" });
  }
});

// Endpoint: Tambah user baru
app.post("/register-user", (req, res) => {
  const { nama, jenis_sakit, usia, jenis_kelamin, bisa_membaca } = req.body;

  if (
    !nama ||
    !jenis_sakit ||
    !usia ||
    !jenis_kelamin ||
    typeof bisa_membaca !== "boolean"
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Data tidak lengkap" });
  }

  db.query(
    "INSERT INTO user_profiles (nama_lengkap, jenis_sakit, usia, jenis_kelamin, bisa_membaca) VALUES (?, ?, ?, ?, ?)",
    [nama, jenis_sakit, usia, jenis_kelamin, bisa_membaca],
    (err, result) => {
      if (err) {
        console.error("Gagal insert data:", err);
        return res.status(500).json({ success: false });
      }
      res.json({ success: true });
    }
  );
});

// Tambahkan middleware untuk parsing form-data
app.use(express.urlencoded({ extended: true })); // Penting!
app.use(express.json());

// Pastikan folder uploads ada
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Config Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
// Endpoint Upload File
// Endpoint Upload dengan logging
app.post("/upload", upload.single("audio"), async (req, res) => {
  console.log("Received upload:", {
    file: req.file ? req.file.originalname : "No file",
    body: req.body,
  });

  try {
    // Validasi input
    if (!req.file) throw new Error("File audio tidak ditemukan");
    if (!req.body.user_id) throw new Error("user_id harus diisi");

    // Simpan ke database
    const [result] = await db
      .promise()
      .execute(
        "INSERT INTO user_recordings (user_id, filename) VALUES (?, ?)",
        [req.body.user_id, req.body.filename]
      );

    console.log("File saved to DB:", result);
    res.json({ success: true, fileId: result.insertId });
  } catch (error) {
    console.error("Upload error:", error);

    // Hapus file jika gagal
    if (req.file?.path) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: "Upload failed",
      detail: error.message,
    });
  }
});

// Buat folder uploads jika belum ada
if (!fs.existsSync(path.join(__dirname, "uploads"))) {
  fs.mkdirSync(path.join(__dirname, "uploads"));
}

// Ini penting! Supaya folder client bisa diakses
app.use(express.static(path.join(__dirname, "../client")));

// Jalankan server
app.listen(3000, () => {
  console.log(`✅ Server jalan di http://localhost:${port}`);
});
