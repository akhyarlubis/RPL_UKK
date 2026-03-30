import { Elysia } from "elysia";

const app = new Elysia()
  .get("/", () => ({ message: "Hello, World!" }))
  .onError(({ code, error }) => {
    return { error: error.message, code };
  })
  .listen(3000);

console.log(`Server running at http://localhost:${app.server?.port}`);
