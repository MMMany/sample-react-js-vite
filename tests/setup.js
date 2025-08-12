import { expect, beforeAll, afterEach, afterAll } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import { server } from "./mocks/server";

expect.extend(matchers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
