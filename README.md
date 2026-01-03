# QLean - Progressive Web Quran App

A mobile-responsive Progressive Web App (PWA) for reading the Quran with offline support, built with Node.js, Express, TypeScript, Bootstrap 5, and Vitest.

## Features

- 📱 Mobile-responsive design with Bootstrap 5
- 🌙 Dark mode support
- 📴 Offline functionality with Service Worker
- 🔍 Search in Arabic and Bangla
- 🔖 Bookmark verses
- 🌐 Bangla translation
- ⚡ Fast and lightweight
- 🧪 Tested with Vitest
- 🚀 Production-ready with PM2

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PM2 (for production): `npm install -g pm2`

## Installation

```bash
# Clone the repository
git clone https://github.com/mesadhan/qlean.git
cd qlean

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

## Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build
```

The app will be available at `http://localhost:3000`

## Production Deployment with PM2

```bash
# Build the application
npm run build

# Start with PM2
npm run pm2:start

# Stop the application
npm run pm2:stop

# Restart the application
npm run pm2:restart

# View logs
npm run pm2:logs

# Monitor the application
pm2 monit
```

## API Endpoints

- `GET /api/surahs` - Get all Surahs
- `GET /api/surahs/: id` - Get specific Surah with Ayahs
- `GET /api/search? q=query` - Search Quran text

## PWA Installation

The app can be installed on mobile devices: 

1. Open the app in your mobile browser
2. Look for the "Install" or "Add to Home Screen" prompt
3. Follow the installation instructions
4. The app will work offline after initial load

## Project Structure

```
qlean/
├── src/
│   ├── server/
│   │   ├── index.ts              # Express server
│   │   ├── routes/               # API routes
│   │   ├── controllers/          # Request handlers
│   │   ├── data/                 # Quran data
│   │   └── types/                # TypeScript types
│   ├── public/
│   │   ├── index.html            # Main HTML
│   │   ├── css/                  # Stylesheets
│   │   ├── js/                   # Client-side JS
│   │   ├── manifest.json         # PWA manifest
│   │   └── icons/                # App icons
│   └── tests/                    # Test files
├── dist/                         # Built files
├── package. json
├── tsconfig.json
├── vitest.config. ts
└── ecosystem.config.js           # PM2 configuration
```

## Technologies Used

- **Backend**: Node.js, Express. js, TypeScript
- **Frontend**: Bootstrap 5, Vanilla JavaScript
- **Testing**: Vitest
- **PWA**: Service Worker, Web App Manifest
- **Process Manager**: PM2
- **Storage**: LocalStorage

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Author

Sadhan Sarker (@mesadhan)
```