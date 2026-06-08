import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="min-h-full p-10 mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
