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
        estimasi: 350000
    },

    {
        id: 2,
        polisi: "N 2456 AB",
        jenis: "Motor",
        merk: "Honda",
        pelanggan: "Budi",
        keluhan: "Servis Mesin",
        status: "Menunggu",
        estimasi: 250000
    },

    {
        id: 3,
        polisi: "B 7788 CD",
        jenis: "Mobil",
        merk: "Honda",
        pelanggan: "Rizky",
        keluhan: "Ganti Rem",
        status: "Quality Check",
        estimasi: 750000
    },

    {
        id: 4,
        polisi: "L 4567 EF",
        jenis: "Mobil",
        merk: "Daihatsu",
        pelanggan: "Fajar",
        keluhan: "Tune Up",
        status: "Selesai",
        estimasi: 500000
    }
];


const defaultMekanik = [
    {
        id: 1,
        nama: "Asep",
        spesialisasi: "Mobil",
        status: "Aktif"
    },

    {
        id: 2,
        nama: "Budi",
        spesialisasi: "Motor",
        status: "Aktif"
    },

    {
        id: 3,
        nama: "Rizky",
        spesialisasi: "Mesin",
        status: "Izin"
    }
];


/* =========================================
   LOCAL STORAGE
========================================= */

function getKendaraan() {

    const data = localStorage.getItem("workshop_kendaraan");

    if (!data) {

        localStorage.setItem(
            "workshop_kendaraan",
            JSON.stringify(defaultKendaraan)
        );

        return defaultKendaraan;
    }

    try {

        return JSON.parse(data);

    } catch (error) {

        console.error("Data kendaraan rusak:", error);

        localStorage.setItem(
            "workshop_kendaraan",
            JSON.stringify(defaultKendaraan)
        );

        return defaultKendaraan;
    }
}


function getMekanik() {

    const data = localStorage.getItem("workshop_mekanik");

    if (!data) {

        localStorage.setItem(
            "workshop_mekanik",
            JSON.stringify(defaultMekanik)
        );

        return defaultMekanik;
    }

    try {

        return JSON.parse(data);

    } catch (error) {

        console.error("Data mekanik rusak:", error);

        localStorage.setItem(
            "workshop_mekanik",
            JSON.stringify(defaultMekanik)
        );

        return defaultMekanik;
    }
}


/* =========================================
   SIMPAN DATA
========================================= */

function saveKendaraan(data) {

    localStorage.setItem(
        "workshop_kendaraan",
        JSON.stringify(data)
    );
}


function saveMekanik(data) {

    localStorage.setItem(
        "workshop_mekanik",
        JSON.stringify(data)
    );
}


/* =========================================
   FORMAT RUPIAH
========================================= */

function formatRupiah(value) {

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(value);

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
   STATISTIK
========================================= */

function updateDashboard() {

    const kendaraan = getKendaraan();

    const menunggu = kendaraan.filter(
        item => item.status === "Menunggu"
    ).length;

    const dikerjakan = kendaraan.filter(
        item => item.status === "Dikerjakan"
    ).length;

    const qc = kendaraan.filter(
        item => item.status === "Quality Check"
    ).length;

    const selesai = kendaraan.filter(
        item => item.status === "Selesai"
    ).length;


    const pendapatan = kendaraan.reduce(
        (total, item) => total + Number(item.estimasi || 0),
        0
    );


    setText("totalKendaraan", kendaraan.length);
    setText("totalMenunggu", menunggu);
    setText("totalDikerjakan", dikerjakan);
    setText("totalQC", qc);
    setText("totalSelesai", selesai);

    setText(
        "totalPendapatan",
        formatRupiah(pendapatan)
    );


    setText(
        "totalServiceCircle",
        kendaraan.length
    );

    setText(
        "circleMenunggu",
        menunggu
    );

    setText(
        "circleDikerjakan",
        dikerjakan
    );

    setText(
        "circleQC",
        qc
    );

    setText(
        "circleSelesai",
        selesai
    );
}


function setText(id, value) {

    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }

}


/* =========================================
   TABEL KENDARAAN
========================================= */

function renderKendaraan(search = "") {

    const table = document.getElementById(
        "kendaraanTable"
    );

    if (!table) {
        return;
    }


    const kendaraan = getKendaraan();


    const hasil = kendaraan.filter(item => {

        const keyword = search.toLowerCase();

        return (
            item.polisi.toLowerCase().includes(keyword) ||
            item.merk.toLowerCase().includes(keyword) ||
            item.pelanggan.toLowerCase().includes(keyword) ||
            item.keluhan.toLowerCase().includes(keyword)
        );

    });


    table.innerHTML = "";


    if (hasil.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center">
                    Tidak ada data kendaraan
                </td>
            </tr>
        `;

        return;
    }


    hasil.forEach((item, index) => {

        const statusClass = getStatusClass(
            item.status
        );


        table.innerHTML += `
            <tr>

                <td>${index + 1}</td>

                <td>
                    <strong>${item.polisi}</strong>
                </td>

                <td>${item.jenis}</td>

                <td>${item.merk}</td>

                <td>${item.pelanggan}</td>

                <td>${item.keluhan}</td>

                <td>
                    <span class="badge ${statusClass}">
                        ${item.status}
                    </span>
                </td>

            </tr>
        `;

    });

}


/* =========================================
   TABEL MEKANIK
========================================= */

function renderMekanik() {

    const table = document.getElementById(
        "mekanikTable"
    );

    if (!table) {
        return;
    }


    const mekanik = getMekanik();


    table.innerHTML = "";


    mekanik.forEach((item, index) => {

        table.innerHTML += `
            <tr>

                <td>${index + 1}</td>

                <td>
                    <strong>${item.nama}</strong>
                </td>

                <td>${item.spesialisasi}</td>

                <td>${item.status}</td>

            </tr>
        `;

    });

}


/* =========================================
   SEARCH
========================================= */

function setupSearch() {

    const search = document.getElementById(
        "searchKendaraan"
    );

    if (!search) {
        return;
    }


    search.addEventListener(
        "input",
        function () {

            renderKendaraan(
                this.value
            );

        }
    );

}


/* =========================================
   START
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateDashboard();

        renderKendaraan();

        renderMekanik();

        setupSearch();

    }
);