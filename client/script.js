// const kataList = ['makan', 'minum', 'jalan', 'tidur', 'obat'];
const kataList = [
  // Kata-kata
  "pisang",
  "piring",
  "payung",
  "pintu",
  "pulpen",
  "bola",
  "buku",
  "baju",
  "bunga",
  "batu",
  "makan",
  "minum",
  "mama",
  "mobil",
  "mandi",
  "sapu",
  "susu",
  "sendok",
  "sepatu",
  "satu",
  "topi",
  "tikus",
  "tangan",
  "tidur",
  "tomat",
  "kucing",
  "kue",
  "kursi",
  "kopi",
  "kaca",
  "gajah",
  "gula",
  "gunting",
  "gigi",
  "garpu",
  "dadu",
  "domba",
  "dapur",
  "duduk",
  "daun",
  "lampu",
  "laut",
  "lari",
  "lonceng",
  "laba-laba",
  "roti",
  "rumah",
  "roda",
  "rambut",
  "ranjang",

  // Kalimat-kalimat
  "Mama makan",
  "Anak tidur",
  "Kucing duduk",
  "Gajah lari",
  "Ayah duduk",
  "Domba minum",
  "Bola jatuh",
  "Tikus lari",
  "Lonceng bunyi",
  "Roti gosong",
  "Mama minum susu",
  "Anak baca buku",
  "Ayah makan roti",
  "Gajah tendang bola",
  "Kucing lihat tikus",
  "Domba ambil daun",
  "Ibu cuci piring",
  "Anak lempar buku",
  "Kucing makan ikan",
  "Adik buka pintu",

  //per10 bagian, group dari awalan kata/kalimat
];

const container = document.getElementById("kata-container");
const rekamanList = []; // Menyimpan semua rekaman sementara di browser
let gambarInd = 0; //Index link gambar
let userId = null; // Menyimpan userId dari server
let jenis_sakit = null; // Menyimpan userId dari server

kataList.forEach((kata) => {
  const div = document.createElement("div");
  if (kata.trim().split(/\s+/).length === 1) {
    //Cek split kata
    div.innerHTML = `
    <p class="kata">${kata}</p>
    <img src="${linkGambar[gambarInd]}" alt="${kata}">
    <br>
    <button class="rekam" onclick="mulaiRekam('${kata}')">Rekam</button>
    <button class="stop" onclick="stopRekam()">Stop</button>
    `;
    gambarInd++;
  } else {
    div.innerHTML = `
    <p class="kata">${kata}</p>
    <button class="rekam" onclick="mulaiRekam('${kata}')">Rekam</button>
    <button class="stop" onclick="stopRekam()">Stop</button>
    `;
  }
  container.appendChild(div);
});

let mediaRecorder;
let audioChunks = [];
let currentKata = "";
let rekamActive = null;
let stopActive = true;

async function mulaiRekam(kata) {
  audioChunks = [];
  currentKata = kata;
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  mediaRecorder = new MediaRecorder(stream);

  // Cari tombol yang sedang ditekan
  const buttons = document.querySelectorAll("div");
  buttons.forEach((div) => {
    const p = div.querySelector("p.kata");
    const img = div.querySelector("img");

    if (p && p.textContent === kata) {
      rekamActive = div.querySelector("button.rekam");
      stopActive = div.querySelector("button.stop");
    }
  });

  if (rekamActive) {
    rekamActive.classList.add("active");
    rekamActive.disabled = true;
  }
  if (stopActive) {
    stopActive.classList.add("active");
    stopActive.disabled = false;
  }

  mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);

  mediaRecorder.onstop = () => {
    const blob = new Blob(audioChunks, { type: "audio/wav" });
    const timestamp = Date.now();
    const filename = `${userId}-${currentKata}-${Date.now()}.wav`;

    rekamanList.push({
      kata: currentKata,
      blob: blob,
      filename: `${kata}-${userId}-${timestamp}.wav`,
    });

    // Simpan status rekaman di localStorage
    localStorage.setItem(currentKata, "recorded");

    // Menambahkan tombol Play untuk mendengarkan rekaman
    const audioUrl = URL.createObjectURL(blob);
    const audioElement = new Audio(audioUrl);
    const playButton = document.createElement("button");
    playButton.textContent = "Play Rekaman";
    playButton.onclick = () => {
      audioElement.play();
    };

    // Menambahkan tombol Play ke UI
    const rekamanDiv = document.querySelector(
      `div[data-kata="${currentKata}"]`
    );

    if (rekamanDiv) {
      const existingPlayButton = rekamanDiv.querySelector(".play");
      if (existingPlayButton) {
        existingPlayButton.remove(); // 🔥 Hapus tombol lama agar bisa diganti
      }

      playButton.classList.add("play");
      rekamanDiv.appendChild(playButton);
    }

    // if (rekamActive) {
    //   // rekamActive.classList.remove("active");
    //   // rekamActive.classList.add("done");
    // }
    // if (stopActive) {
    //   stopActive.classList.remove("active");
    //   stopActive.disabled = true;
    // }

    // alert(`Rekaman untuk kata "${currentKata}" disimpan sementara`); //karena mengganggu jdi ak comand dlu
  };

  mediaRecorder.start();
}

function stopRekam() {
  mediaRecorder.stop();
  rekamActive.disabled = false;
  stopActive.disabled = true;

  rekamActive.classList.remove("active");
  stopActive.classList.remove("active");
}

async function kirimSemua() {
  if (!userId) {
    alert("Masukkan ID User terlebih dahulu.");
    return;
  }

  if (rekamanList.length === 0) {
    alert("Belum ada rekaman yang direkam.");
    return;
  }

  for (const rekaman of rekamanList) {
    try {
      const formData = new FormData();
      formData.append("audio", rekaman.blob, rekaman.filename);
      formData.append("user_id", userId);
      formData.append("filename", rekaman.filename);
      formData.append("jenis_sakit", jenis_sakit); // ✅ Tambahkan ini
      formData.append("kata", rekaman.kata); // ✅ Tambahkan ini

      console.log("Jenis sakit (client):", jenis_sakit); // Debugging
      console.log("Kata (client):", rekaman.kata);

      console.log("Uploading:", rekaman.filename); // Log filename

      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Server error");
      }

      const result = await response.json();
      console.log("Upload success:", result);
    } catch (error) {
      console.error(`Gagal upload ${rekaman.filename}:`, error);
      alert(`Gagal upload ${rekaman.filename}: ${error.message}`);
    }
  }

  // Hapus semua rekaman dari rekamanList
  rekamanList.length = 0;

  // Hapus status rekaman dari localStorage
  kataList.forEach((kata) => {
    localStorage.removeItem(kata);
  });
  alert("Proses upload selesai!");
}

let currentPage = 1;
const itemsPerPage = 4;

function renderKataList() {
  container.innerHTML = "";
  //filtering gambar yg ditampilkan
  const filteredItems = kataList.filter((kata) => !localStorage.getItem(kata));
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentItems = filteredItems.slice(start, end);

  // const start = (currentPage - 1) * itemsPerPage;
  // const end = start + itemsPerPage;
  // const currentItems = kataList.slice(start, end);
  // const filteredItems = currentItems.filter((kata) => !localStorage.getItem(kata));

  // filteredItems.forEach((kata) => {
  currentItems.forEach((kata) => {
    const div = document.createElement("div");

    // Periksa status rekaman di localStorage
    const isRecorded = localStorage.getItem(kata) === "recorded";

    if (kata.trim().split(/\s+/).length === 1) {
      //Cek split kata
      // const imgSrc = linkGambar[gambarInd % linkGambar.length]; //cek panjang list
      const imgSrc = linkGambar[kata];

      div.innerHTML = `
        <img src="${imgSrc}" alt="${kata}">
        <br>
        <p class="kata">${kata}</p>
        <br>
        <button class="rekam ${
          isRecorded ? "done" : ""
        }" onclick="mulaiRekam('${kata}')">${
        isRecorded ? "Rekaman Selesai" : "Rekam"
      }</button>
        <button class="stop" onclick="stopRekam()">Stop</button>
      `;
      gambarInd++;
    } else {
      div.innerHTML = `
      <p class="kata">${kata}</p>
      <button class="rekam ${
        isRecorded ? "done" : ""
      }" onclick="mulaiRekam('${kata}')">${
        isRecorded ? "Rekaman Selesai" : "Rekam"
      }</button>
      <button class="stop" onclick="stopRekam()">Stop</button>
    `;
    }

    // Menambahkan tombol Play jika rekaman sudah selesai
    if (isRecorded) {
      const playButton = document.createElement("button");
      playButton.textContent = "Play Rekaman";
      playButton.classList.add("play");
      div.appendChild(playButton);

      // Aksi Play
      const rekaman = rekamanList.find((r) => r.kata === kata);
      if (rekaman) {
        const audioUrl = URL.createObjectURL(rekaman.blob);
        const audioElement = new Audio(audioUrl);
        playButton.onclick = () => {
          audioElement.play();
        };
      }
    }

    div.setAttribute("data-kata", kata);
    container.appendChild(div);
  });

  renderPaginationButtons();
}

function renderPaginationButtons() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const unrecededItems = kataList.filter((kata) => !localStorage.getItem(kata));
  const totalPages = Math.ceil(unrecededItems.length / itemsPerPage);

  const prevButton = document.createElement("button");
  prevButton.textContent = "Previous";
  prevButton.disabled = currentPage === 1;
  prevButton.onclick = () => {
    currentPage--;
    renderKataList();
  };

  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.disabled = currentPage === totalPages;
  nextButton.onclick = () => {
    currentPage++;
    renderKataList();
  };

  pagination.appendChild(prevButton);
  pagination.appendChild(
    document.createTextNode(` Page ${currentPage} of ${totalPages} `)
  );
  pagination.appendChild(nextButton);
}

renderKataList(); // Mulai saat halaman dimuat

function resetRekaman() {
  // Hapus semua rekaman dari rekamanList
  rekamanList.length = 0;

  // Hapus status rekaman dari localStorage
  kataList.forEach((kata) => {
    localStorage.removeItem(kata);
  });

  // Reset UI dengan mengubah tombol 'Rekam' kembali ke kondisi awal
  const buttons = document.querySelectorAll("button.rekam");
  buttons.forEach((button) => {
    button.classList.remove("done");
    button.disabled = false;
    button.textContent = "Rekam";
  });

  alert("Semua rekaman telah direset!");
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/get-user-id", {
      method: "GET",
      credentials: "include", // ⬅️ PENTING: agar cookie session dikirim
    });

    if (!res.ok) {
      throw new Error("Gagal ambil userId");
    }

    const data = await res.json();
    document.getElementById("userId").textContent = data.userId;
    console.log("User ID:", data.userId);
    console.log("Sakit:", data.jenis_sakit);
    userId = data.userId; // Simpan userId ke variabel global
    jenis_sakit = data.jenis_sakit; // Simpan userId ke variabel global
  } catch (err) {
    console.error("Error:", err);
    document.getElementById("userId").textContent = "Terjadi kesalahan";
  }
});
