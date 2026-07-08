<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Orga Soft - Enterprise Healthcare Software Platform

A modern, bilingual (Arabic/English) website for Orga Soft, featuring real-time Firebase integration, admin dashboard, and responsive design.

## 🔥 Firebase Integration

This application is fully integrated with Firebase Realtime Database for cloud storage and real-time synchronization.

### Features
- ✅ Real-time data synchronization across all devices
- ✅ Cloud-based content management
- ✅ Offline support with localStorage fallback
- ✅ Automatic data persistence
- ✅ Multi-device sync
- ✅ Loading states and visual feedback

### Quick Start
1. **View the app** - Data loads automatically from Firebase
2. **Admin access** - Login with username: `admin`, password: `admin`
3. **Make changes** - Edit content in the admin dashboard
4. **Deploy** - Click "DEPLOY CHANGES" to sync to Firebase
5. **See updates** - Changes appear instantly on all devices

### Documentation
- 📖 **[Quick Start Guide](QUICK_START.md)** - Get started in 5 minutes
- 📚 **[Complete Setup Guide](FIREBASE_SETUP.md)** - Full technical documentation
- 📊 **[Integration Summary](FIREBASE_INTEGRATION_SUMMARY.md)** - Detailed overview

### Firebase Console
Access your Firebase project:
- **Dashboard**: https://console.firebase.google.com/project/orga4soft-35b70
- **Database**: https://console.firebase.google.com/project/orga4soft-35b70/database

## 🚀 Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key

3. Run the app:
   ```bash
   npm run dev
   ```

4. Open browser to `http://localhost:5173`

## 🎨 Features

### User Features
- 🌐 Bilingual support (Arabic/English)
- 📱 Fully responsive design
- 🎯 Modern UI with smooth animations
- 🔄 Real-time content updates
- 📊 Dynamic product showcase
- 🤝 Partner network display
- 📍 Interactive contact section with map

### Admin Features
- 🔐 Secure admin dashboard
- ✏️ Edit all website content
- 🖼️ Image upload and management
- 🌍 Manage bilingual content
- 📦 Product management (add/edit/delete)
- 🤝 Partner management
- 💾 Real-time Firebase sync
- 📱 Responsive admin interface

## 📁 Project Structure

```
orga-soft/
├── components/          # React components
│   ├── Hero.tsx        # Hero section
│   └── Navbar.tsx      # Navigation bar
├── views/              # Page views
│   ├── Home.tsx        # Main homepage
│   ├── AdminDashboard.tsx  # Admin panel
│   └── ProductDetail.tsx   # Product details
├── context/            # React context
│   └── SiteContext.tsx # Global state + Firebase
├── firebase.ts         # Firebase configuration
├── constants.ts        # Initial data
├── types.ts           # TypeScript types
└── App.tsx            # Main app component
```

## 🔧 Technology Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Firebase Realtime Database
- **Analytics**: Firebase Analytics
- **Build Tool**: Vite
- **Hosting**: Firebase Hosting (optional)

## 🎯 Admin Dashboard

Access the admin dashboard at `/admin` or click "Console" in the navigation.

**Login Credentials:**
- Username: `admin`
- Password: `admin`

### Admin Sections
1. **Brand Identity** - Logo, favicon, branding
2. **Navigation Nodes** - Menu labels
3. **Hero Interface** - Main banner content
4. **Ecosystem Legacy** - About section
5. **System Stack** - Products management
6. **Partner Network** - Partners management
7. **Contact Hub** - Contact information
8. **Footer Workspace** - Footer content

## 🌐 Deployment

### Firebase Hosting (Recommended)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase
firebase init hosting

# Build the app
npm run build

# Deploy
firebase deploy
```

### Other Platforms
The app can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 🔐 Security

### Development
- Database is open for read/write
- No authentication required
- Good for testing

### Production (Recommended)
1. Enable Firebase Authentication
2. Set database security rules
3. Use environment variables
4. Enable HTTPS only

See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for details.

## 📊 Database Structure

All data is stored in Firebase Realtime Database:
- Site content (logo, products, partners, etc.)
- User preferences (language)
- Contact information
- UI strings and translations

See [FIREBASE_INTEGRATION_SUMMARY.md](FIREBASE_INTEGRATION_SUMMARY.md) for complete structure.

## 🐛 Troubleshooting

### App won't load
- Check internet connection
- Clear browser cache
- Check browser console for errors

### Changes not saving
- Check sync indicator appears
- Verify Firebase project is active
- Check browser console

### Firebase errors
- Verify Firebase config in `firebase.ts`
- Check Firebase Console for issues
- Review database rules

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)

## 🤝 Support

For issues or questions:
1. Check the documentation files
2. Review browser console logs
3. Check Firebase Console
4. Contact development team

## 📄 License

This project is proprietary software for Orga Soft.

---

View your app in AI Studio: https://ai.studio/apps/drive/1U3dehXG8Ax2BMcgJSVBftjC9935WY3HA

**Made with ❤️ for Orga Soft**
