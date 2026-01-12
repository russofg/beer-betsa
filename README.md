# 🍺 Betsa - The Midnight Stout

<div align="center">
  <h3>Brewed for the depths of the night. Rich, creamy, and infinite.</h3>
  <p>A modern, dark, minimalist landing page for Betsa Dark Stout beer</p>
</div>

## ✨ Features

- 🎨 **Modern Dark Design** - Sleek, minimalist dark theme with elegant animations
- 📱 **Fully Responsive** - Optimized for all devices (mobile, tablet, desktop)
- ⚡ **High Performance** - Optimized code with React.memo, lazy loading, and code splitting
- 🎭 **Smooth Animations** - Elegant transitions powered by Framer Motion
- 🔍 **SEO Optimized** - Open Graph, Twitter Cards, and JSON-LD structured data
- 📱 **PWA Ready** - Progressive Web App with manifest.json
- ♿ **Accessible** - ARIA labels and keyboard navigation support
- 🚀 **Fast Loading** - Preload critical resources, optimized images

## 🛠️ Tech Stack

- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/betsa-stout.git
cd betsa-stout
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
betsa-stout/
├── App.tsx              # Main application component
├── index.tsx            # React entry point
├── index.html           # HTML template with SEO meta tags
├── manifest.json        # PWA manifest
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies and scripts
```

## 🎨 Key Features Explained

### Performance Optimizations
- Component memoization with `React.memo()`
- `useMemo` and `useCallback` for expensive operations
- Lazy loading of images and components
- Code splitting by vendor libraries
- Optimized scroll handlers with `requestAnimationFrame`

### SEO Features
- Open Graph meta tags for social sharing
- Twitter Card support
- JSON-LD structured data (Schema.org)
- Semantic HTML5 elements
- Optimized meta descriptions

### UX Enhancements
- Scroll progress indicator
- Back to top button
- Smooth scroll navigation
- Loading screen with progress
- Interactive FAQ accordion
- Hover effects and micro-interactions

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License

This project is private and proprietary.

## 👨‍💻 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Style

- TypeScript for type safety
- ESLint for code quality (if configured)
- Prettier for code formatting (if configured)

## 🚀 Deployment

The project can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

### Vercel Deployment

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Netlify Deployment

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify deploy --prod`
3. Follow the prompts

## 📧 Contact

For questions or support, please contact the development team.

---

**Made with ❤️ for Betsa Brewing Co.**
