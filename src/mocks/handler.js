import { http, HttpResponse } from "msw";
import { isArray, isString } from "lodash-es";
import loginHandlers from "#/pages/LoginPage/api/mocks/handlers";

const values = ["value-1", "value-2", "value-3"];

const handlers = [
  ...loginHandlers,
  http.get("/api/items", () => {
    return new Promise((resolve) => {
      setTimeout(
        () => resolve(HttpResponse.json(values)),
        // set timeout randomly between 500ms ~ 3s
        Math.floor(Math.random() * 3000) + 500,
      );
    });
  }),
  http.post("/api/items", async ({ request }) => {
    const body = await request.text();
    if (!isString(body)) {
      return HttpResponse.text("invalid body", { status: 400 });
    }
    values.push(body);
    return new Promise((resolve) =>
      setTimeout(
        () => resolve(HttpResponse.json(body)),
        // set timeout randomly between 100ms ~ 1s
        Math.floor(Math.random() * 1000) + 100,
      ),
    );
  }),
  http.put("/api/items", async ({ request }) => {
    const body = await request.json();
    // clear 'values' and append all 'req.body'
    if (!isArray(body) || body.some((it) => !isString(it))) {
      // return '400 Bad Request' only
      return HttpResponse.text("invalid body", { status: 400 });
    }
    values.length = 0;
    values.push(...body);
    return new Promise((resolve) =>
      setTimeout(
        () => resolve(HttpResponse.json(values)),
        // set timeout randomly between 100ms ~ 1s
        Math.floor(Math.random() * 1000) + 100,
      ),
    );
  }),
];

export default handlers;
