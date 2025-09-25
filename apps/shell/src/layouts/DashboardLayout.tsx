import { lazy } from 'react';
import { Outlet } from 'react-router';
import { registerComponent } from '../components/ErrorBoundary/ComponentRegistry';

const HeaderDiv = lazy(() => import('headerPages/HeaderDiv'));
registerComponent('HeaderDiv', () => import('headerPages/HeaderDiv'));

const Sidebar = lazy(() => import('sidebarPages/Sidebar'));
registerComponent('Sidebar', () => import('sidebarPages/Sidebar'));

export interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen flex-col bg-slate-50 text-slate-900 overflow-hidden">
      {/* Header - Fixed at top */}
      <HeaderDiv />

      {/* Main content area - Takes remaining height below header */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar - Fixed position, positioned on the left */}
        <Sidebar />

        {/* Main content - Scrollable area, positioned to the right of sidebar with left margin to account for fixed sidebar */}
        <div className="flex-1 min-h-0 overflow-auto ml-[6.525rem]">{children || <Outlet />}</div>
      </div>

      {/* Footer - Fixed at bottom (if needed) */}
    </div>
  );
};

export default DashboardLayout;
