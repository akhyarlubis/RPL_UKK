import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { registerAdmin, loginAdmin, loginSiswa } from "../services/auth-service";

export const authRoutes = new Elysia({ prefix: "/api/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET ?? "super-secret-key",
    })
  )
  .post(
    "/register",
    async ({ body, jwt }) => {
      try {
        const user = await registerAdmin(body.nama, body.email, body.password);
        const token = await jwt.sign({
          id: String(user.id),
          email: user.email,
          role: user.role,
        });
        return { data: token };
      } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    },
    {
      body: t.Object({
        nama: t.String(),
        email: t.String(),
        password: t.String(),
      }),
    }
  )
  .post(
    "/login",
    async ({ body, jwt }) => {
      try {
        if ("email" in body && body.email) {
          const user = await loginAdmin(body.email, body.password);
          const token = await jwt.sign({
            id: String(user.id),
            role: user.role,
          });
          return { data: token };
        }

        if ("nis" in body && body.nis) {
          const user = await loginSiswa(body.nis, body.password);
          const token = await jwt.sign({
            nis: String(user.nis),
            role: user.role,
          });
          return { data: token };
        }

        return new Response(
          JSON.stringify({ error: "Harap isi email atau nis" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
    },
    {
      body: t.Object({
        email: t.Optional(t.String()),
        nis: t.Optional(t.Number()),
        password: t.String(),
      }),
    }
  );
