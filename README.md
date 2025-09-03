# Millennium BIM Call Center

A modern React application for Millennium BIM Call Center operations. This project is built with React 19, Tailwind CSS, and React Router for efficient call center management and customer service operations.

## 🚀 Features

- **Modern React Architecture**: Built with React 19.1.1 for optimal performance
- **Responsive Design**: Tailwind CSS for modern, mobile-first UI components
- **Routing**: React Router DOM for seamless navigation
- **Component-Based**: Modular and reusable component architecture
- **Testing Ready**: Comprehensive testing setup with Jest and React Testing Library

## 📁 Project Structure

```
millennium-bim-call-center/
├── frontend/                 # Main React application
│   ├── public/              # Static assets
│   ├── src/                 # Source code
│   │   ├── components/      # Reusable components
│   │   ├── App.js          # Main application component
│   │   ├── Home.js         # Home page component
│   │   └── index.js        # Application entry point
│   ├── package.json        # Frontend dependencies
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── postcss.config.js   # PostCSS configuration
└── README.md               # This file
```

## 🛠️ Technology Stack

- **Frontend Framework**: React 19.1.1
- **Styling**: Tailwind CSS 3.4.17
- **Routing**: React Router DOM 7.8.2
- **Build Tool**: Create React App (React Scripts 5.0.1)
- **Testing**: Jest, React Testing Library
- **CSS Processing**: PostCSS, Autoprefixer

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **Git** (for version control)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/anasfarock/millennium-bim-call-center.git
cd millennium-bim-call-center
```

### 2. Navigate to Frontend Directory

```bash
cd frontend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

## 📜 Available Scripts

### Development

```bash
npm start          # Start development server
npm test           # Run tests in watch mode
npm run build      # Build for production
npm run eject      # Eject from Create React App (irreversible)
```

### Production

```bash
npm run build      # Creates optimized production build in 'build' folder
```

## 🎨 Styling with Tailwind CSS

This project uses Tailwind CSS for styling. Tailwind utilities are available throughout the application:

```jsx
// Example usage in components
<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
  <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome</h1>
  <p className="text-lg text-gray-600">Call Center Dashboard</p>
</div>
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

For coverage report:

```bash
npm test -- --coverage
```

## 📦 Building for Production

Create a production build:

```bash
npm run build
```

The build folder will contain optimized files ready for deployment.

## 🔧 Configuration

### Tailwind CSS Configuration

The project includes a `tailwind.config.js` file for customizing the design system:

```javascript
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    theme: {
        extend: {
            // Add custom styles here
        },
    },
    plugins: [],
};
```

### PostCSS Configuration

PostCSS is configured in `postcss.config.js` to process Tailwind CSS:

```javascript
module.exports = {
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
    },
};
```

## 🚀 Deployment

This project can be deployed to various platforms:

- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Use `gh-pages` package
- **AWS S3**: Upload build files to S3 bucket

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions, please contact the development team or create an issue in the GitHub repository.

## 🔄 Recent Updates

- **Tailwind CSS**: Upgraded to v3.4.17 for stability and compatibility
- **React**: Updated to v19.1.1 for latest features and performance improvements
- **React Router**: Updated to v7.8.2 for modern routing capabilities

---

**Millennium BIM Call Center** - Empowering customer service excellence through modern technology.
