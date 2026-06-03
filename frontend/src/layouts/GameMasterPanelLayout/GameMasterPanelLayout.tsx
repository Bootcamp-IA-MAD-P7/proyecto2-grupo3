// src/layouts/GameMasterPanelLayout/GameMasterPanelLayout.tsx
import { Outlet } from "react-router-dom";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";

export default function GameMasterPanelLayout() {
  return (
    <div className="bg-slate-50 text-slate-800 font-sans flex flex-col min-h-screen selection:bg-indigo-100">
      <Header />

      <main className="flex-grow flex flex-col w-full relative">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}