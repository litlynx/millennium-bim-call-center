import { lazy } from 'react';
import { Outlet } from 'react-router';
import { registerComponent } from '../components/ErrorBoundary/ComponentRegistry';

const Sidebar = lazy(() => import('sidebarPages/Sidebar'));
registerComponent('Sidebar', () => import('sidebarPages/Sidebar'));

export interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen max-h-screen flex-col overflow-hidden bg-gray-50 text-slate-900">
      {/* Main content area - Takes remaining height between header and footer */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar - Fixed width, full height between header and footer, no scroll */}
        <Sidebar />
        {/* Main content - Delegates scrolling to inner sections */}
        <div className="flex w-full flex-1 min-h-0 flex-col overflow-hidden pt-[1.3125rem] pb-[1.4375rem] pl-4 pr-[1.4375rem]">
          <div className="flex w-full flex-1 min-h-0">{children || <Outlet />}</div>
        </div>
      </div>
      {/* Footer - Fixed at bottom */}
    </div>
  );
};

export default DashboardLayout;
