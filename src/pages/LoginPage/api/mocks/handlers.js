import { http, HttpResponse } from "msw";

const handlers = [
  http.post("/login", async ({ request }) => {
    const { username, password } = await request.json();

    if (username === "user" && password === "password") {
      return HttpResponse.json({
        user: {
          name: "John Doe",
          email: "john.doe@example.com",
        },
        token: "fake-jwt-token",
      });
    }

    return new HttpResponse(null, {
      status: 401,
      statusText: "Unauthorized",
    });
  }),
];

export default handlers;
