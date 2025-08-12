import { http, HttpResponse } from "msw";

const posts = [
  { id: "1", title: "Post 1" },
  { id: "2", title: "Post 2" },
  { id: "3", title: "Post 3" },
];

const handlers = [http.get("/posts", () => HttpResponse.json(posts))];

export default handlers;
