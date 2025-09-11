import { Outlet } from 'react-router-dom';
import Navbar from '@/shared/components/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
}

export default App;
