import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { AppTopbar } from './AppTopbar';
import { useAppStore } from '@/stores/app-store';
import { cn } from '@/lib/utils';

export function AdminLayout() {
  const { sidebarCollapsed } = useAppStore();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <div
        className={cn(
          'transition-all duration-300',
          sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        )}
      >
        {/* Topbar */}
        <AppTopbar />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)] pt-16">
          <div className="container py-6 lg:py-8 max-w-7xl mx-auto px-4 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
