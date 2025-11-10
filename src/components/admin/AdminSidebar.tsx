import { Link, useLocation } from 'react-router-dom';
import { AwardIcon, GiftIcon, UsersIcon, CodeIcon, TrendingUpIcon, ShoppingCartIcon, DollarSignIcon } from 'lucide-react';
import { Separator } from '../ui/separator';

const AdminSidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    {
      category: 'Loyalty',
      items: [
        { path: '/admin/loyalty/tiers', label: 'Tiers', icon: AwardIcon },
        { path: '/admin/loyalty/vouchers', label: 'Vouchers', icon: GiftIcon },
        { path: '/admin/loyalty/members', label: 'Members', icon: UsersIcon },
        { path: '/admin/loyalty/use-code', label: 'Use Code', icon: CodeIcon },
      ],
    },
    {
      category: 'Affiliate',
      items: [
        { path: '/admin/affiliate/tiers', label: 'Tiers', icon: TrendingUpIcon },
        { path: '/admin/affiliate/orders', label: 'Orders', icon: ShoppingCartIcon },
      ],
    },
    {
      category: 'Payouts',
      items: [{ path: '/admin/payouts', label: 'Manage Payouts', icon: DollarSignIcon }],
    },
  ];

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-card border-r border-border overflow-y-auto">
      <div className="p-6">
        <h2 className="font-headline text-lg font-bold text-foreground mb-6">Admin Panel</h2>
        
        {menuItems.map((section, idx) => (
          <div key={section.category} className="mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
              {section.category}
            </h3>
            <nav className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-smooth cursor-pointer ${
                      isActive(item.path)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-normal">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            {idx < menuItems.length - 1 && <Separator className="mt-6" />}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default AdminSidebar;
