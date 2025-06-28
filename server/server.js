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
        req.session.userId = user.id;
        req.session.jenis_sakit = user.jenis_sakit;
        console.log("Session jenis_sakit disimpan:", req.session.jenis_sakit); // <-- cek di sini
        res.json({ exists: true });
      } else {
        res.json({ exists: false });
      }
    }
  );
});

app.get("/get-user-id", (req, res) => {
  if (req.session.userId) {
    console.log("Ambil dari session jenis_sakit:", req.session.jenis_sakit); // cek di sini
    res.json({
      userId: req.session.userId,
      jenis_sakit: req.session.jenis_sakit,
    });
  } else {
    res.status(401).json({ error: "Belum login" });
  }
});

// Endpoint cek kata
app.get("/unrecorded-kata", async (req, res) => {
  const userId = req.query.user_id;
  if (!userId) {
    return res.status(400).json({ error: "Parameter user_id wajib diisi" });
  }

  try {
    const [rows] = await db
      .promise()
      .query("SELECT kata FROM user_recordings WHERE user_id = ?", [userId]);

    const recordedKata = rows.map((row) => row.kata); // hanya kolom 'kata' yang diambil
    res.json({ recordedKata });
  } catch (err) {
    console.error("Gagal mengambil data kata dari DB:", err);
    res.status(500).json({ error: "Gagal mengambil data dari database" });
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
// Simpan sementara ke folder uploads/temp
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempPath = path.join(__dirname, "uploads", "temp");
    if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath, { recursive: true });
    cb(null, tempPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// STEP 2: Endpoint upload dan pindahkan file
app.post("/upload", upload.single("audio"), async (req, res) => {
  console.log("Received upload:", {
    file: req.file ? req.file.originalname : "No file",
    body: req.body,
  });

  try {
    // Validasi
    if (!req.file) throw new Error("File audio tidak ditemukan");
    const { user_id, filename, jenis_sakit, kata } = req.body;
    if (!user_id || !filename || !jenis_sakit || !kata) {
      throw new Error("user_id, filename, jenis_sakit, dan kata wajib diisi");
    }

    // Tentukan path tujuan

    const finalDir = path.join(__dirname, "uploads", jenis_sakit, kata);
    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
    }

    // Pindahkan file dari temp ke folder tujuan
    const tempPath = req.file.path;
    const finalPath = path.join(finalDir, req.file.originalname);
    // Jika file sudah ada, hapus dulu
    if (fs.existsSync(finalPath)) {
      fs.unlinkSync(finalPath);
    }

    fs.renameSync(tempPath, finalPath);

    // Simpan ke database
    const [result] = await db
      .promise()
      .execute(
        "INSERT INTO user_recordings (user_id, kata, filename) VALUES (?, ?, ?)",
        [user_id, kata, filename]
      );

    console.log("File saved to DB:", result);
    res.json({
      success: true,
      fileId: result.insertId,
      path: `uploads/${jenis_sakit}/${kata}/${filename}`,
    });
    console.log("Upload rekaman:", {
      user_id: user_id,
      filename: rekaman.filename,
      jenis_sakit: jenis_sakit,
      kata: kata, // pastikan ini sesuai kata TERKINI
    });
  } catch (error) {
    console.error("Upload error:", error);

    // Hapus file temp jika gagal
    if (req.file?.path && fs.existsSync(req.file.path)) {
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
