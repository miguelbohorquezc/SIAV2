import { Outlet } from 'react-router-dom';
import Navbar from '@/shared/components/Navbar';
import SidebarDropdown from "@/shared/components/SidebarDropdown";

function App() {
  return (
    <>
      <SidebarDropdown />
      <Navbar />
      <main  className="p-0" style={{ marginLeft: 'var(--sia-sidebar-ml, 240px)'}}>
        <Outlet />
      </main>
    </>
  );
}

export default App;
