import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import TopNav from '../components/navigation/TopNav';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="flex pt-16">
        <AdminSidebar />
        <main className="flex-1 p-8 ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
