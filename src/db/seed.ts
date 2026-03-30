import { db } from "./index";
import { kategori } from "./schema";

const data = [
  "Meja",
  "Kursi",
  "AC / Pendingin Ruangan",
  "Papan Tulis",
  "Proyektor",
  "Toilet",
  "Lainnya",
];

async function seed() {
  console.log("Seeding kategori...");

  for (const ket of data) {
    await db.insert(kategori).values({ ketKategori: ket });
  }

  console.log(`Berhasil insert ${data.length} kategori.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
