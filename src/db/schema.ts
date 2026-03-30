import {
  int,
  mysqlTable,
  varchar,
  timestamp,
  mysqlEnum,
  text,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

export const admin = mysqlTable("admin", {
  id: int("id").primaryKey().autoincrement(),
  nama: varchar("nama", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const siswa = mysqlTable("siswa", {
  nis: int("nis").primaryKey(),
  namaSiswa: varchar("nama_siswa", { length: 255 }).notNull(),
  kelas: varchar("kelas", { length: 10 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const kategori = mysqlTable("kategori", {
  idKategori: int("id_kategori").primaryKey().autoincrement(),
  ketKategori: varchar("ket_kategori", { length: 255 }).notNull(),
});

export const aspirasi = mysqlTable("aspirasi", {
  idAspirasi: int("id_aspirasi").primaryKey().autoincrement(),
  nis: int("nis").notNull(),
  idKategori: int("id_kategori").notNull(),
  lokasi: varchar("lokasi", { length: 50 }).notNull(),
  keterangan: varchar("keterangan", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["Menunggu", "Proses", "Selesai"])
    .default("Menunggu")
    .notNull(),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Relations
export const siswaRelations = relations(siswa, ({ many }) => ({
  aspirasi: many(aspirasi),
}));

export const kategoriRelations = relations(kategori, ({ many }) => ({
  aspirasi: many(aspirasi),
}));

export const aspirasiRelations = relations(aspirasi, ({ one }) => ({
  siswa: one(siswa, {
    fields: [aspirasi.nis],
    references: [siswa.nis],
  }),
  kategori: one(kategori, {
    fields: [aspirasi.idKategori],
    references: [kategori.idKategori],
  }),
}));
