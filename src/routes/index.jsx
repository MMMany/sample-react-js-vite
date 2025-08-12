import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import MainLayout from "#/layout/MainLayout";

const SamplePage = lazy(() => import("#/pages/SamplePage"));

export const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: SamplePage,
      },
    ],
  },
]);
