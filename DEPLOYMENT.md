# Deployment Guide

This document explains how to build and deploy the Millennium BIM Call Center application with Module Federation v2.

## Build and Serve Commands

### Development Mode
```bash
# Start development servers with hot reload
bun run dev
```
- Shell: http://localhost:3000
- Shared: http://localhost:3001

### Preview Mode
```bash
# Build for production and serve with Rsbuild preview servers
bun run preview
```
- Shell: http://localhost:3000
- Shared: http://localhost:3001
- Uses production builds with localhost Module Federation URLs

### Production Mode
```bash
# Build and serve production files with static file servers
bun run start:prod
```
- Shell: http://localhost:3000  
- Shared: http://localhost:3001
- Uses production builds with optimized static serving

### Individual Commands

#### Build Only
```bash
# Build all applications for production
bun run build

# Build with specific environment
bun run build:prod
```

#### Serve Only (after building)
```bash
# Serve production builds
bun run serve:prod
```

## Module Federation Configuration

### Environment Variables

- **HOST_BASE_URL**: Base URL for shared package in preview/production mode
- **NODE_ENV**: Environment mode (development/production)

### URL Resolution Logic

1. **Development**: Uses `http://localhost:3001/` for shared package
2. **Preview Mode**: Uses `HOST_BASE_URL` when it includes "localhost"
3. **Production**: Uses `http://localhost:3001/` for local production serving
4. **Remote Deployment**: Uses `HOST_BASE_URL/shared/` for remote hosting

## Deployment Scenarios

### Local Production Serving
```bash
bun run start:prod
```
- Builds both applications
- Serves shell on port 3000
- Serves shared package on port 3001
- Module Federation resolves to localhost URLs

### Remote Deployment
```bash
# Set the base URL for your shared package deployment
export HOST_BASE_URL="https://your-cdn.com"
bun run build
```
- Shell will reference shared package at `https://your-cdn.com/shared/mf-manifest.json`
- Deploy shell and shared package to their respective locations

## File Structure

```
apps/
  shell/
    dist/              # Built shell application
      index.html       # Main entry point
      mf-manifest.json # Module Federation manifest
      static/          # Static assets
packages/
  shared/
    dist/              # Built shared package
      mf-manifest.json # Shared package manifest
      static/          # Shared components and assets
```

## CORS Configuration

Both development and production servers include CORS headers for cross-origin Module Federation requests.

## Performance Notes

- Production builds are optimized with code splitting
- Module Federation chunks are loaded on-demand
- Assets are served with appropriate caching headers
- Gzip compression is enabled for all static assets
