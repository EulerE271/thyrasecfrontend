// MainLayout.tsx
import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../Navigation/Sidebar";
import Navbar from "../Navigation/Navbar";
import InstrumentTabs from "../Navigation/tabs/Tabs";

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const showInstrumentTabs = location.pathname.includes("/instruments");

  return (
    <div className="flex w-screen min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1">
        {/*<Navbar />
        {showInstrumentTabs && <InstrumentTabs />} */}
        {/* Main Content */}
        <div className="p-4 overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
