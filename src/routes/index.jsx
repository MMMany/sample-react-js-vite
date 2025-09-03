import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import MainLayout from "#/layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

function lazyLoader(Component, fallback = <div>Loading...</div>) {
  return () => (
    <Suspense fallback={fallback}>
      <Component />
    </Suspense>
  );
}

const SamplePage = lazyLoader(lazy(() => import("#/pages/SamplePage")));
const LoginPage = lazy(() => import("#/pages/LoginPage"));

export const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <SamplePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        Component: lazyLoader(LoginPage, <div>Its loading...</div>),
      },
    ],
  },
]);
