import { db } from "../db";
import { admin, siswa } from "../db/schema";
import { eq } from "drizzle-orm";
import { hash, compare } from "bcryptjs";

export async function registerAdmin(
  nama: string,
  email: string,
  password: string
) {
  const existing = await db
    .select()
    .from(admin)
    .where(eq(admin.email, email))
    .limit(1);

  if (existing.length > 0) {
    throw new Error("Email sudah terdaftar");
  }

  const hashed = await hash(password, 10);

  const result = await db.insert(admin).values({
    nama,
    email,
    password: hashed,
  });

  return { id: result[0].insertId, email, role: "admin" as const };
}

export async function loginAdmin(email: string, password: string) {
  const rows = await db
    .select()
    .from(admin)
    .where(eq(admin.email, email))
    .limit(1);

  if (rows.length === 0) {
    throw new Error("Email atau password salah");
  }

  const user = rows[0];
  const valid = await compare(password, user.password);

  if (!valid) {
    throw new Error("Email atau password salah");
  }

  return { id: user.id, email: user.email, role: "admin" as const };
}

export async function loginSiswa(nis: number, password: string) {
  const rows = await db
    .select()
    .from(siswa)
    .where(eq(siswa.nis, nis))
    .limit(1);

  if (rows.length === 0) {
    throw new Error("NIS atau password salah");
  }

  const user = rows[0];
  const valid = await compare(password, user.password);

  if (!valid) {
    throw new Error("NIS atau password salah");
  }

  return { nis: user.nis, nama: user.namaSiswa, role: "siswa" as const };
}
