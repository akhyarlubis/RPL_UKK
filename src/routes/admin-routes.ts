import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import {
  getAspirasiList,
  updateStatus,
  updateFeedback,
} from "../services/admin-service";

export const adminRoutes = new Elysia({ prefix: "/api/admin" })
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

    if (!payload || payload.role !== "admin") {
      throw new Error("Forbidden: admin only");
    }

    return { user: payload };
  })
  .onError(({ error }) => {
    if (error.message === "Unauthorized" || error.message === "Forbidden: admin only") {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.message === "Unauthorized" ? 401 : 403,
        headers: { "Content-Type": "application/json" },
      });
    }
  })
  .get(
    "/aspirasi",
    async ({ query }) => {
      const filter = {
        tanggal: query.tanggal,
        bulan: query.bulan,
        nis: query.nis ? Number(query.nis) : undefined,
        kategori: query.kategori ? Number(query.kategori) : undefined,
        status: query.status as "Menunggu" | "Proses" | "Selesai" | undefined,
      };
      const data = await getAspirasiList(filter);
      return { data };
    },
    {
      query: t.Object({
        tanggal: t.Optional(t.String()),
        bulan: t.Optional(t.String()),
        nis: t.Optional(t.String()),
        kategori: t.Optional(t.String()),
        status: t.Optional(t.String()),
      }),
    }
  )
  .put(
    "/aspirasi/:id/status",
    async ({ params, body }) => {
      try {
        const data = await updateStatus(Number(params.id), body.status);
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
      body: t.Object({
        status: t.Union([
          t.Literal("Menunggu"),
          t.Literal("Proses"),
          t.Literal("Selesai"),
        ]),
      }),
    }
  )
  .put(
    "/aspirasi/:id/feedback",
    async ({ params, body }) => {
      try {
        const data = await updateFeedback(Number(params.id), body.feedback);
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
      body: t.Object({
        feedback: t.String(),
      }),
    }
  );
