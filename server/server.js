const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client')));

// Koneksi ke database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'stroke_voice'
});

// Cek koneksi database
db.connect((err) => {
  if (err) {
    console.error('Gagal konek ke database:', err);
  } else {
    console.log('Terkoneksi ke database MySQL');
  }
});

// Endpoint: Cek user
app.post('/check-user', (req, res) => {
  const { nama } = req.body;
  if (!nama) return res.status(400).json({ error: "Nama harus diisi" });

  db.query(
    'SELECT * FROM user_profiles WHERE nama_lengkap = ?',
    [nama],
    (err, results) => {
      if (err) {
        console.error("Query error:", err);
        return res.status(500).json({ exists: false });
      }
      res.json({ exists: results.length > 0 });
    }
  );
});

// Endpoint: Tambah user baru
app.post('/register-user', (req, res) => {
  const { nama, jenis_sakit, usia, jenis_kelamin, bisa_membaca } = req.body;

  if (!nama || !jenis_sakit || !usia || !jenis_kelamin || typeof bisa_membaca !== 'boolean') {
    return res.status(400).json({ success: false, message: "Data tidak lengkap" });
  }

  db.query(
    'INSERT INTO user_profiles (nama_lengkap, jenis_sakit, usia, jenis_kelamin, bisa_membaca) VALUES (?, ?, ?, ?, ?)',
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



// Ini penting! Supaya folder client bisa diakses
app.use(express.static(path.join(__dirname, '../client')));

// Jalankan server
app.listen(port, () => {
  console.log(`✅ Server jalan di http://localhost:${port}`);
});


