# Aplikasi Pengaduan Sarana Sekolah

Aplikasi backend untuk mendukung proses input dan output pengaduan sarana sekolah. Terdiri dari dua fitur utama:
1. **Form Aspirasi Siswa** — siswa menyampaikan pengaduan/masukan terkait sarana dan prasarana sekolah.
2. **Umpan Balik Aspirasi** — admin memberikan umpan balik dan mengubah status penyelesaian.

---

## Fitur per Role

### Admin
- Melihat list aspirasi keseluruhan (filter: per tanggal, per bulan, per siswa, per kategori)
- Mengubah status penyelesaian (Menunggu → Proses → Selesai)
- Memberikan umpan balik pada aspirasi
- Melihat history aspirasi

### Siswa
- Melihat status penyelesaian aspirasi miliknya
- Melihat history aspirasi miliknya
- Melihat umpan balik dari admin
- Melihat progress perbaikan

---

## Phase 1: Database Schema

Update file `src/db/schema.ts`. Hapus tabel `users` yang ada, ganti dengan schema berikut.

### Tabel `admin`
| Kolom      | Tipe                              | Constraint                    |
|------------|-----------------------------------|-------------------------------|
| id         | int                               | primary key, auto increment   |
| nama       | varchar(255)                      | not null                      |
| email      | varchar(255)                      | not null, unique              |
| password   | varchar(255)                      | not null (bcrypt hash)        |
| created_at | timestamp                         | default current_timestamp     |

### Tabel `siswa`
| Kolom       | Tipe         | Constraint          |
|-------------|--------------|----------------------|
| nis         | int          | primary key          |
| nama_siswa  | varchar(255) | not null             |
| kelas       | varchar(10)  | not null             |
| password    | varchar(255) | not null (bcrypt hash) |
| created_at  | timestamp    | default current_timestamp |

> **Catatan**: Tambahkan kolom `password` dan `created_at` pada tabel siswa agar siswa bisa login.

### Tabel `kategori`
| Kolom        | Tipe         | Constraint                  |
|--------------|--------------|------------------------------|
| id_kategori  | int          | primary key, auto increment  |
| ket_kategori | varchar(255) | not null                     |

### Tabel `aspirasi`
| Kolom        | Tipe                                    | Constraint                  |
|--------------|-----------------------------------------|-----------------------------|
| id_aspirasi  | int                                     | primary key, auto increment |
| nis          | int                                     | not null, foreign key → siswa.nis |
| id_kategori  | int                                     | not null, foreign key → kategori.id_kategori |
| lokasi       | varchar(50)                             | not null                    |
| keterangan   | varchar(255)                            | not null                    |
| status       | enum("Menunggu", "Proses", "Selesai")   | default "Menunggu"          |
| feedback     | text                                    | nullable                    |
| created_at   | timestamp                               | default current_timestamp   |
| updated_at   | timestamp                               | default current_timestamp, on update |

> **Catatan**: Tabel `input_aspirasi` dan `aspirasi` dari spesifikasi awal digabung menjadi satu tabel `aspirasi` untuk kesederhanaan. Kolom `feedback` diubah dari integer ke text agar bisa menyimpan teks umpan balik.

### Relasi
- `aspirasi.nis` → `siswa.nis`
- `aspirasi.id_kategori` → `kategori.id_kategori`

Setelah schema selesai, jalankan `bun db:push` untuk push ke MySQL.

---

## Phase 2: Struktur Folder

Buat folder dan file berikut di dalam `src/`:

```
src/
├── index.ts                  # Entry point (sudah ada)
├── db/
│   ├── index.ts              # Koneksi database (sudah ada)
│   └── schema.ts             # Schema tabel (update)
├── routes/
│   ├── auth-routes.ts        # Login admin & siswa
│   ├── admin-routes.ts       # Endpoint khusus admin
│   └── siswa-routes.ts       # Endpoint khusus siswa
└── services/
    ├── auth-service.ts       # Logic autentikasi & token
    ├── admin-service.ts      # Logic admin (list, filter, feedback, status)
    └── siswa-service.ts      # Logic siswa (history, status)
```

---

## Phase 3: Autentikasi

Install dependency tambahan: `bcryptjs` dan `@elysiajs/jwt` (atau gunakan library JWT lain yang kompatibel Bun).

### POST `/api/auth/register`
Registrasi admin baru.

**Request body:**
```json
{
  "nama": "Akhyar Lubis",
  "email": "kh.mhdamin@gmail.com",
  "password": "rahasia"
}
```

**Response success (201):**
```json
{
  "data": "token-jwt-string"
}
```

**Response error (400):**
```json
{
  "error": "Email sudah terdaftar"
}
```

**Implementasi di `auth-service.ts`:**
1. Cek apakah email sudah ada di tabel `admin`
2. Hash password dengan bcrypt
3. Insert ke tabel `admin`
4. Generate JWT token berisi `{ id, email, role: "admin" }`
5. Return token

### POST `/api/auth/login`
Login untuk admin dan siswa.

**Request body (admin):**
```json
{
  "email": "kh.mhdamin@gmail.com",
  "password": "rahasia"
}
```

**Request body (siswa):**
```json
{
  "nis": 1234567890,
  "password": "rahasia"
}
```

**Response success (200):**
```json
{
  "data": "token-jwt-string"
}
```

**Response error (401):**
```json
{
  "error": "Email atau password salah"
}
```

**Implementasi di `auth-service.ts`:**
1. Jika request berisi `email` → cari di tabel `admin`, role = "admin"
2. Jika request berisi `nis` → cari di tabel `siswa`, role = "siswa"
3. Bandingkan password dengan bcrypt
4. Generate JWT token berisi `{ id/nis, role }`
5. Return token

---

## Phase 4: API Endpoints Admin

Semua endpoint admin harus diproteksi middleware JWT dan cek `role === "admin"`.

### GET `/api/admin/aspirasi`
List semua aspirasi dengan filter opsional.

**Query params (opsional):**
- `tanggal` — format YYYY-MM-DD
- `bulan` — format YYYY-MM
- `nis` — filter per siswa
- `kategori` — filter per id_kategori
- `status` — filter per status

**Response:** Array aspirasi beserta nama siswa dan nama kategori (join).

### PUT `/api/admin/aspirasi/:id/status`
Update status penyelesaian.

**Request body:**
```json
{
  "status": "Proses"
}
```

### PUT `/api/admin/aspirasi/:id/feedback`
Berikan umpan balik.

**Request body:**
```json
{
  "feedback": "Sudah diperbaiki, terima kasih atas laporannya"
}
```

---

## Phase 5: API Endpoints Siswa

Semua endpoint siswa harus diproteksi middleware JWT dan cek `role === "siswa"`.

### POST `/api/siswa/aspirasi`
Buat aspirasi baru.

**Request body:**
```json
{
  "id_kategori": 1,
  "lokasi": "Ruang kelas 10A",
  "keterangan": "AC tidak berfungsi"
}
```

`nis` diambil dari JWT token, bukan dari request body.

### GET `/api/siswa/aspirasi`
Lihat semua aspirasi milik siswa yang sedang login (berdasarkan NIS dari token).

**Response:** Array aspirasi beserta status, feedback, dan nama kategori.

### GET `/api/siswa/aspirasi/:id`
Lihat detail satu aspirasi (pastikan aspirasi milik siswa yang login).

---

## Phase 6: Seed Data Kategori

Buat file `src/db/seed.ts` untuk insert data awal kategori:

```
- Meja
- Kursi
- AC / Pendingin Ruangan
- Papan Tulis
- Proyektor
- Toilet
- Lainnya
```

Tambahkan script `"db:seed": "bun run src/db/seed.ts"` di `package.json`.

---

## Phase 7: Update Entry Point

Update `src/index.ts`:
1. Import semua route modules
2. Register routes dengan `app.use()`
3. Pastikan semua route menggunakan prefix `/api`

---

## Urutan Pengerjaan

1. Update schema → push ke database
2. Buat `auth-service.ts` + `auth-routes.ts` → test register & login
3. Buat `admin-service.ts` + `admin-routes.ts` → test endpoint admin
4. Buat `siswa-service.ts` + `siswa-routes.ts` → test endpoint siswa
5. Seed data kategori
6. Test keseluruhan flow
