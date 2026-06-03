import { Outlet } from "react-router-dom";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar/Sidebar";

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-100 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-grow w-full relative">
        <Header />

        <main className="flex-grow overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}
