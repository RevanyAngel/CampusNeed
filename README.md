# CampusNeed — Struktur Proyek

## 📁 File yang Ada

```
campusneed/
├── index.html   ← Kerangka HTML (struktur halaman)
├── style.css    ← Semua tampilan / desain
├── data.js      ← Semua teks & konten yang tampil di website
├── main.js      ← Logika JavaScript (render + interaksi)
└── README.md    ← Panduan ini
```

---

## 🎯 Mau ngapain, edit file mana?

| Tujuan | File |
|---|---|
| Ganti teks, harga, nama anggota, isi konten | **data.js** |
| Ganti warna, font, ukuran, jarak antar elemen | **style.css** |
| Tambah animasi, fitur baru, interaksi tombol | **main.js** |
| Tambah section baru / ubah urutan halaman | **index.html** |

---

## 🔧 Cara Pakai

### Ganti warna brand
Buka `style.css`, cari bagian `:root` di paling atas:
```css
:root {
  --navy:   #003366;   /* ← warna biru utama */
  --orange: #FF823A;   /* ← warna oranye aksen */
}
```
Ubah nilai hex-nya, semua elemen yang pakai warna ini otomatis ikut berubah.

---

### Tambah anggota tim baru
Buka `data.js`, cari `const teamMembers`, tambahkan objek baru:
```js
{
  initials: "AB",
  avatarColor: "",          // kosong = navy, atau isi warna lain
  name: "Nama Lengkap",
  nim: "1234567890",
  prodi: "Teknik Informatika",
  fakultas: "Fakultas Sains dan Teknologi",
  univ: "UIN Syarif Hidayatullah Jakarta",
},
```

---

### Tambah listing di hero card
Buka `data.js`, cari `const heroListings`, tambahkan objek:
```js
{
  icon: "📱",
  type: "rent",            // "rent" atau "sell"
  name: "Nama Barang",
  sub: "Keterangan singkat",
  price: "Rp50rb/hari",
  tag: "SEWA",
  tagClass: "tag-rent",    // "tag-rent" atau "tag-sell"
},
```

---

### Tambah section baru
1. Buat HTML-nya di `index.html` (salin struktur section yang sudah ada)
2. Tambah CSS-nya di `style.css` (dengan komentar penanda yang jelas)
3. Kalau perlu data dinamis, tambah di `data.js` dan render function-nya di `main.js`

---

## 🚀 Cara Jalankan
Cukup buka `index.html` di browser. Tidak perlu server atau install apapun.

Kalau mau pakai live reload saat development, bisa pakai ekstensi
**Live Server** di VS Code.
