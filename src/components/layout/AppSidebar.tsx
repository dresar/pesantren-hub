import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { navigationConfig, type NavItem as NavItemType } from '@/config/navigation';
import { useAppStore } from '@/stores/app-store';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';

export function AppSidebar() {
  const location = useLocation();
  const { sidebarCollapsed, setSidebarCollapsed, sidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen border-r bg-sidebar transition-all duration-300 ease-in-out',
          sidebarCollapsed ? 'w-16' : 'w-64',
          // Mobile: slide in/out
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className={cn(
          'flex h-16 items-center border-b border-sidebar-border px-4',
          sidebarCollapsed ? 'justify-center' : 'justify-between'
        )}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                PP
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sidebar-foreground text-sm">Pesantren</span>
                <span className="text-xs text-muted-foreground">Admin Panel</span>
              </div>
            </div>
          )}

          {sidebarCollapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              PP
            </div>
          )}

          {/* Mobile Close */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="h-[calc(100vh-4rem-4rem)]">
          <nav className="p-2 space-y-4">
            {navigationConfig.map((section) => (
              <div key={section.title}>
                {!sidebarCollapsed && (
                  <h3 className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {section.title}
                  </h3>
                )}
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <NavItem
                      key={item.href}
                      item={item}
                      isActive={location.pathname === item.href || location.pathname.startsWith(item.href + '/')}
                      collapsed={sidebarCollapsed}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Footer - Collapse Toggle */}
        <div className="absolute bottom-0 left-0 right-0 h-16 border-t border-sidebar-border bg-sidebar">
          <div className="flex h-full items-center justify-center px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={cn(
                'hidden lg:flex w-full gap-2',
                sidebarCollapsed && 'justify-center'
              )}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4" />
                  <span>Collapse</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}

interface NavItemProps {
  item: NavItemType;
  isActive: boolean;
  collapsed: boolean;
}

function NavItem({ item, isActive, collapsed }: NavItemProps) {
  const Icon = item.icon;

  const content = (
    <Link
      to={item.href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
        'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        isActive
          ? 'bg-primary/10 text-primary border-l-2 border-primary -ml-[2px] pl-[calc(0.75rem+2px)]'
          : 'text-sidebar-foreground',
        collapsed && 'justify-center px-2'
      )}
    >
      <Icon className={cn('h-4 w-4 shrink-0', isActive && 'text-primary')} />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.title}</span>
          {item.badge && (
            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <li>{content}</li>
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          {item.title}
          {item.badge && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
              {item.badge}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return <li>{content}</li>;
}
