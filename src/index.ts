import { Elysia } from "elysia";
import { authRoutes } from "./routes/auth-routes";
import { adminRoutes } from "./routes/admin-routes";
import { siswaRoutes } from "./routes/siswa-routes";

const app = new Elysia()
  .use(authRoutes)
  .use(adminRoutes)
  .use(siswaRoutes)
  .get("/", () => ({ message: "Aplikasi Pengaduan Sarana Sekolah" }))
  .onError(({ code, error }) => {
    return { error: error.message, code };
  })
  .listen(3000);

console.log(`Server running at http://localhost:${app.server?.port}`);
