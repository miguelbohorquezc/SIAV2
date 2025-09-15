import { Outlet } from 'react-router-dom';
import Navbar from '@/shared/components/Navbar';
import SidebarDropdown from "@/shared/components/SidebarDropdown";

function App() {
  return (
    <>
      <Navbar />
      <SidebarDropdown />
      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
}

export default App;
