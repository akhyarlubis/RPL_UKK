import { db } from "../db";
import { aspirasi, siswa, kategori } from "../db/schema";
import { eq, and } from "drizzle-orm";

export async function createAspirasi(
  nis: number,
  idKategori: number,
  lokasi: string,
  keterangan: string
) {
  const result = await db.insert(aspirasi).values({
    nis,
    idKategori,
    lokasi,
    keterangan,
  });

  return { idAspirasi: result[0].insertId };
}

export async function getAspirasiByNis(nis: number) {
  const rows = await db
    .select({
      idAspirasi: aspirasi.idAspirasi,
      lokasi: aspirasi.lokasi,
      keterangan: aspirasi.keterangan,
      status: aspirasi.status,
      feedback: aspirasi.feedback,
      ketKategori: kategori.ketKategori,
      createdAt: aspirasi.createdAt,
      updatedAt: aspirasi.updatedAt,
    })
    .from(aspirasi)
    .leftJoin(kategori, eq(aspirasi.idKategori, kategori.idKategori))
    .where(eq(aspirasi.nis, nis));

  return rows;
}

export async function getAspirasiDetail(idAspirasi: number, nis: number) {
  const rows = await db
    .select({
      idAspirasi: aspirasi.idAspirasi,
      nis: aspirasi.nis,
      lokasi: aspirasi.lokasi,
      keterangan: aspirasi.keterangan,
      status: aspirasi.status,
      feedback: aspirasi.feedback,
      ketKategori: kategori.ketKategori,
      createdAt: aspirasi.createdAt,
      updatedAt: aspirasi.updatedAt,
    })
    .from(aspirasi)
    .leftJoin(kategori, eq(aspirasi.idKategori, kategori.idKategori))
    .where(and(eq(aspirasi.idAspirasi, idAspirasi), eq(aspirasi.nis, nis)));

  if (rows.length === 0) {
    throw new Error("Aspirasi tidak ditemukan");
  }

  return rows[0];
}
