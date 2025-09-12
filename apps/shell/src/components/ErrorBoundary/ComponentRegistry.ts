import * as React from 'react';

/**
 * Type definition for lazy component import functions
 */
export type LazyImportFunction = () => Promise<{
  default: React.ComponentType<Record<string, unknown>>;
}>;

/**
 * Type for lazy components in the cache
 */
export type CachedLazyComponent = React.LazyExoticComponent<
  React.ComponentType<Record<string, unknown>>
>;

/**
 * Registry of component names to their lazy import functions
 * This allows for dynamic re-import of specific failed components
 */
export class ComponentRegistry {
  private static instance: ComponentRegistry;
  private registry: Map<string, LazyImportFunction> = new Map();
  private componentCache: Map<string, CachedLazyComponent> = new Map();

  private constructor() {}

  /**
   * Get the singleton instance of ComponentRegistry
   */
  public static getInstance(): ComponentRegistry {
    if (!ComponentRegistry.instance) {
      ComponentRegistry.instance = new ComponentRegistry();
    }
    return ComponentRegistry.instance;
  }

  /**
   * Register a component with its lazy import function
   * @param componentName - The name/identifier for the component
   * @param importFunction - The lazy import function that returns the component
   */
  public register(componentName: string, importFunction: LazyImportFunction): void {
    this.registry.set(componentName, importFunction);
    // Clear any cached component when re-registering
    this.componentCache.delete(componentName);
  }

  /**
   * Get a lazy component from the registry
   * @param componentName - The name of the component to retrieve
   * @returns The lazy component or null if not found
   */
  public getLazyComponent(componentName: string): CachedLazyComponent | null {
    // Check if we have a cached component
    if (this.componentCache.has(componentName)) {
      const cachedComponent = this.componentCache.get(componentName);
      return cachedComponent || null;
    }

    // Get the import function from registry
    const importFunction = this.registry.get(componentName);
    if (!importFunction) {
      console.warn(`Component "${componentName}" not found in registry`);
      return null;
    }

    // Create and cache the lazy component
    const lazyComponent = React.lazy(importFunction);
    this.componentCache.set(componentName, lazyComponent);
    return lazyComponent;
  }

  /**
   * Force reload a component by clearing its cache and creating a new lazy component
   * @param componentName - The name of the component to reload
   * @returns The new lazy component or null if not found
   */
  public reloadComponent(componentName: string): CachedLazyComponent | null {
    // Clear the cached component
    this.componentCache.delete(componentName);

    // Get fresh lazy component
    return this.getLazyComponent(componentName);
  }

  /**
   * Check if a component is registered
   * @param componentName - The name of the component to check
   * @returns true if the component is registered, false otherwise
   */
  public isRegistered(componentName: string): boolean {
    return this.registry.has(componentName);
  }

  /**
   * Get all registered component names
   * @returns Array of all registered component names
   */
  public getRegisteredComponents(): string[] {
    return Array.from(this.registry.keys());
  }

  /**
   * Clear all registered components and cache
   */
  public clear(): void {
    this.registry.clear();
    this.componentCache.clear();
  }
}

/**
 * Convenience function to get the component registry instance
 */
export const getComponentRegistry = () => ComponentRegistry.getInstance();

/**
 * Helper function to register a component
 */
export const registerComponent = (componentName: string, importFunction: LazyImportFunction) => {
  getComponentRegistry().register(componentName, importFunction);
};

/**
 * Helper function to reload a component
 */
export const reloadComponent = (componentName: string) => {
  return getComponentRegistry().reloadComponent(componentName);
};
