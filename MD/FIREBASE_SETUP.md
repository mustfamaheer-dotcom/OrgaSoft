# Firebase Integration Documentation

## Overview
This application now uses Firebase Realtime Database for data persistence and real-time synchronization across all devices.

## Features Implemented

### 1. **Real-time Data Synchronization**
- All site content is automatically synced to Firebase
- Changes made in the admin dashboard are instantly saved to the cloud
- Multiple users can view updates in real-time

### 2. **Data Persistence**
- Site data (logo, products, partners, contacts, etc.)
- User language preferences
- All content is stored in Firebase Realtime Database

### 3. **Offline Support**
- LocalStorage is used as a backup
- If Firebase is unavailable, the app falls back to localStorage
- Data is synced when connection is restored

### 4. **Loading States**
- Loading screen while initializing data from Firebase
- Sync indicator when saving changes
- Visual feedback for all operations

## Firebase Configuration

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBEJxwaC5tvUkYjMF6jiUfzP7WUiz3WPzE",
  authDomain: "orga4soft-35b70.firebaseapp.com",
  databaseURL: "https://orga4soft-35b70-default-rtdb.firebaseio.com",
  projectId: "orga4soft-35b70",
  storageBucket: "orga4soft-35b70.firebasestorage.app",
  messagingSenderId: "818170755912",
  appId: "1:818170755912:web:cd372b54da0055ebebd17d",
  measurementId: "G-JEMKFY8Q5L"
};
```

## Database Structure

```
orga4soft-35b70/
├── siteData/
│   ├── logo: "ORGA SOFT"
│   ├── logoImageUrl: "..."
│   ├── favicon: "..."
│   ├── theme/
│   │   ├── primaryColor: "#1e3a8a"
│   │   └── secondaryColor: "#3b82f6"
│   ├── navLabels/
│   │   ├── home/
│   │   ├── about/
│   │   ├── products/
│   │   └── contact/
│   ├── hero/
│   │   ├── title/
│   │   ├── subtitle/
│   │   └── image
│   ├── about/
│   │   ├── title/
│   │   ├── content/
│   │   ├── image
│   │   └── stats/
│   ├── products/
│   │   └── [array of products]
│   ├── partners/
│   │   └── [array of partners]
│   ├── contacts/
│   │   ├── address/
│   │   ├── phoneSupport
│   │   ├── phoneAdmin
│   │   ├── email
│   │   ├── mapEmbedUrl
│   │   ├── facebook
│   │   ├── twitter
│   │   └── youtube
│   └── uiStrings/
│       └── [all UI text translations]
└── userPreferences/
    └── language: "ar" | "en"
```

## API Functions

### Core Functions

#### `saveSiteDataToFirebase(data: SiteContent)`
Saves complete site data to Firebase.

```typescript
await saveSiteDataToFirebase(siteData);
```

#### `loadSiteDataFromFirebase()`
Loads site data from Firebase.

```typescript
const data = await loadSiteDataFromFirebase();
```

#### `subscribeSiteDataUpdates(callback)`
Subscribe to real-time updates.

```typescript
const unsubscribe = subscribeSiteDataUpdates((data) => {
  console.log('Data updated:', data);
});

// Cleanup
unsubscribe();
```

#### `updateSiteDataField(path, value)`
Update a specific field.

```typescript
await updateSiteDataField('logo', 'NEW LOGO');
await updateSiteDataField('products/0/name/en', 'Updated Name');
```

#### `saveLanguagePreference(lang)`
Save user language preference.

```typescript
await saveLanguagePreference('ar');
```

#### `loadLanguagePreference()`
Load user language preference.

```typescript
const lang = await loadLanguagePreference();
```

#### `initializeSiteData(initialData)`
Initialize Firebase with default data (first-time setup).

```typescript
await initializeSiteData(INITIAL_SITE_DATA);
```

#### `batchUpdateSiteData(updates)`
Update multiple fields at once.

```typescript
await batchUpdateSiteData({
  'logo': 'NEW LOGO',
  'theme/primaryColor': '#000000'
});
```

## How It Works

### 1. **Application Startup**
```
1. App loads → SiteProvider initializes
2. Attempts to load data from Firebase
3. If Firebase has data → Use it
4. If no data → Initialize with INITIAL_SITE_DATA
5. Subscribe to real-time updates
6. Show loading screen during initialization
```

### 2. **Admin Dashboard Updates**
```
1. Admin makes changes in dashboard
2. Clicks "DEPLOY CHANGES" button
3. Data is saved to Firebase
4. Also saved to localStorage as backup
5. Sync indicator shows during save
6. All connected clients receive update instantly
```

### 3. **Real-time Synchronization**
```
1. User A makes changes in admin dashboard
2. Changes are saved to Firebase
3. User B's app receives update via subscription
4. User B's UI updates automatically
5. No page refresh needed
```

## Security Considerations

### Current Setup
- Database is currently open for development
- Anyone with the config can read/write data

### Recommended Production Setup

1. **Enable Firebase Authentication**
```javascript
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth(app);
await signInWithEmailAndPassword(auth, email, password);
```

2. **Set Database Rules**
```json
{
  "rules": {
    "siteData": {
      ".read": true,
      ".write": "auth != null"
    },
    "userPreferences": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

3. **Environment Variables**
Move Firebase config to environment variables:
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ... etc
};
```

## Testing

### Test Data Sync
1. Open admin dashboard in two browser windows
2. Make changes in one window
3. Verify changes appear in the other window
4. Check Firebase Console to see data

### Test Offline Mode
1. Disconnect internet
2. Make changes in admin dashboard
3. Changes saved to localStorage
4. Reconnect internet
5. Changes sync to Firebase

## Firebase Console

Access your Firebase project:
- **Console**: https://console.firebase.google.com/project/orga4soft-35b70
- **Database**: https://console.firebase.google.com/project/orga4soft-35b70/database
- **Analytics**: https://console.firebase.google.com/project/orga4soft-35b70/analytics

## Monitoring

### Check Sync Status
- Green dot in top-right corner = Syncing
- No indicator = Idle
- Loading screen = Initializing

### Console Logs
The app logs all Firebase operations:
- ✅ Success operations
- ❌ Error operations
- ℹ️ Info messages
- 🔄 Update notifications
- 📥 Data loaded
- 🔧 Initialization

## Troubleshooting

### Data Not Syncing
1. Check browser console for errors
2. Verify Firebase config is correct
3. Check internet connection
4. Verify Firebase project is active

### Data Not Loading
1. Check if Firebase has data (Firebase Console)
2. Clear localStorage and refresh
3. Check browser console for errors

### Permission Denied
1. Check Firebase Database Rules
2. Verify authentication if enabled
3. Check API key is valid

## Future Enhancements

1. **Firebase Storage** - For image uploads
2. **Firebase Authentication** - Secure admin access
3. **Cloud Functions** - Server-side logic
4. **Firebase Hosting** - Deploy the app
5. **Performance Monitoring** - Track app performance
6. **Crash Reporting** - Monitor errors

## Support

For Firebase-related issues:
- Firebase Documentation: https://firebase.google.com/docs
- Firebase Support: https://firebase.google.com/support

For application issues:
- Check console logs
- Review this documentation
- Contact development team
