# Pengembangan Aplikasi Pengaduan Sarana Sekolah

Proyek ini dibuat untuk Ujian Kompetensi Keahlian (UKK) Tahun Pelajaran 2025/2026 pada jenjang SMK.

## Informasi UKK

- Bidang: Soal Praktikum Kejuruan
- Konsentrasi Keahlian: Rekayasa Perangkat Lunak
- Kode: KM25.4.1.1

## Nama Aplikasi

Pengembangan Aplikasi Pengaduan Sarana Sekolah

## Deskripsi Aplikasi

Aplikasi ini merupakan sistem berbasis web untuk memfasilitasi pelaporan pengaduan sarana dan prasarana sekolah secara terstruktur. Siswa dapat menyampaikan laporan terkait kondisi fasilitas sekolah, sementara admin dapat memantau laporan, memperbarui status penanganan, dan memberikan umpan balik. Dengan aplikasi ini, proses penanganan pengaduan menjadi lebih cepat, transparan, dan terdokumentasi dengan baik.

## Fitur

### Fitur Admin

- Registrasi dan login admin
- Melihat daftar aspirasi/pengaduan
- Memperbarui status penanganan aspirasi
- Memberikan umpan balik (feedback) pada aspirasi siswa

### Fitur Siswa

- Registrasi dan login siswa menggunakan NIS
- Mengirim aspirasi/pengaduan sarana sekolah
- Melihat riwayat aspirasi milik sendiri
- Melihat status progres penanganan aspirasi
- Melihat umpan balik dari admin

### Fitur Sistem

- Autentikasi berbasis JWT
- Proteksi endpoint berdasarkan role (admin/siswa)
- Penyimpanan data menggunakan MySQL dengan Drizzle ORM
- Halaman frontend untuk login, register, admin, dan siswa

## Cara Menjalankan

### 1. Prasyarat

- Bun terpasang di komputer
- MySQL aktif dan dapat diakses

### 2. Clone dan masuk ke folder project

```bash
git clone https://github.com/akhyarlubis/RPL_UKK.git
cd RPL_UKK
```

### 3. Install dependency

```bash
bun install
```

### 4. Konfigurasi database

Sesuaikan koneksi database pada environment atau pengaturan koneksi yang digunakan project:

- DB_HOST
- DB_PORT
- DB_USER
- DB_PASSWORD
- DB_NAME

### 5. Push schema database

```bash
bun db:push
```

### 6. (Opsional) Seed data kategori

```bash
bun db:seed
```

### 7. Jalankan aplikasi

```bash
bun run src/index.ts
```

Server akan berjalan secara lokal dan dapat diakses melalui browser.

## Struktur Proyek

```text
RPL_UKK/
|-- public/
|   |-- admin.html
|   |-- login.html
|   |-- register.html
|   |-- register-siswa.html
|   `-- siswa.html
|-- src/
|   |-- index.ts
|   |-- db/
|   |   |-- index.ts
|   |   |-- schema.ts
|   |   `-- seed.ts
|   |-- routes/
|   |   |-- admin-routes.ts
|   |   |-- auth-routes.ts
|   |   `-- siswa-routes.ts
|   `-- services/
|       |-- admin-service.ts
|       |-- auth-service.ts
|       `-- siswa-service.ts
|-- drizzle.config.ts
|-- package.json
|-- tsconfig.json
`-- README.md
```
