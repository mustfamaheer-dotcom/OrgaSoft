# Orga Soft - Modern Corporate Website

## Project Overview

Orga Soft is a modern, bilingual (English/Arabic) corporate website for an Egyptian healthcare software company. It showcases enterprise software solutions for pharmacies, hospitals, and retail stores. The site features a dynamic admin dashboard, real-time content management via Firebase, bilingual RTL/LTR support, and a modern glassmorphism UI built with React and Tailwind CSS.

**Live URL:** [https://orga4soft.com](https://orga4soft.com)

---

## Project Structure

```
/
├── admin/
│   └── components/         # Admin panel components (ProductsTab, etc.)
├── components/             # Reusable UI components
│   ├── AnimatedCounter.tsx  # Number counter animation
│   ├── CookieConsent.tsx    # GDPR cookie consent banner
│   ├── Footer.tsx          # Site footer
│   ├── Hero.tsx            # Hero section
│   ├── KitImage.tsx        # ImageKit optimized image component
│   ├── LoadingSkeleton.tsx  # Loading placeholder
│   └── Navbar.tsx          # Navigation bar
├── context/
│   └── SiteContext.tsx      # Global state management
├── functions/              # Firebase Cloud Functions
│   ├── index.js            # ImageKit auth function
│   └── package.json
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries
│   ├── auth.ts             # Firebase authentication
│   ├── ErrorBoundary.tsx   # Error boundary component
│   ├── imagekit.ts         # ImageKit URL optimization
│   ├── logger.ts           # Logger utility
│   ├── sanitize.ts         # Input sanitization
│   └── test-setup.ts       # Test configuration
├── MD/                     # Documentation files
├── public/                 # Static assets
├── scripts/                # Build/deploy scripts
├── views/                  # Page-level components
│   ├── AdminDashboard.tsx  # Admin panel page
│   ├── AllProducts.tsx     # All products listing
│   ├── Home.tsx            # Home page
│   ├── NotFound.tsx        # 404 page
│   └── ProductDetail.tsx   # Single product detail
├── App.tsx                 # Root application component
├── constants.ts            # UI strings and default data
├── firebase.ts             # Firebase initialization & data layer
├── index.css               # Global styles / Tailwind base
├── index.html              # Entry HTML
├── index.tsx               # React entry point
├── tailwind.config.js      # Tailwind CSS config
├── types.ts                # TypeScript type definitions
├── vite.config.ts          # Vite build config
├── vitest.config.ts        # Test runner config
└── package.json            # Dependencies & scripts
```

---

## Technology Stack

### Frontend

| Technology       | Version   | Purpose                                    |
|------------------|-----------|--------------------------------------------|
| React            | ^19.2.4  | UI framework                              |
| TypeScript       | ~5.8.2   | Type safety                               |
| Vite             | ^6.2.0   | Build tool & dev server                   |
| Tailwind CSS     | ^3.4.19  | Utility-first CSS framework               |
| React Router DOM | ^7.15.1  | Client-side routing                       |
| Lucide React     | ^0.563.0 | Icon library                              |
| React Helmet Async | ^3.0.0 | SEO meta tags management                  |

### Backend & Services

| Service          | Purpose                                    |
|------------------|--------------------------------------------|
| Firebase Firestore| Real-time NoSQL database for site content  |
| Firebase Auth    | Admin authentication                        |
| Firebase Analytics| Visitor analytics (optional)               |
| Firebase Functions| Serverless functions (ImageKit auth)       |
| ImageKit         | Image CDN, optimization, and transformation|
| Google Fonts     | Inter (English) & Tajawal (Arabic) fonts   |

### Dev Tools

| Tool             | Purpose                                    |
|------------------|--------------------------------------------|
| Vitest           | Unit testing                               |
| Testing Library  | React component testing                    |
| JSDOM            | DOM environment for tests                  |
| PostCSS + Autoprefixer | CSS processing                      |
| TSX              | TypeScript execution utilities             |

---

## Key Features

### 1. Bilingual Support (English / Arabic)
- Full RTL (Right-to-Left) layout for Arabic
- Language toggle persisted to Firebase
- All content stored as `Record<Language, string>` in Firestore
- Both Google Fonts loaded (Inter for English, Tajawal for Arabic)

### 2. Real-Time Content Management
- Admin dashboard with Firebase Firestore integration
- Live updates via `onSnapshot` Firestore listener
- Editable sections: hero, about, products, partners, contacts
- Image upload with Cloudinary/ImageKit integration

### 3. Product Catalog
- Product cards with tilt animation (3D perspective)
- ImageKit optimized images with lazy loading
- Key features badges, demo links, CTA buttons
- Responsive grid: 1 col (mobile) → 2 col (tablet) → 3 col (desktop)
- Product detail page with banner, specs, and contact CTAs

### 4. Image Optimization (ImageKit)
- Automatic WebP format conversion
- Width/height transformation parameters
- Lazy loading with fade-in transition
- Error state with loading spinner fallback
- Cloud Functions for ImageKit authentication

### 5. Dark Mode
- Toggle persisted to localStorage
- `class`-based dark mode via Tailwind
- System preference detection on first visit

### 6. Admin Dashboard
- Firebase Auth-protected admin routes
- Sections management (Hero, About, Products, Partners, Contacts)
- Real-time preview of changes
- Product CRUD with image upload

### 7. Responsive Design
- Mobile-first approach
- Custom `xs: 400px` breakpoint
- Fluid typography and spacing
- Touch-friendly interactive elements

### 8. SEO & Meta
- Structured data (JSON-LD Schema.org Organization)
- Open Graph tags for social sharing
- Sitemap.xml
- Canonical URLs

### 9. Contact & Conversion
- WhatsApp direct messaging (order & support)
- Phone call buttons with country code
- Multi-channel CTA (call, WhatsApp, contact form)
- Cookie consent banner (GDPR compliant)

---

## Firebase Data Model

### Firestore Document: `siteData/main`

```typescript
interface SiteContent {
  logo: Record<'en' | 'ar', string>;
  logoImageUrl?: string;
  favicon?: string;
  theme: { primaryColor: string; secondaryColor: string };
  navLabels: { home, about, products, contact: Record<Language, string> };
  uiStrings: { /* all UI text labels */ };
  companyName: Record<Language, string>;
  hero: { title, subtitle, image, rating, cardSubtitle, stats };
  about: { title, content, image, stats };
  products: Product[];
  partners: Partner[];
  contacts: { address, phoneSupport, phoneAdmin, email, whatsapp, facebook, twitter, youtube, mapEmbedUrl };
}
```

### Firestore Document: `userPreferences/language`
- `{ value: 'en' | 'ar' }`

---

## Components Overview

| Component          | Description                               |
|--------------------|-------------------------------------------|
| `Navbar`           | Responsive nav with language & theme toggles, mobile drawer |
| `Hero`             | Animated hero with rating, stats counters, CTA |
| `Footer`           | Multi-column footer with links & contact  |
| `KitImage`         | ImageKit wrapper with lazy loading & error handling |
| `AnimatedCounter`  | Scroll-triggered number counter animation |
| `CookieConsent`    | GDPR cookie consent banner                |
| `LoadingSkeleton`  | Shimmer loading placeholders              |
| `ErrorBoundary`    | React error boundary for graceful failure |

---

## Available Scripts

| Command             | Description                    |
|---------------------|--------------------------------|
| `npm run dev`       | Start dev server on port 3000  |
| `npm run build`     | Production build to `dist/`    |
| `npm run preview`   | Preview production build       |
| `npm run test`      | Run all tests                  |
| `npm run test:watch`| Run tests in watch mode        |

---

## Deployment

The project builds to a static `dist/` folder via Vite and can be deployed to any static hosting:

- **Recommended:** Firebase Hosting
- **Alternatives:** Vercel, Netlify, Cloudflare Pages, or any web server

### Build Command
```
npm run build
```

### Output
Static files in `dist/` directory (HTML, JS, CSS, assets).

---

## Server & Hosting Requirements (Post-Deployment)

Below are all technologies and services required for the project to function correctly after deployment:

### Required Services (External)

| Service              | Purpose                                      | Required | Account Needed |
|---------------------|----------------------------------------------|----------|----------------|
| Firebase Firestore  | Content database (products, partners, text)  | Yes      | Firebase project |
| Firebase Auth       | Admin login authentication                   | Yes      | Same Firebase project |
| Firebase Functions  | ImageKit server-side auth token generation   | Yes*     | Same Firebase project (Blaze plan) |
| ImageKit            | Image CDN, optimization, and transformation  | Yes      | ImageKit account |
| Google Fonts API    | Inter & Tajawal font loading                 | Yes      | No (free) |

*\* Firebase Functions is required if using ImageKit private keys for authenticated uploads. Without it, public ImageKit URLs still work for display.*

### Environment Variables (.env file)

These must be set at build time:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/y2t2putyl
VITE_IMAGEKIT_PUBLIC_KEY=
```

### Firebase Project Configuration

1. **Firestore Database:**
   - Create a Firestore database in your Firebase project
   - Set security rules to allow read access and authenticated write
   - Populate initial data structure in `siteData/main` document

2. **Authentication:**
   - Enable Email/Password sign-in method
   - Create an admin user account

3. **Firebase Functions (if used):**
   - Deploy the `functions/` directory
   - Requires Firebase Blaze (pay-as-you-go) plan
   - ImageKit private key set as a Cloud Function environment variable

### Web Server Requirements (for static hosting)

| Requirement          | Details                                  |
|---------------------|------------------------------------------|
| HTTPS               | Required (for Firebase Auth & service workers) |
| Single Page App support | Fallback to `index.html` for all routes |
| Static file serving | Serve `dist/` folder                     |
| Gzip/Brotli         | Recommended for performance              |
| Cache headers       | Set long cache for hashed assets (JS/CSS), short for HTML |

### Firestore Security Rules (Minimum)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access for site data
    match /siteData/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    // Authenticated write for language preference
    match /userPreferences/{document} {
      allow read, write: if true;
    }
  }
}
```

### Hosting Platform Options

| Platform          | SPA Support | HTTPS | Notes                        |
|-------------------|-------------|-------|------------------------------|
| Firebase Hosting  | ✅ Built-in  | ✅ Auto | Recommended. `firebase.json` ready |
| Vercel            | ✅ Built-in  | ✅ Auto | Zero config with `vercel.json` |
| Netlify           | ✅ Via `_redirects` | ✅ Auto | Add `/* /index.html 200` |
| Cloudflare Pages  | ✅ Built-in  | ✅ Auto | Add SPA rewrite rule         |
| Apache/Nginx      | Manual      | ✅ Manual| Requires rewrite rule to `index.html` |

### Nginx SPA Rewrite Example

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### Apache `.htaccess` Rewrite Example

```
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [QSA,L]
```

### Minimum Node.js Version (for build)

- Node.js 18.x or higher
- npm 9.x or higher

### Performance Budget

| Metric             | Target     |
|--------------------|------------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3.0s |
| Lighthouse Score   | 90+        |

---

## Maintenance

- Content updates are done via the admin dashboard (no code changes needed)
- Fonts are loaded from Google Fonts CDN (no local hosting required)
- Firebase Firestore bills based on reads/writes — monitor usage
- ImageKit free tier includes 20GB bandwidth — upgrade as traffic grows
