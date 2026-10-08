/* =========================================
   DATA DEFAULT
========================================= */

const defaultKendaraan = [
  {
    id: 1,
    polisi: "B 1234 KZ",
    jenis: "Mobil",
    merk: "Toyota",
    pelanggan: "Andi",
    keluhan: "Ganti Oli",
    status: "Dikerjakan",
    estimasi: 350000,
  },

  {
    id: 2,
    polisi: "N 2456 AB",
    jenis: "Motor",
    merk: "Honda",
    pelanggan: "Budi",
    keluhan: "Servis Mesin",
    status: "Menunggu",
    estimasi: 250000,
  },

  {
    id: 3,
    polisi: "B 7788 CD",
    jenis: "Mobil",
    merk: "Honda",
    pelanggan: "Rizky",
    keluhan: "Ganti Rem",
    status: "Quality Check",
    estimasi: 750000,
  },

  {
    id: 4,
    polisi: "L 4567 EF",
    jenis: "Mobil",
    merk: "Daihatsu",
    pelanggan: "Fajar",
    keluhan: "Tune Up",
    status: "Selesai",
    estimasi: 500000,
  },
];

const defaultMekanik = [
  {
    id: 1,
    nama: "Asep",
    spesialisasi: "Mobil",
    status: "Aktif",
  },

  {
    id: 2,
    nama: "Budi",
    spesialisasi: "Motor",
    status: "Aktif",
  },

  {
    id: 3,
    nama: "Rizky",
    spesialisasi: "Mesin",
    status: "Izin",
  },
];

/* =========================================
   LOCAL STORAGE
========================================= */

function getKendaraan() {
  const data = localStorage.getItem("workshop_kendaraan");

  if (!data) {
    localStorage.setItem(
      "workshop_kendaraan",
      JSON.stringify(defaultKendaraan),
    );

    return [...defaultKendaraan];
  }

  try {
    const kendaraan = JSON.parse(data);

    if (Array.isArray(kendaraan)) {
      return kendaraan;
    }
  } catch (error) {
    console.error("Data kendaraan rusak:", error);
  }

  localStorage.setItem("workshop_kendaraan", JSON.stringify(defaultKendaraan));

  return [...defaultKendaraan];
}

function saveKendaraan(data) {
  localStorage.setItem("workshop_kendaraan", JSON.stringify(data));
}

function getMekanik() {
  const data = localStorage.getItem("workshop_mekanik");

  if (!data) {
    localStorage.setItem("workshop_mekanik", JSON.stringify(defaultMekanik));

    return [...defaultMekanik];
  }

  try {
    const mekanik = JSON.parse(data);

    if (Array.isArray(mekanik)) {
      return mekanik;
    }
  } catch (error) {
    console.error("Data mekanik rusak:", error);
  }

  localStorage.setItem("workshop_mekanik", JSON.stringify(defaultMekanik));

  return [...defaultMekanik];
}

function saveMekanik(data) {
  localStorage.setItem("workshop_mekanik", JSON.stringify(data));
}

/* =========================================
   FORMAT
========================================= */

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

/* =========================================
   STATUS
========================================= */

function getStatusClass(status) {
  switch (status) {
    case "Menunggu":
      return "waiting";

    case "Dikerjakan":
      return "working";

    case "Quality Check":
      return "qc";

    case "Selesai":
      return "done";

    default:
      return "";
  }
}

/* =========================================
   HELPER
========================================= */

function setText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* =========================================
   MODAL
========================================= */

function openModal(id) {
  const modal = document.getElementById(id);

  if (modal) {
    modal.classList.add("show");
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);

  if (modal) {
    modal.classList.remove("show");
  }
}

/* =========================================
   DASHBOARD
   Semua halaman membaca data yang sama
========================================= */

function updateDashboard() {
  const kendaraan = getKendaraan();

  const menunggu = kendaraan.filter(
    (item) => item.status === "Menunggu",
  ).length;

  const dikerjakan = kendaraan.filter(
    (item) => item.status === "Dikerjakan",
  ).length;

  const qc = kendaraan.filter((item) => item.status === "Quality Check").length;

  const selesai = kendaraan.filter((item) => item.status === "Selesai").length;

  const pendapatan = kendaraan.reduce((total, item) => {
    return total + Number(item.estimasi || 0);
  }, 0);

  /* STAT CARD */

  setText("totalKendaraan", kendaraan.length);

  setText("totalMenunggu", menunggu);

  setText("totalDikerjakan", dikerjakan);

  setText("totalQC", qc);

  setText("totalSelesai", selesai);

  setText("totalPendapatan", formatRupiah(pendapatan));

  /* CIRCLE */

  setText("totalServiceCircle", kendaraan.length);

  setText("circleMenunggu", menunggu);

  setText("circleDikerjakan", dikerjakan);

  setText("circleQC", qc);

  setText("circleSelesai", selesai);

  /*
        Tabel kendaraan Dashboard
        mulai dari halaman 1
    */

  renderKendaraan(document.getElementById("searchKendaraan")?.value || "", 1);
}

/* =========================================
   TABEL KENDARAAN
========================================= */

function renderKendaraan(search = "", page = 1) {
  const table = document.getElementById("kendaraanTable");

  if (!table) {
    return;
  }

  const kendaraan = getKendaraan();

  const keyword = String(search).toLowerCase().trim();

  /*
        SEARCH
    */

  const hasil = kendaraan.filter((item) => {
    return [
      item.polisi,
      item.jenis,
      item.merk,
      item.pelanggan,
      item.keluhan,
      item.status,
    ].some((value) => {
      return String(value || "")
        .toLowerCase()
        .includes(keyword);
    });
  });

  /*
        MENENTUKAN HALAMAN

        Dashboard tidak mempunyai
        tombol Tambah Kendaraan.

        Halaman kendaraan mempunyai
        tombol Tambah Kendaraan.
    */

  const isDashboard = !document.getElementById("btnTambahKendaraan");

  /*
        MAKSIMAL 10 DATA
        PER HALAMAN
    */

  const perPage = 10;

  const totalPages = Math.max(1, Math.ceil(hasil.length / perPage));

  if (page < 1) {
    page = 1;
  }

  if (page > totalPages) {
    page = totalPages;
  }

  const startIndex = (page - 1) * perPage;

  const endIndex = startIndex + perPage;

  const dataHalaman = hasil.slice(startIndex, endIndex);

  table.innerHTML = "";

  /*
        JIKA DATA KOSONG
    */

  if (hasil.length === 0) {
    const colspan = isDashboard ? 7 : 8;

    table.innerHTML = `
            <tr>
                <td
                    colspan="${colspan}"
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >
                    Tidak ada data kendaraan
                </td>
            </tr>
        `;

    setText("kendaraanInfo", "Menampilkan 0 kendaraan");

    renderKendaraanPagination(1, 1, search);

    return;
  }

  /*
        TAMPILKAN DATA
    */

  dataHalaman.forEach((item, index) => {
    const statusClass = getStatusClass(item.status);

    const nomor = startIndex + index + 1;

    /*
                =========================
                DASHBOARD
                TANPA AKSI
                =========================
            */

    if (isDashboard) {
      table.innerHTML += `
                    <tr>

                        <td>
                            ${nomor}
                        </td>

                        <td>
                            <strong>
                                ${escapeHTML(item.polisi)}
                            </strong>
                        </td>

                        <td>
                            ${escapeHTML(item.jenis)}
                        </td>

                        <td>
                            ${escapeHTML(item.merk)}
                        </td>

                        <td>
                            ${escapeHTML(item.pelanggan)}
                        </td>

                        <td>
                            ${escapeHTML(item.keluhan)}
                        </td>

                        <td>
                            <span
                                class="badge ${statusClass}"
                            >
                                ${escapeHTML(item.status)}
                            </span>
                        </td>

                    </tr>
                `;
    } else {

    /*
                =========================
                HALAMAN KENDARAAN
                DENGAN AKSI
                =========================
            */
      table.innerHTML += `
                    <tr>

                        <td>
                            ${nomor}
                        </td>

                        <td>
                            <strong>
                                ${escapeHTML(item.polisi)}
                            </strong>
                        </td>

                        <td>
                            ${escapeHTML(item.jenis)}
                        </td>

                        <td>
                            ${escapeHTML(item.merk)}
                        </td>

                        <td>
                            ${escapeHTML(item.pelanggan)}
                        </td>

                        <td>
                            ${escapeHTML(item.keluhan)}
                        </td>

                        <td>
                            <span
                                class="badge ${statusClass}"
                            >
                                ${escapeHTML(item.status)}
                            </span>
                        </td>

                        <td>

                            <div
                                class="action-buttons"
                            >

                                <button
                                    type="button"
                                    class="action-btn"
                                    onclick="
                                        showKendaraanDetail(
                                            ${item.id}
                                        )
                                    "
                                >
                                    Detail
                                </button>


                                <button
                                    type="button"
                                    class="action-btn"
                                    onclick="
                                        editKendaraan(
                                            ${item.id}
                                        )
                                    "
                                >
                                    Edit
                                </button>


                                <button
                                    type="button"
                                    class="action-btn danger"
                                    onclick="
                                        deleteKendaraan(
                                            ${item.id}
                                        )
                                    "
                                >
                                    Hapus
                                </button>

                            </div>

                        </td>

                    </tr>
                `;
    }
  });

  /*
        INFO JUMLAH DATA
    */

  setText(
    "kendaraanInfo",
    `Menampilkan ${startIndex + 1}-${Math.min(endIndex, hasil.length)} dari ${
      hasil.length
    } kendaraan`,
  );

  /*
        PAGINATION
    */

  renderKendaraanPagination(page, totalPages, search);
}

/* =========================================
   PAGINATION KENDARAAN
========================================= */

function renderKendaraanPagination(currentPage, totalPages, search = "") {
  const pagination = document.getElementById("kendaraanPagination");

  if (!pagination) {
    return;
  }

  pagination.innerHTML = "";

  /*
        Kalau cuma satu halaman,
        pagination tidak ditampilkan.
    */

  if (totalPages <= 1) {
    return;
  }

  /*
        TOMBOL SEBELUMNYA
    */

  const prevButton = document.createElement("button");

  prevButton.type = "button";

  prevButton.className = "page-btn";

  prevButton.textContent = "‹";

  prevButton.disabled = currentPage === 1;

  prevButton.addEventListener("click", function () {
    renderKendaraan(search, currentPage - 1);
  });

  pagination.appendChild(prevButton);

  /*
        NOMOR HALAMAN
    */

  for (let page = 1; page <= totalPages; page++) {
    const pageButton = document.createElement("button");

    pageButton.type = "button";

    pageButton.className = "page-btn";

    pageButton.textContent = page;

    if (page === currentPage) {
      pageButton.classList.add("active");
    }

    pageButton.addEventListener("click", function () {
      renderKendaraan(search, page);
    });

    pagination.appendChild(pageButton);
  }

  /*
        TOMBOL BERIKUTNYA
    */

  const nextButton = document.createElement("button");

  nextButton.type = "button";

  nextButton.className = "page-btn";

  nextButton.textContent = "›";

  nextButton.disabled = currentPage === totalPages;

  nextButton.addEventListener("click", function () {
    renderKendaraan(search, currentPage + 1);
  });

  pagination.appendChild(nextButton);
}

/* =========================================
   TABEL MEKANIK
========================================= */

function renderMekanik() {
  const table = document.getElementById("mekanikTable");

  if (!table) {
    return;
  }

  const mekanik = getMekanik();

  table.innerHTML = "";

  if (mekanik.length === 0) {
    table.innerHTML = `
            <tr>
                <td
                    colspan="4"
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >
                    Tidak ada data mekanik
                </td>
            </tr>
        `;

    return;
  }

  mekanik.forEach((item, index) => {
    table.innerHTML += `
                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        <strong>
                            ${escapeHTML(item.nama)}
                        </strong>
                    </td>

                    <td>
                        ${escapeHTML(item.spesialisasi)}
                    </td>

                    <td>
                        ${escapeHTML(item.status)}
                    </td>

                </tr>
            `;
  });
}

/* =========================================
   RESET FORM KENDARAAN
========================================= */

function resetKendaraanForm() {
  const form = document.getElementById("vehicleForm");

  if (!form) {
    return;
  }

  form.reset();

  const id = document.getElementById("vehicleId");

  if (id) {
    id.value = "";
  }

  const title = document.getElementById("vehicleModalTitle");

  if (title) {
    title.textContent = "Tambah Kendaraan";
  }
}

/* =========================================
   EDIT KENDARAAN
========================================= */

function editKendaraan(id) {
  const kendaraan = getKendaraan();

  const item = kendaraan.find(
    (kendaraan) => Number(kendaraan.id) === Number(id),
  );

  if (!item) {
    return;
  }

  const vehicleId = document.getElementById("vehicleId");

  const polisi = document.getElementById("vehiclePolisi");

  const pelanggan = document.getElementById("vehiclePelanggan");

  const jenis = document.getElementById("vehicleJenis");

  const merk = document.getElementById("vehicleMerk");

  const keluhan = document.getElementById("vehicleKeluhan");

  const status = document.getElementById("vehicleStatus");

  const estimasi = document.getElementById("vehicleEstimasi");

  if (vehicleId) {
    vehicleId.value = item.id;
  }

  if (polisi) {
    polisi.value = item.polisi;
  }

  if (pelanggan) {
    pelanggan.value = item.pelanggan;
  }

  if (jenis) {
    jenis.value = item.jenis;
  }

  if (merk) {
    merk.value = item.merk;
  }

  if (keluhan) {
    keluhan.value = item.keluhan;
  }

  if (status) {
    status.value = item.status;
  }

  if (estimasi) {
    estimasi.value = item.estimasi;
  }

  const title = document.getElementById("vehicleModalTitle");

  if (title) {
    title.textContent = "Edit Kendaraan";
  }

  openModal("vehicleModal");
}

/* =========================================
   TAMBAH / SIMPAN / EDIT
========================================= */

function saveKendaraanForm(event) {
  event.preventDefault();

  const vehicleId = document.getElementById("vehicleId");

  const polisi = document.getElementById("vehiclePolisi");

  const pelanggan = document.getElementById("vehiclePelanggan");

  const jenis = document.getElementById("vehicleJenis");

  const merk = document.getElementById("vehicleMerk");

  const keluhan = document.getElementById("vehicleKeluhan");

  const status = document.getElementById("vehicleStatus");

  const estimasi = document.getElementById("vehicleEstimasi");

  if (
    !polisi ||
    !pelanggan ||
    !jenis ||
    !merk ||
    !keluhan ||
    !status ||
    !estimasi
  ) {
    console.error("Input kendaraan tidak ditemukan.");

    return;
  }

  const id = vehicleId ? vehicleId.value : "";

  const data = {
    polisi: polisi.value.trim(),

    pelanggan: pelanggan.value.trim(),

    jenis: jenis.value,

    merk: merk.value.trim(),

    keluhan: keluhan.value.trim(),

    status: status.value,

    estimasi: Number(estimasi.value) || 0,
  };

  /* VALIDASI */

  if (!data.polisi || !data.pelanggan || !data.jenis || !data.merk) {
    alert("Nomor polisi, pelanggan, jenis, dan merk wajib diisi.");

    return;
  }

  /* AMBIL DATA YANG SAMA */

  const kendaraan = getKendaraan();

  /* EDIT */

  if (id) {
    const index = kendaraan.findIndex((item) => Number(item.id) === Number(id));

    if (index !== -1) {
      kendaraan[index] = {
        ...kendaraan[index],

        ...data,
      };
    }
  } else {

  /* TAMBAH */
    const newId =
      kendaraan.length > 0
        ? Math.max(...kendaraan.map((item) => Number(item.id) || 0)) + 1
        : 1;

    kendaraan.push({
      id: newId,

      ...data,
    });
  }

  /* SIMPAN KE SUMBER DATA BERSAMA */

  saveKendaraan(kendaraan);

  /* TUTUP DAN RESET */

  closeModal("vehicleModal");

  resetKendaraanForm();

  /* REFRESH */

  updateDashboard();

  renderKendaraan(document.getElementById("searchKendaraan")?.value || "", 1);
}

/* =========================================
   HAPUS KENDARAAN
========================================= */

function deleteKendaraan(id) {
  const kendaraan = getKendaraan();

  const item = kendaraan.find(
    (kendaraan) => Number(kendaraan.id) === Number(id),
  );

  if (!item) {
    return;
  }

  const yakin = confirm(`Hapus kendaraan ${item.polisi}?`);

  if (!yakin) {
    return;
  }

  const dataBaru = kendaraan.filter(
    (kendaraan) => Number(kendaraan.id) !== Number(id),
  );

  saveKendaraan(dataBaru);

  updateDashboard();

  renderKendaraan(document.getElementById("searchKendaraan")?.value || "", 1);
}

/* =========================================
   DETAIL KENDARAAN
========================================= */

function showKendaraanDetail(id) {
  const kendaraan = getKendaraan();

  const item = kendaraan.find(
    (kendaraan) => Number(kendaraan.id) === Number(id),
  );

  if (!item) {
    return;
  }

  const content = document.getElementById("vehicleDetailContent");

  if (!content) {
    return;
  }

  const statusClass = getStatusClass(item.status);

  content.innerHTML = `

        <div class="detail-item">

            <span class="detail-label">
                No. Polisi
            </span>

            <span class="detail-value">
                ${escapeHTML(item.polisi)}
            </span>

        </div>


        <div class="detail-item">

            <span class="detail-label">
                Pelanggan
            </span>

            <span class="detail-value">
                ${escapeHTML(item.pelanggan)}
            </span>

        </div>


        <div class="detail-item">

            <span class="detail-label">
                Jenis
            </span>

            <span class="detail-value">
                ${escapeHTML(item.jenis)}
            </span>

        </div>


        <div class="detail-item">

            <span class="detail-label">
                Merk
            </span>

            <span class="detail-value">
                ${escapeHTML(item.merk)}
            </span>

        </div>


        <div class="detail-item full">

            <span class="detail-label">
                Keluhan
            </span>

            <span class="detail-value">
                ${escapeHTML(item.keluhan)}
            </span>

        </div>


        <div class="detail-item">

            <span class="detail-label">
                Status
            </span>

            <span
                class="badge ${statusClass}"
            >
                ${escapeHTML(item.status)}
            </span>

        </div>


        <div class="detail-item">

            <span class="detail-label">
                Estimasi Biaya
            </span>

            <span class="detail-value">
                ${formatRupiah(item.estimasi)}
            </span>

        </div>

    `;

  openModal("vehicleDetailModal");
}

/* =========================================
   INIT HALAMAN KENDARAAN
========================================= */

function initKendaraanPage() {
  const table = document.getElementById("kendaraanTable");

  /*
        Kalau bukan halaman kendaraan,
        jangan jalankan kode kendaraan.
    */

  if (!table) {
    return;
  }

  const search = document.getElementById("searchKendaraan");

  const tambah = document.getElementById("btnTambahKendaraan");

  const form = document.getElementById("vehicleForm");

  /* TAMPILKAN DATA */

  renderKendaraan();

  /* TOMBOL TAMBAH */

  if (tambah) {
    tambah.addEventListener("click", function () {
      resetKendaraanForm();

      openModal("vehicleModal");
    });
  }

  /* FORM */

  if (form) {
    form.addEventListener("submit", saveKendaraanForm);
  }

  /* SEARCH */

  if (search) {
    search.addEventListener("input", function () {
      renderKendaraan(this.value, 1);
    });
  }

  /* TOMBOL CLOSE */

  document.querySelectorAll("[data-close-modal]").forEach(function (button) {
    button.addEventListener("click", function () {
      closeModal(this.dataset.closeModal);
    });
  });

  /* KLIK DI LUAR MODAL */

  document.querySelectorAll(".modal-overlay").forEach(function (modal) {
    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        modal.classList.remove("show");
      }
    });
  });
}

/* =========================================
   START
========================================= */

document.addEventListener("DOMContentLoaded", function () {
  /*
            Semua halaman menggunakan
            fungsi dan data yang sama.
        */

  updateDashboard();

  renderMekanik();

  initKendaraanPage();
});
