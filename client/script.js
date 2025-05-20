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

const linkGambar = {
  pisang:
    "https://i.pinimg.com/736x/ac/ea/bf/aceabf6b0d6d29e2987d114aa08b83a4.jpg",
  piring:
    "https://i.pinimg.com/736x/ba/64/85/ba64857718cbb5bf1edf12541d844e7e.jpg",
  payung:
    "https://i.pinimg.com/736x/fe/24/13/fe24135c4c28072e44b9a9f33b5eca5f.jpg",
  pintu:
    "https://i.pinimg.com/736x/fd/3a/c4/fd3ac4c070bebbdf0e1f12195e61f8d3.jpg",
  pulpen:
    "https://i.pinimg.com/736x/87/c3/aa/87c3aa9036c0230ea62b5c99dc2d0f8b.jpg",
  bola: "https://i.pinimg.com/736x/0f/52/22/0f5222f3ce42a8ab2f6b2e9c843dcd25.jpg",
  buku: "https://i.pinimg.com/736x/18/3e/24/183e24b12211121a82bfe80829d0c945.jpg",
  baju: "https://i.pinimg.com/736x/93/3c/20/933c208a69cba502813f233df7feff2e.jpg",
  bunga:
    "https://i.pinimg.com/736x/8e/1a/8a/8e1a8a83c8aed5229c4d310f1e040d96.jpg",
  batu: "https://i.pinimg.com/736x/fd/90/34/fd9034cf8b35f5f8dc29be02bb1ef3d1.jpg",
  makan:
    "https://i.pinimg.com/736x/53/21/b5/5321b584550f9ee92c07f0cfe55a3d13.jpg",
  minum:
    "https://i.pinimg.com/736x/5c/b6/5f/5cb65f562f61f4bdd0f4c04bdfad4a75.jpg",
  mama: "https://i.pinimg.com/736x/d8/34/37/d834370346daa45d8f3c3a29ad03ec41.jpg",
  mobil:
    "https://i.pinimg.com/736x/e9/20/09/e920096c7daa75597165703f0a14d184.jpg",
  mandi:
    "https://i.pinimg.com/736x/f5/37/55/f53755c5e34c299b3e671324e7b442b8.jpg",
  sapu: "https://i.pinimg.com/736x/22/ee/65/22ee65e4ba3a50687743a55ab29cffa5.jpg",
  susu: "https://i.pinimg.com/736x/e1/25/34/e12534bf2fdf875d479a1bc8dbcd1c10.jpg",
  sendok:
    "https://i.pinimg.com/736x/0d/af/91/0daf914d2b216f5777050bf96eddd059.jpg",
  sepatu:
    "https://i.pinimg.com/736x/fa/75/c8/fa75c86409e45f7fdba65d1ade098a20.jpg",
  satu: "https://i.pinimg.com/736x/c9/ee/fe/c9eefec869ce92f197627cd0cb49224d.jpg",
  topi: "https://i.pinimg.com/736x/c4/c4/e7/c4c4e7984eb54f6cbbe18d68a43d6518.jpg",
  tikus:
    "https://i.pinimg.com/736x/10/d7/6f/10d76f1d44c7ce09def50a06923c6f1e.jpg",
  tangan:
    "https://i.pinimg.com/736x/5c/8a/6d/5c8a6d1ffad8bd7586cd50c8830c8a9e.jpg",
  tidur:
    "https://i.pinimg.com/736x/e8/4e/05/e84e05c7b35ad7056406679d01bb0cd5.jpg",
  tomat:
    "https://i.pinimg.com/736x/4b/1a/58/4b1a5831900aa601fde4c7ddb48a271f.jpg",
  kucing:
    "https://i.pinimg.com/736x/d9/d4/40/d9d4400a0ca0226226be4ffb0eef4a3d.jpg",
  kue: "https://i.pinimg.com/736x/0e/7c/20/0e7c20097df16f2088eeda394dba01cf.jpg",
  kursi:
    "https://i.pinimg.com/736x/8b/fd/f4/8bfdf401c9de7e0c66d15f1ff75dc884.jpg",
  kopi: "https://i.pinimg.com/736x/c8/40/c8/c840c8721e5d5319e857207ab5a5642d.jpg",
  kaca: "https://i.pinimg.com/736x/39/e0/9e/39e09e14749482fdb68e37e4c9caf736.jpg",
  gajah:
    "https://i.pinimg.com/736x/2a/6c/4a/2a6c4a82d7ec8eec5b5e587729b6d6fa.jpg",
  gula: "https://i.pinimg.com/736x/d7/2b/2d/d72b2dd759261a8de2e312926208c3a4.jpg",
  gunting:
    "https://i.pinimg.com/736x/d9/51/ec/d951ec0806bbe2939d0e193070052631.jpg",
  gigi: "https://i.pinimg.com/736x/0d/5c/62/0d5c625f59115f8f948a043608e8ccb6.jpg",
  garpu:
    "https://i.pinimg.com/736x/c7/1b/bf/c71bbfa987bea617860c9140c6999f84.jpg",
  dadu: "https://i.pinimg.com/736x/b2/2f/e3/b22fe30300da786dd29202a7436f8e06.jpg",
  domba:
    "https://i.pinimg.com/736x/bf/99/a5/bf99a5b933ef1106c34afb5807ac0542.jpg",
  dapur:
    "https://i.pinimg.com/736x/f7/81/15/f78115def0eec258e7083aa4322d27a7.jpg",
  duduk:
    "https://i.pinimg.com/736x/71/d1/31/71d1310c4daee26e9ebb7b02c0ea3b40.jpg",
  daun: "https://i.pinimg.com/736x/85/57/35/85573567c8c0e50ef564fd46a73f76da.jpg",
  lampu:
    "https://i.pinimg.com/736x/92/97/e2/9297e2f7dfa8b0775ce34f157444d0e0.jpg",
  laut: "https://i.pinimg.com/736x/58/8d/c3/588dc3f837b20b699bf69785553192b4.jpg",
  lari: "https://i.pinimg.com/736x/59/8a/06/598a063d6158b975ed20e9efba6dffe2.jpg",
  lonceng:
    "https://i.pinimg.com/736x/a8/f0/d3/a8f0d363d0f42fea29e62a7a9eecd8a4.jpg",
  "laba-laba":
    "https://i.pinimg.com/736x/58/0c/ad/580cad97d64225d91c9536a39b682bb9.jpg",
  roti: "https://i.pinimg.com/736x/81/7f/7f/817f7fc995e3685cf230adcde101df9f.jpg",
  rumah:
    "https://i.pinimg.com/736x/7a/4c/3d/7a4c3de7e67a587bd76019c92249e540.jpg",
  roda: "https://i.pinimg.com/736x/66/14/5a/66145a33aeabefc112be7adaa89c46e5.jpg",
  rambut:
    "https://i.pinimg.com/736x/47/6a/22/476a225c7991c8c698867809fc6768ec.jpg",
  ranjang:
    "https://i.pinimg.com/736x/d3/bf/7f/d3bf7fbda6b50c00e345cb513c82a9e6.jpg",
};
const container = document.getElementById("kata-container");
const rekamanList = []; // Menyimpan semua rekaman sementara di browser
let gambarInd = 0; //Index link gambar
let userId = null; // Menyimpan userId dari server

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
    rekamanList.push({
      kata: currentKata,
      blob: blob,
      filename: `${currentKata}-${Date.now()}.wav`,
    });
    audioChunks = [];

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
      if (!existingPlayButton) {
        playButton.classList.add("play");
        rekamanDiv.appendChild(playButton);
      }
    }

    if (rekamActive) {
      rekamActive.classList.remove("active");
      rekamActive.classList.add("done");
    }
    if (stopActive) {
      stopActive.classList.remove("active");
      stopActive.disabled = true;
    }

    // alert(`Rekaman untuk kata "${currentKata}" disimpan sementara`); //karena mengganggu jdi ak comand dlu
  };

  mediaRecorder.start();
}

function stopRekam() {
  mediaRecorder.stop();
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

  alert("Proses upload selesai!");
}

let currentPage = 1;
const itemsPerPage = 4;

function renderKataList() {
  container.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentItems = kataList.slice(start, end);

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

  const totalPages = Math.ceil(kataList.length / itemsPerPage);

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
    userId = data.userId; // Simpan userId ke variabel global
  } catch (err) {
    console.error("Error:", err);
    document.getElementById("userId").textContent = "Terjadi kesalahan";
  }
});
