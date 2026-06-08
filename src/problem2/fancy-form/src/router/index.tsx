import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import SwapPage from "@/pages/Swap";
import ErrorPage from "@/pages/Error";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <SwapPage />,
      },
    ],
  },
]);
