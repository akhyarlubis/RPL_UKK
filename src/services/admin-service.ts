import { db } from "../db";
import { aspirasi, siswa, kategori } from "../db/schema";
import { eq, and, between, like, sql } from "drizzle-orm";

interface AspirasiFilter {
  tanggal?: string;
  bulan?: string;
  nis?: number;
  kategori?: number;
  status?: "Menunggu" | "Proses" | "Selesai";
}

export async function getAspirasiList(filter: AspirasiFilter) {
  const conditions = [];

  if (filter.nis) {
    conditions.push(eq(aspirasi.nis, filter.nis));
  }

  if (filter.kategori) {
    conditions.push(eq(aspirasi.idKategori, filter.kategori));
  }

  if (filter.status) {
    conditions.push(eq(aspirasi.status, filter.status));
  }

  if (filter.tanggal) {
    const start = new Date(`${filter.tanggal}T00:00:00`);
    const end = new Date(`${filter.tanggal}T23:59:59`);
    conditions.push(between(aspirasi.createdAt, start, end));
  }

  if (filter.bulan) {
    const [year, month] = filter.bulan.split("-").map(Number);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);
    conditions.push(between(aspirasi.createdAt, start, end));
  }

  const rows = await db
    .select({
      idAspirasi: aspirasi.idAspirasi,
      nis: aspirasi.nis,
      namaSiswa: siswa.namaSiswa,
      idKategori: aspirasi.idKategori,
      ketKategori: kategori.ketKategori,
      lokasi: aspirasi.lokasi,
      keterangan: aspirasi.keterangan,
      status: aspirasi.status,
      feedback: aspirasi.feedback,
      createdAt: aspirasi.createdAt,
      updatedAt: aspirasi.updatedAt,
    })
    .from(aspirasi)
    .leftJoin(siswa, eq(aspirasi.nis, siswa.nis))
    .leftJoin(kategori, eq(aspirasi.idKategori, kategori.idKategori))
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  return rows;
}

export async function updateStatus(
  idAspirasi: number,
  status: "Menunggu" | "Proses" | "Selesai"
) {
  const result = await db
    .update(aspirasi)
    .set({ status })
    .where(eq(aspirasi.idAspirasi, idAspirasi));

  if (result[0].affectedRows === 0) {
    throw new Error("Aspirasi tidak ditemukan");
  }

  return { idAspirasi, status };
}

export async function updateFeedback(idAspirasi: number, feedback: string) {
  const result = await db
    .update(aspirasi)
    .set({ feedback })
    .where(eq(aspirasi.idAspirasi, idAspirasi));

  if (result[0].affectedRows === 0) {
    throw new Error("Aspirasi tidak ditemukan");
  }

  return { idAspirasi, feedback };
}
