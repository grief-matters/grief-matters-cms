import { AutoRouter } from "itty-router";

const router = AutoRouter();

router
  .get("/hello/:name", ({ name }) => `Hello, ${name}!`)
  .get("/json", () => ({ foo: "bar" }))
  .get("/throw", (a) => a.b.c); // safely throws

export default router;
