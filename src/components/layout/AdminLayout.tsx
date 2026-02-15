import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { AppTopbar } from './AppTopbar';
import { useAppStore } from '@/stores/app-store';
import { cn } from '@/lib/utils';
import WhatsAppButton from '@/components/shared/WhatsAppButton';
import AiAssistantButton from '@/components/shared/AiAssistantButton';
export function AdminLayout() {
  const { sidebarCollapsed } = useAppStore();
  return (
    <div className="min-h-screen bg-background">
      {}
      <AppSidebar />
      {}
      <div
        className={cn(
          'transition-all duration-300 min-h-screen',
          'lg:pl-72', 
          sidebarCollapsed && 'lg:pl-16',
          'pl-0' 
        )}
      >
        {}
        <AppTopbar />
        {}
        <main className="min-h-[calc(100vh-4rem)] pt-16">
          <div className="container py-8 lg:py-10 max-w-7xl mx-auto px-6 lg:px-10">
            <Outlet />
          </div>
        </main>
        <AiAssistantButton />
        <WhatsAppButton role="admin" />
      </div>
    </div>
  );
}