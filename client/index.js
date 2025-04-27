document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("loginBtn");
    const namaInput = document.getElementById("nama");
    const extraFields = document.getElementById("extra-fields");
  
    loginBtn.addEventListener("click", async () => {
      const nama = namaInput.value.trim();
      if (!nama) {
        alert("Masukkan nama terlebih dahulu.");
        return;
      }
  
      try {
        const res = await fetch("/check-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nama })
        });
  
        if (!res.ok) {
          console.error("Gagal cek user. Status:", res.status);
          alert("Gagal menghubungi server.");
          return;
        }
  
        const data = await res.json();
  
        if (data.exists) {
          // User ditemukan → masuk ke halaman utama
          window.location.href = "utama.html"; // atau index.php
        } else {
          // User tidak ditemukan
          if (extraFields.style.display === "none" || extraFields.style.display === "") {
            extraFields.style.display = "block";
          } else {
            // Form sudah muncul → lakukan registrasi
            const jenis_sakit = document.getElementById("jenis_sakit").value;
            const usia = document.getElementById("usia").value;
            const jenis_kelamin = document.getElementById("jenis_kelamin").value;
            const bisa_membaca = document.getElementById("bisa_membaca").value;
  
            if (!jenis_sakit || !usia || !jenis_kelamin || bisa_membaca === "") {
              alert("Lengkapi semua data tambahan.");
              return;
            }
  
            const registerRes = await fetch("/register-user", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                nama,
                jenis_sakit,
                usia: parseInt(usia),
                jenis_kelamin,
                bisa_membaca: bisa_membaca === "true"
              })
            });
  
            const registerData = await registerRes.json();
            if (registerData.success) {
              window.location.href = "utama.html";
            } else {
              alert("Gagal menyimpan data.");
            }
          }
        }
      } catch (err) {
        console.error("Error:", err);
        alert("Terjadi kesalahan saat login.");
      }
    });
  });
  