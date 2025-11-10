import { Outlet } from 'react-router-dom';
import TopNav from '../components/navigation/TopNav';

const UserLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
