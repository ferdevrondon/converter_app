# MXN to JPY Converter - Progressive Web App

A mobile-friendly currency converter app for converting Mexican Pesos (MXN) to Japanese Yen (JPY) with conversion history tracking.

## Features

- **Real-time Conversion**: Convert MXN to JPY with live exchange rates
- **Conversion History**: Track and view all your past conversions
- **Offline Support**: Works without internet connection after first load
- **Mobile Optimized**: Designed specifically for mobile devices
- **PWA Ready**: Install on your iPhone home screen like a native app

## Installation on iPhone

1. **Host the app**: Upload all files to a web server (GitHub Pages, Netlify, Vercel, etc.)
   - Make sure the server supports HTTPS (required for PWA)

2. **Open in Safari**: Navigate to your hosted URL in Safari browser

3. **Add to Home Screen**:
   - Tap the Share button (square with arrow pointing up)
   - Scroll down and tap "Add to Home Screen"
   - Edit the name if desired
   - Tap "Add"

4. **Launch the App**: The app icon will appear on your home screen and will work like a native app

## Quick Local Testing

To test locally before deploying:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Files Structure

- `index.html` - Main app file with all screens
- `app.js` - JavaScript functionality for conversion and history
- `manifest.json` - PWA manifest for installation
- `service-worker.js` - Offline caching support
- `icon-192.png` - App icon (192x192)
- `icon-512.png` - App icon (512x512)

## Live Exchange Rate

The app uses **live exchange rates** from ExchangeRate-API (https://exchangerate-api.com):
- Automatically fetches current MXN to JPY rate on app load
- Updates every hour automatically
- Manual refresh available via the refresh button on home screen
- Caches last rate in local storage for offline use
- Falls back to cached rate if API is unavailable

**Fallback rate**: 1 MXN = 8.25 JPY (used only if API fails and no cached rate exists)

## Browser Support

- iOS Safari 11.3+
- Chrome (Android)
- Edge
- Firefox

## Notes

- Conversion history is stored locally in your browser
- No data is sent to external servers
- Works completely offline after first load
- Icons are SVG-based and will render properly on all devices
