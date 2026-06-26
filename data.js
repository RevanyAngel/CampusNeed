/**
 * data.js — CampusNeed Landing Page Data
 * ============================================================
 * Semua data konten landing page. Tanpa emoji — menggunakan SVG icons.
 * ============================================================
 */

// SVG Icons for landing page sections
const LandingIcons = {
  money: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  box: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  alert: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  id: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>',
  bank: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><path d="M12 2L2 7h20L12 2z"/><path d="M2 7v10h20V7"/><line x1="6" y1="11" x2="6" y2="14"/><line x1="12" y1="11" x2="12" y2="14"/><line x1="18" y1="11" x2="18" y2="14"/><path d="M2 17h20v2H2z"/></svg>',
  lock: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  scale: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="3" x2="12" y2="21"/><polyline points="8 8 4 4"/><polyline points="16 8 20 4"/><path d="M4 4l4 8a6 6 0 0 0 8 0l4-8"/></svg>',
  mapPin: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  shield: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  refresh: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
  search: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  handshake: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  key: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>',
  recycle: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
};

// -------------------------------------------------------
// DATA: Listing contoh di Hero Card (sisi kanan hero)
// -------------------------------------------------------
const heroListings = [
  {
    icon: LandingIcons.key,
    type: "rent",
    name: "Kamera DSLR Canon",
    sub: "Jarak 200m - Terverifikasi KTM",
    price: "Rp45rb/hari",
    tag: "SEWA",
    tagClass: "tag-rent",
  },
  {
    icon: LandingIcons.recycle,
    type: "sell",
    name: "Meja Belajar Portable",
    sub: "Kondisi Good - Jarak 300m",
    price: "Rp85rb",
    tag: "JUAL",
    tagClass: "tag-sell",
  },
  {
    icon: LandingIcons.key,
    type: "rent",
    name: "Laptop Asus VivoBook",
    sub: "Jarak 500m - Deposit Aman",
    price: "Rp80rb/hari",
    tag: "SEWA",
    tagClass: "tag-rent",
  },
];

// -------------------------------------------------------
// DATA: Mini statistik
// -------------------------------------------------------
const heroStats = [
  { num: "2x",  label: "Transaksi/tahun per mahasiswa" },
  { num: "0%",  label: "Ongkir, COD di kampus" },
];

// -------------------------------------------------------
// DATA: Section Masalah
// -------------------------------------------------------
const problems = [
  {
    icon: LandingIcons.money,
    iconClass: "p1",
    title: "Perangkat Mahal, Dipakai Sekali",
    desc: "Kamera DSLR, tripod, jas sidang, kebaya wisuda — harga beli mahal tapi frekuensi pakai sangat rendah. Belanja barang untuk sekali pakai jelas pemborosan.",
  },
  {
    icon: LandingIcons.box,
    iconClass: "p2",
    title: "Barang Kos Numpuk Saat Lulus",
    desc: "Dispenser, kasur lipat, meja belajar — susah dibawa pulang, dijual murah ke pengepul. Padahal mahasiswa baru sangat butuh barang-barang ini!",
  },
  {
    icon: LandingIcons.alert,
    iconClass: "p3",
    title: "Transaksi Informal Rawan Tipu",
    desc: "Jual-beli di grup WhatsApp dan menfess Twitter tidak ada jaminan keamanan. Uang sudah transfer, barang tidak datang — tidak ada pihak yang bisa diminta pertanggungjawaban.",
  },
];

// -------------------------------------------------------
// DATA: Section Fitur — Modul Rent
// -------------------------------------------------------
const rentFeatures = [
  "Katalog berbasis radius lokasi kampus",
  "Kalkulator tarif per jam/hari/minggu otomatis",
  "Sistem deposit jaminan via Escrow",
  "Kalender reservasi untuk cegah double booking",
  "OTP konfirmasi saat serah terima barang",
];

// -------------------------------------------------------
// DATA: Section Fitur — Modul Sell (Preloved)
// -------------------------------------------------------
const sellFeatures = [
  "Katalog barang kos bekas layak pakai",
  "Label kondisi transparan (Like New/Good/Fair)",
  "Tombol \"Amankan Barang\" cegah double buyer",
  "Dana escrow — aman sebelum barang diterima",
  "COD di kampus atau kurir instan lokal",
];

// -------------------------------------------------------
// DATA: Section Keamanan
// -------------------------------------------------------
const securityFeatures = [
  {
    icon: LandingIcons.id,
    title: "Double KYC — KTM + KTP",
    desc: "Setiap pengguna wajib verifikasi Kartu Tanda Mahasiswa aktif dan KTP. Identitas ganda ini menciptakan akuntabilitas nyata — pelanggar menghadapi sanksi akademik langsung.",
  },
  {
    icon: LandingIcons.bank,
    title: "Rekening Bersama (Escrow)",
    desc: "Dana sewa, deposit jaminan, dan harga jual ditahan platform selama transaksi berlangsung. Dana hanya cair ke pemilik setelah barang dikonfirmasi diterima dengan kondisi baik.",
  },
  {
    icon: LandingIcons.lock,
    title: "Validasi OTP Serah Terima",
    desc: "Kode OTP diberikan penyewa ke pemilik saat COD sebagai bukti digital bahwa barang sudah diterima dalam kondisi sesuai. Ini memicu pencairan dana secara otomatis.",
  },
  {
    icon: LandingIcons.scale,
    title: "Mediasi Sengketa Komunitas",
    desc: "Jika terjadi kerusakan atau ketidaksesuaian, platform memfasilitasi klaim deposit secara adil. Pelanggaran terbukti berujung sanksi administratif di tingkat akademik kampus.",
  },
];

// -------------------------------------------------------
// DATA: Section USP (Keunggulan Kompetitif)
// -------------------------------------------------------
const uspItems = [
  {
    num: "01",
    icon: LandingIcons.mapPin,
    title: "Hyperlocal Discovery — Zero Ongkir",
    desc: "Pencarian berbasis radius kampus. Semua transaksi COD langsung di area kampus — tidak ada ongkos kirim, tidak ada menunggu 2 hari pengiriman. Butuh kamera besok? Dapat hari ini.",
  },
  {
    num: "02",
    icon: LandingIcons.shield,
    title: "Double KYC — Trust Berbasis Komunitas",
    desc: "Satu-satunya platform yang mempertaruhkan status akademis sebagai jaminan. Ketika identitas kampus dipakai, akuntabilitas menjadi nyata — bukan sekadar username anonim.",
  },
  {
    num: "03",
    icon: LandingIcons.refresh,
    title: "Ekosistem Sirkular Terintegrasi",
    desc: "Satu dasbor untuk Rent dan Preloved. Barang yang dibeli maba bisa disewakan saat menganggur, lalu dijual saat lulus — perputaran nilai guna maksimal, limbah minimum.",
  },
];

// -------------------------------------------------------
// DATA: Section Alur / Cara Kerja
// -------------------------------------------------------
const flowSteps = [
  {
    icon: LandingIcons.id,
    title: "Daftar & Verifikasi",
    desc: "Upload KTM aktif dan KTP untuk mendapatkan akses penuh platform",
  },
  {
    icon: LandingIcons.search,
    title: "Cari atau Unggah",
    desc: "Cari barang di sekitar kampus atau unggah aset yang ingin disewakan/dijual",
  },
  {
    icon: LandingIcons.bank,
    title: "Bayar via Escrow",
    desc: "Pembayaran aman ditahan platform hingga kedua pihak konfirmasi transaksi",
  },
  {
    icon: LandingIcons.handshake,
    title: "COD & OTP Selesai",
    desc: "Ketemu di kampus, cek barang, input OTP — dana otomatis cair ke pemilik",
  },
];

// -------------------------------------------------------
// DATA: Section Tim
// -------------------------------------------------------
const teamMembers = [
  {
    initials: "AA",
    avatarColor: "",
    name: "Aprillia Anung Anindhita",
    nim: "11230910000057",
    prodi: "Teknik Informatika",
    fakultas: "Fakultas Sains dan Teknologi",
    univ: "UIN Syarif Hidayatullah Jakarta",
    image: "images/aprilia.jpeg",
  },
  {
    initials: "RA",
    avatarColor: "var(--blue-500)",
    name: "Revany Angel Pursan Septriariel",
    nim: "11230910000066",
    prodi: "Teknik Informatika",
    fakultas: "Fakultas Sains dan Teknologi",
    univ: "UIN Syarif Hidayatullah Jakarta",
    image: "images/revany.jpg",
  },
];

// -------------------------------------------------------
// DATA: Footer & Info Akademik
// -------------------------------------------------------
const footerInfo = {
  brandName: "CampusNeed",
  year: "2026",
  tagline: "Platform Sewa & Jual Barang Mahasiswa Indonesia",
  kontakEmail: "campusneed@example.com",
};
