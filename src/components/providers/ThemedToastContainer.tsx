"use client";

import { useTheme } from "next-themes";
import { ToastContainer } from "react-toastify";

export default function ThemedToastContainer() {
  const { resolvedTheme } = useTheme();

  return (
    <ToastContainer
      theme={resolvedTheme === "light" ? "light" : "dark"}
      position="bottom-right"
    />
  );
}
