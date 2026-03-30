import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { authRoutes } from "./routes/auth-routes";
import { adminRoutes } from "./routes/admin-routes";
import { siswaRoutes } from "./routes/siswa-routes";
import { db } from "./db";
import { kategori } from "./db/schema";

const app = new Elysia()
  .use(staticPlugin({ prefix: "/", assets: "public" }))
  .use(authRoutes)
  .use(adminRoutes)
  .use(siswaRoutes)
  .get("/api/kategori", async () => {
    const data = await db.select().from(kategori);
    return { data };
  })
  .get("/", () => Bun.file("public/login.html"))
  .onError(({ code, error }) => {
    return { error: error.message, code };
  })
  .listen(3000);

console.log(`Server running at http://localhost:${app.server?.port}`);
