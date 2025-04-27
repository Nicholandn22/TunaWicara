// const kataList = ['makan', 'minum', 'jalan', 'tidur', 'obat'];
const kataList = [
    // Kata-kata  
'pisang', 'piring', 'payung', 'pintu', 'pulpen',
'bola', 'buku', 'baju', 'bunga', 'batu',
'makan', 'minum', 'mama', 'mobil', 'mandi',
'sapu', 'susu', 'sendok', 'sepatu', 'satu',
'topi', 'tikus', 'tangan', 'tidur', 'tomat',
'kucing', 'kue', 'kursi', 'kopi', 'kaca',
'gajah', 'gula', 'gunting', 'gigi', 'garpu',
'dadu', 'domba', 'dapur', 'duduk', 'daun',
'lampu', 'laut', 'lari', 'lonceng', 'laba-laba',
'roti', 'rumah', 'roda', 'rambut', 'ranjang',


    // Kalimat-kalimat  
   'Mama makan',
'Anak tidur',
'Kucing duduk',
'Gajah lari',
'Ayah duduk',
'Domba minum',
'Bola jatuh',
'Tikus lari',
'Lonceng bunyi',
'Roti gosong',
'Mama minum susu',
'Anak baca buku',
'Ayah makan roti',
'Gajah tendang bola',
'Kucing lihat tikus',
'Domba ambil daun',
'Ibu cuci piring',
'Anak lempar buku',
'Kucing makan ikan',
'Adik buka pintu'


    //per10 bagian, group dari awalan kata/kalimat
];
const container = document.getElementById('kata-container');
const rekamanList = []; // Menyimpan semua rekaman sementara di browser

kataList.forEach(kata => {
  const div = document.createElement('div');
  div.innerHTML = `
    <p class="kata">${kata}</p>
    <button class="rekam" onclick="mulaiRekam('${kata}')">Rekam</button>
    <button class="stop" onclick="stopRekam()">Stop</button>
  `;
  container.appendChild(div);
});

let mediaRecorder;
let audioChunks = [];
let currentKata = "";
let rekamActive = null;
let stopActive = true;

async function mulaiRekam(kata) {
  currentKata = kata;
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);

  // Cari tombol yang sedang ditekan
  const buttons = document.querySelectorAll('div');
  buttons.forEach(div => {
    const p = div.querySelector('p.kata');
    if (p && p.textContent === kata) {
      rekamActive = div.querySelector('button.rekam');
      stopActive = div.querySelector('button.stop');
    }
  });

  if (rekamActive) {
    rekamActive.classList.add('active');
    rekamActive.disabled = true;
  }
  if (stopActive) {
    stopActive.classList.add('active');
    stopActive.disabled = false;
  }

  mediaRecorder.ondataavailable = e => audioChunks.push(e.data);

  mediaRecorder.onstop = () => {
    const blob = new Blob(audioChunks, { type: 'audio/wav' });
    rekamanList.push({
      kata: currentKata,
      blob: blob,
      filename: `${currentKata}-${Date.now()}.wav`
    });
    audioChunks = [];

    // Simpan status rekaman di localStorage
    localStorage.setItem(currentKata, 'recorded');

    // Menambahkan tombol Play untuk mendengarkan rekaman
    const audioUrl = URL.createObjectURL(blob);
    const audioElement = new Audio(audioUrl);
    const playButton = document.createElement('button');
    playButton.textContent = 'Play Rekaman';
    playButton.onclick = () => {
      audioElement.play();
    };

    // Menambahkan tombol Play ke UI
    const rekamanDiv = document.querySelector(`div[data-kata="${currentKata}"]`);
    if (rekamanDiv) {
      const existingPlayButton = rekamanDiv.querySelector('.play');
      if (!existingPlayButton) {
        rekamanDiv.appendChild(playButton);
        playButton.classList.add('play');
      }
    }

    if (rekamActive) {
      rekamActive.classList.remove('active');
      rekamActive.classList.add('done');
    }
    if (stopActive) {
      stopActive.classList.remove('active');
      stopActive.disabled = true;
    }

    // alert(`Rekaman untuk kata "${currentKata}" disimpan sementara`); //karena mengganggu jdi ak comand dlu
  };

  mediaRecorder.start();
}



function stopRekam() {
  mediaRecorder.stop();
}

// Kirim semua rekaman ke server
async function kirimSemua() {
  const nama = document.getElementById('nama').value;
  const usia = document.getElementById('usia').value;
  const sakit = document.getElementById('sakit').value;
  const gender = document.querySelector('input[name="gender"]:checked')?.value;
  const membaca = document.querySelector('input[name="membaca"]:checked')?.value;

  if (!nama || !usia || !gender || !membaca || !sakit) {
    alert("Harap isi semua data sebelum mengirim.");
    return;
  }

  for (const rekaman of rekamanList) {
    const formData = new FormData();
    formData.append('audio', rekaman.blob, rekaman.filename);
    formData.append('kata', rekaman.kata);
    formData.append('nama', nama);
    formData.append('usia', usia);
    formData.append('gender', gender);
    formData.append('membaca', membaca);
    formData.append('sakit', sakit);

    await fetch(`http://localhost:3000/upload?nama=${encodeURIComponent(nama)}`, {
      method: 'POST',
      body: formData
    });
  }

  alert("Semua rekaman berhasil dikirim!");
}


let currentPage = 1;
const itemsPerPage = 4;

function renderKataList() {
  container.innerHTML = '';

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentItems = kataList.slice(start, end);

  currentItems.forEach(kata => {
    const div = document.createElement('div');
    
    // Periksa status rekaman di localStorage
    const isRecorded = localStorage.getItem(kata) === 'recorded';

    div.innerHTML = `
      <p class="kata">${kata}</p>
      <button class="rekam ${isRecorded ? 'done' : ''}" onclick="mulaiRekam('${kata}')">${isRecorded ? 'Rekaman Selesai' : 'Rekam'}</button>
      <button class="stop" onclick="stopRekam()">Stop</button>
    `;

    // Menambahkan tombol Play jika rekaman sudah selesai
    if (isRecorded) {
      const playButton = document.createElement('button');
      playButton.textContent = 'Play Rekaman';
      playButton.classList.add('play');
      div.appendChild(playButton);

      // Aksi Play
      const rekaman = rekamanList.find(r => r.kata === kata);
      if (rekaman) {
        const audioUrl = URL.createObjectURL(rekaman.blob);
        const audioElement = new Audio(audioUrl);
        playButton.onclick = () => {
          audioElement.play();
        };
      }
    }

    div.setAttribute('data-kata', kata);
    container.appendChild(div);
  });

  renderPaginationButtons();
}



function renderPaginationButtons() {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  const totalPages = Math.ceil(kataList.length / itemsPerPage);

  const prevButton = document.createElement('button');
  prevButton.textContent = 'Previous';
  prevButton.disabled = currentPage === 1;
  prevButton.onclick = () => {
    currentPage--;
    renderKataList();
  };

  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next';
  nextButton.disabled = currentPage === totalPages;
  nextButton.onclick = () => {
    currentPage++;
    renderKataList();
  };

  pagination.appendChild(prevButton);
  pagination.appendChild(document.createTextNode(` Page ${currentPage} of ${totalPages} `));
  pagination.appendChild(nextButton);
}

renderKataList(); // Mulai saat halaman dimuat


function resetRekaman() {
  // Hapus semua rekaman dari rekamanList
  rekamanList.length = 0;

  // Hapus status rekaman dari localStorage
  kataList.forEach(kata => {
    localStorage.removeItem(kata);
  });

  // Reset UI dengan mengubah tombol 'Rekam' kembali ke kondisi awal
  const buttons = document.querySelectorAll('button.rekam');
  buttons.forEach(button => {
    button.classList.remove('done');
    button.disabled = false;
    button.textContent = 'Rekam';
  });

  alert('Semua rekaman telah direset!');
}

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

    // Cek apakah user sudah ada di database
    const res = await fetch("/check-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama })
    });

    const data = await res.json();
    if (data.exists) {
      // User ditemukan → masuk ke halaman utama
      window.location.href = "index.html"; // atau index.php jika kamu pakai PHP
    } else {
      // User tidak ditemukan → tampilkan form tambahan
      if (extraFields.style.display === "none") {
        extraFields.style.display = "block";
      } else {
        // Kalau form tambahan sudah ditampilkan, lakukan register
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
          window.location.href = "index.html"; // atau index.php
        } else {
          alert("Gagal menyimpan data.");
        }
      }
    }
  });
});
