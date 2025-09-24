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
    <>
      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
        {/* Main content area - Takes remaining height between header and footer */}
        <div className="flex flex-1 min-h-0">
          {/* Sidebar - Fixed width, full height between header and footer, no scroll */}
          <Sidebar />
          {/* Main content - Scrollable area */}
          <div className="flex-1 min-h-0 overflow-auto w-full">{children || <Outlet />}</div>
        </div>
        {/* Footer - Fixed at bottom */}
      </div>
    </>
  );
};

export default DashboardLayout;
