const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const path = require("path");
const multer = require("multer"); // Import multer
const app = express();
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
    "SELECT * FROM user_profiles WHERE nama_lengkap = ?",
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



// Setup storage untuk Multer (penyimpanan file berdasarkan user_id)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.body.user_id;
    const dir = path.join(__dirname, 'uploads', userId);

    // Buat folder jika belum ada
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const filename = `${file.originalname}`;
    cb(null, filename);  // Simpan dengan nama file asli
  }
});

const upload = multer({ storage: storage });
// Endpoint upload
app.post("/upload", upload.single("audio"), (req, res) => {
  const userId = req.body.user_id;
  const filename = req.file.filename;

  if (!userId || !filename) {
    return res.status(400).json({ error: "Data tidak lengkap." });
  }

  const sql = "INSERT INTO user_recordings (user_id, filename) VALUES (?, ?)";
  db.query(sql, [userId, filename], (err, result) => {
    if (err) {
      console.error("Gagal simpan ke database:", err);
      return res.status(500).json({ error: "Gagal simpan ke database." });
    }
    res.json({ success: true, id: result.insertId });
  });
});

// Ini penting! Supaya folder client bisa diakses
app.use(express.static(path.join(__dirname, "../client")));

// Jalankan server
app.listen(port, () => {
  console.log(`✅ Server jalan di http://localhost:${port}`);
});
