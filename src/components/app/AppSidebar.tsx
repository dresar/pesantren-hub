import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, BookOpen, Calendar, Bell, Settings, LogOut, ClipboardList, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { usePublicData } from '@/hooks/use-public-data';
interface AppSidebarProps {
  collapsed: boolean;
  onClose?: () => void;
}
const AppSidebar = ({ collapsed, onClose }: AppSidebarProps) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { data: settings } = usePublicData<any>(['settings'], '/core/settings');
  const userIdentifier = (user as any)?.username || user?.id || '';
  const menuItems = [
    { icon: Home, label: 'Dashboard', href: `/santri/dashboard/${userIdentifier}` },
    { icon: ClipboardList, label: 'Form Pendaftaran', href: `/app/form-pendaftaran/${userIdentifier}` },
    { icon: FileText, label: 'Status Pendaftaran', href: `/app/status/${userIdentifier}` },
    { icon: CreditCard, label: 'Pembayaran', href: `/app/pembayaran/${userIdentifier}` },
    { icon: BookOpen, label: 'Jadwal Pelajaran', href: `/app/jadwal/${userIdentifier}` },
    { icon: Calendar, label: 'Jadwal Ujian', href: `/app/jadwal-ujian/${userIdentifier}` },
    { icon: Bell, label: 'Notifikasi', href: `/app/notifikasi/${userIdentifier}` },
    { icon: Settings, label: 'Pengaturan', href: `/app/pengaturan/${userIdentifier}` },
  ];
  const handleLogout = () => {
    logout();
    if (onClose) onClose();
  };
  return (
    <aside
      className={cn(
        'h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {}
      <div className="h-14 flex items-center px-4 border-b border-sidebar-border shrink-0">
        <Link to="/" className="flex items-center gap-2.5" onClick={onClose}>
          {settings?.logo ? (
            <img src={settings.logo} alt="Logo" className="w-8 h-8 rounded-md object-contain shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded-md gradient-primary flex items-center justify-center font-arabic text-primary-foreground font-bold text-sm shrink-0">
              ر
            </div>
          )}
          {!collapsed && (
            <span className="text-sm font-bold tracking-tight text-sidebar-foreground whitespace-nowrap">
              Raudhatussalam
            </span>
          )}
        </Link>
      </div>
      {}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {menuItems.map((item) => {
          const active = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'gradient-primary text-primary-foreground shadow-glow'
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      {}
      <div className="p-2 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Keluar</span>}
        </button>
      </div>
    </aside>
  );
};
export default AppSidebar;