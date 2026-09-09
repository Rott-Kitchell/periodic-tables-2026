import app from "./app.js";

if (process.env.NODE_ENV !== "production") {
  const { serve } = await import("@hono/node-server");
  const port = Number(process.env.PORT ?? 5000);

  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

export default app.fetch;
