import { Outlet } from 'react-router-dom';
import TopNav from '../components/navigation/TopNav';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
