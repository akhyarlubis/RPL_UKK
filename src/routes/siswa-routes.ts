import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import {
  createAspirasi,
  getAspirasiByNis,
  getAspirasiDetail,
} from "../services/siswa-service";

export const siswaRoutes = new Elysia({ prefix: "/api/siswa" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET ?? "super-secret-key",
    })
  )
  .derive(async ({ jwt, headers }) => {
    const auth = headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      throw new Error("Unauthorized");
    }

    const token = auth.slice(7);
    const payload = await jwt.verify(token);

    if (!payload || payload.role !== "siswa") {
      throw new Error("Forbidden: siswa only");
    }

    return { user: payload };
  })
  .onError(({ error }) => {
    if (error.message === "Unauthorized" || error.message === "Forbidden: siswa only") {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.message === "Unauthorized" ? 401 : 403,
        headers: { "Content-Type": "application/json" },
      });
    }
  })
  .post(
    "/aspirasi",
    async ({ body, user }) => {
      try {
        const data = await createAspirasi(
          Number(user.nis),
          body.id_kategori,
          body.lokasi,
          body.keterangan
        );
        return { data };
      } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    },
    {
      body: t.Object({
        id_kategori: t.Number(),
        lokasi: t.String(),
        keterangan: t.String(),
      }),
    }
  )
  .get("/aspirasi", async ({ user }) => {
    const data = await getAspirasiByNis(Number(user.nis));
    return { data };
  })
  .get(
    "/aspirasi/:id",
    async ({ params, user }) => {
      try {
        const data = await getAspirasiDetail(
          Number(params.id),
          Number(user.nis)
        );
        return { data };
      } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
    },
    {
      params: t.Object({ id: t.String() }),
    }
  );
