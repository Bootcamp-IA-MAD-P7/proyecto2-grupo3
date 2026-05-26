// src/layouts/MainLayout.tsx
import { Outlet } from "react-router-dom";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";

export default function MainLayout() {
  return (
    <div className="bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-indigo-100">
      <Header />

      <main className="flex-grow flex items-center justify-center w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
