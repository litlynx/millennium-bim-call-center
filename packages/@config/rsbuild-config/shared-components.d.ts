/**
 * Shared TypeScript declarations for Module Federation shared components
 * This file provides type-safe imports for all shared components exposed via Module Federation
 */

declare module 'shared/components' {
  import type { ComponentType, ReactNode } from 'react';

  // Common UI components
  export const Button: ComponentType<unknown>;
  export const Input: ComponentType<unknown>;
  export const Textarea: ComponentType<unknown>;
  export const InputWithLabel: ComponentType<unknown>;
  export const Card: ComponentType<unknown>;
  export const CardTabs: ComponentType<unknown>;
  export const CardItemLabel: ComponentType<unknown>;
  export const Icon: ComponentType<unknown>;
  export const LineBreak: ComponentType<unknown>;
  export const TableComponent: ComponentType<unknown>;
  export const Breadcrumbs: ComponentType<unknown>;
  export const ErrorBoundary: ComponentType<{ children: ReactNode }>;
  export const SomeForm: ComponentType<unknown>;

  // Navigation components
  export const NavMain: ComponentType<unknown>;
  export const NavProjects: ComponentType<unknown>;
  export const NavUser: ComponentType<unknown>;
  export const TeamSwitcher: ComponentType<unknown>;
  export const appSidebar: ComponentType<unknown>;

  // ShadCN UI components (re-exported from ui module)
  export const SidebarProvider: ComponentType<{ children: ReactNode }>;
  export const SidebarInset: ComponentType<unknown>;
  export const SidebarTrigger: ComponentType<unknown>;
  export const Breadcrumb: ComponentType<unknown>;
  export const BreadcrumbItem: ComponentType<unknown>;
  export const BreadcrumbLink: ComponentType<unknown>;
  export const BreadcrumbList: ComponentType<unknown>;
  export const BreadcrumbPage: ComponentType<unknown>;
  export const BreadcrumbSeparator: ComponentType<unknown>;
  export const Separator: ComponentType<unknown>;
  export const CardHeader: ComponentType<unknown>;
  export const CardTitle: ComponentType<unknown>;
  export const CardContent: ComponentType<unknown>;
  export const CardFooter: ComponentType<unknown>;
  export const CardDescription: ComponentType<unknown>;

  // Types
  export interface CardTabsProps {
    // Add specific props if needed
  }
  export interface CardTabItem {
    // Add specific props if needed
  }
  export interface ErrorBoundaryProps {
    children: ReactNode;
  }
}

// Individual component declarations for backward compatibility
declare module 'shared/components/Button' {
  import type { ComponentType } from 'react';
  const ButtonComponent: ComponentType<unknown>;
  export default ButtonComponent;
}

declare module 'shared/components/Input' {
  import type { ComponentType } from 'react';
  const InputComponent: ComponentType<unknown>;
  export default InputComponent;
}

declare module 'shared/components/Card' {
  import type { ComponentType } from 'react';
  const CardComponent: ComponentType<unknown>;
  export default CardComponent;
}

declare module 'shared/components/CardItemLabel' {
  import type { ComponentType } from 'react';
  const CardItemLabelComponent: ComponentType<unknown>;
  export default CardItemLabelComponent;
}

declare module 'shared/components/Icon' {
  import type { ComponentType } from 'react';
  export interface IconProps {
    name?: string;
    size?: number | string;
    className?: string;
  }
  const IconComponent: ComponentType<IconProps>;
  export default IconComponent;
}

declare module 'shared/components/ErrorBoundary' {
  import type { ComponentType, ReactNode } from 'react';
  export interface ErrorBoundaryProps {
    children: ReactNode;
  }
  const ErrorBoundaryComponent: ComponentType<ErrorBoundaryProps>;
  export default ErrorBoundaryComponent;
}

declare module 'shared/components/app-sidebar' {
  import type { ComponentType } from 'react';
  const AppSidebarComponent: ComponentType<unknown>;
  export default AppSidebarComponent;
}

// UI components submodule
declare module 'shared/components/ui' {
  import type { ComponentType, ReactNode } from 'react';

  export const Badge: ComponentType<unknown>;
  export const SidebarProvider: ComponentType<{ children: ReactNode }>;
  export const SidebarInset: ComponentType<unknown>;
  export const SidebarTrigger: ComponentType<unknown>;
  export const Breadcrumb: ComponentType<unknown>;
  export const BreadcrumbItem: ComponentType<unknown>;
  export const BreadcrumbLink: ComponentType<unknown>;
  export const BreadcrumbList: ComponentType<unknown>;
  export const BreadcrumbPage: ComponentType<unknown>;
  export const BreadcrumbSeparator: ComponentType<unknown>;
  export const Separator: ComponentType<unknown>;
  export const Card: ComponentType<unknown>;
  export const CardHeader: ComponentType<unknown>;
  export const CardTitle: ComponentType<unknown>;
  export const CardContent: ComponentType<unknown>;
  export const CardFooter: ComponentType<unknown>;
  export const CardDescription: ComponentType<unknown>;
}
