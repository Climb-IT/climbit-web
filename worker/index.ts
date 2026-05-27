import { Hono } from "hono";
const app = new Hono<{ Bindings: Env }>();

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

// SPA fallback: anything that isn't an API route is served from static assets.
// For client-side routes (e.g. /tasks/...) the assets binding returns index.html
// per `not_found_handling: single-page-application`, so the router can take over.
app.all("*", (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
