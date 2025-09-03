# Frontend - Millennium BIM Call Center

This is the main React frontend application for the Millennium BIM Call Center system. Built with React 19, Tailwind CSS, and modern development practices.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Open http://localhost:3000 in your browser
```

## 📋 Prerequisites

- **Node.js** 16+ 
- **npm** 6+

## 🛠️ Technology Stack

- **React** 19.1.1 - Latest React with improved performance
- **React Router DOM** 7.8.2 - Client-side routing
- **Tailwind CSS** 3.4.17 - Utility-first CSS framework
- **React Scripts** 5.0.1 - Build tools and configuration
- **Testing Library** - Comprehensive testing utilities

## 📜 Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000).
- Hot reload enabled
- Lint errors shown in console
- Automatic browser refresh on changes

### `npm test`
Launches the test runner in interactive watch mode.
- Runs tests automatically on file changes
- Provides detailed test results
- Supports coverage reporting

### `npm run build`
Builds the app for production to the `build` folder.
- Optimizes React for production
- Minifies and bundles files
- Includes hash filenames for caching
- Ready for deployment

### `npm run eject`
⚠️ **Warning: This is a one-way operation!**

Ejects from Create React App configuration for full control over build tools.

## 🎨 Styling with Tailwind CSS

This project uses Tailwind CSS for consistent, responsive design:

### Configuration
- Config file: `tailwind.config.js`
- PostCSS config: `postcss.config.js`
- CSS imports in `src/index.css`

### Usage Examples
```jsx
// Responsive layout
<div className="flex flex-col md:flex-row">
  
// Button styling
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  
// Card component
<div className="max-w-sm rounded overflow-hidden shadow-lg">
```

### Available Utilities
- **Layout**: `flex`, `grid`, `container`
- **Spacing**: `p-4`, `m-2`, `space-x-4`
- **Typography**: `text-lg`, `font-bold`, `text-center`
- **Colors**: `bg-blue-500`, `text-gray-800`
- **Responsive**: `sm:`, `md:`, `lg:`, `xl:`

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test Home.test.js
```

### Testing Libraries Available
- **@testing-library/react** - React component testing
- **@testing-library/jest-dom** - Custom Jest matchers
- **@testing-library/user-event** - User interaction simulation

### Writing Tests
```jsx
import { render, screen } from '@testing-library/react';
import Home from './Home';

test('renders welcome message', () => {
  render(<Home />);
  expect(screen.getByText(/Welcome to Millennium BIM/i)).toBeInTheDocument();
});
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── styles/             # Additional CSS files
├── App.js              # Main app component
├── App.css             # App-specific styles
├── index.js            # React entry point
└── index.css           # Global styles + Tailwind imports
```

## 🔧 Development Guidelines

### Component Structure
```jsx
import React from 'react';

function ComponentName({ prop1, prop2 }) {
  return (
    <div className="tailwind-classes">
      {/* Component content */}
    </div>
  );
}

export default ComponentName;
```

### State Management
- Use `useState` for local component state
- Use `useEffect` for side effects
- Consider Context API for global state

### Routing
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// In App.js
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/dashboard" element={<Dashboard />} />
</Routes>
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

Creates optimized build in `build/` folder containing:
- Minified JavaScript bundles
- Optimized CSS files
- Static assets with cache-friendly hashes
- Production-ready HTML

### Deployment Platforms
- **Netlify**: Drag & drop `build` folder
- **Vercel**: Connect GitHub repo
- **Firebase Hosting**: `firebase deploy`
- **AWS S3**: Upload to S3 bucket

### Environment Variables
Create `.env` file for environment-specific configs:
```bash
REACT_APP_API_URL=https://api.example.com
REACT_APP_VERSION=1.0.0
```

## 🐛 Troubleshooting

### Common Issues

**Tailwind styles not working:**
- Check `tailwind.config.js` content paths
- Verify `@tailwind` directives in `index.css`
- Clear browser cache

**Build fails:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check for dependency conflicts

**Port already in use:**
- Change port: `PORT=3001 npm start` (Mac/Linux)
- Or kill process using port 3000

### Development Tools
- **React DevTools** browser extension
- **Tailwind CSS IntelliSense** VS Code extension
- **ES7+ React/Redux/React-Native snippets**

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com)
- [Create React App Documentation](https://create-react-app.dev)

## 🤝 Contributing

1. Follow existing code style and patterns
2. Write tests for new components
3. Use semantic commit messages
4. Update documentation as needed

---

Built with ❤️ for Millennium BIM Call Center
