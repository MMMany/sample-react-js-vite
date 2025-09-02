import { http, HttpResponse } from "msw";

const handlers = [
  http.post("/api/auth/v1/login", async ({ request }) => {
    const { username, password } = await request.json();

    if (username === "user" && password === "password") {
      return HttpResponse.json({
        info: {
          name: "John Doe",
          email: "john.doe@example.com",
          roles: ["user"],
        },
        accessToken: "fake-jwt-token",
      });
    }

    return HttpResponse.json({ message: "not authorized" }, { status: 401 });
  }),
  http.post("/api/auth/v1/refresh", async ({ request }) => {
    // get refresh token from cookie
    const refreshToken = request.headers.get("x-refresh-token");

    if (!refreshToken) {
      return HttpResponse.json({ message: "not authorized" }, { status: 401 });
    }

    // create response
    const response = new HttpResponse({
      accessToken: "new-access-token",
    });

    // set new refresh token to cookie
    // without HttpOnly, Secure, Strict (for development)
    response.headers.set("x-refresh-token", "new-refresh-token");

    return response;
  }),
];

export default handlers;
