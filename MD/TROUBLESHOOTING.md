# 🔧 Firebase Database Troubleshooting Guide

## Quick Fix Steps

### Step 1: Check Firebase Database Rules

1. Go to Firebase Console: https://console.firebase.google.com/project/orga4soft-35b70/database
2. Click on "Rules" tab
3. Make sure your rules look like this:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

4. Click "Publish" to save the rules

### Step 2: Enable Realtime Database

1. Go to Firebase Console: https://console.firebase.google.com/project/orga4soft-35b70
2. Click on "Realtime Database" in the left menu
3. If you see "Create Database" button, click it
4. Choose your location (e.g., United States)
5. Start in "Test mode" (allows read/write for 30 days)
6. Click "Enable"

### Step 3: Verify Database URL

Make sure your database URL matches in `firebase.ts`:
```
databaseURL: "https://orga4soft-35b70-default-rtdb.firebaseio.com"
```

### Step 4: Clear Browser Cache

1. Open browser DevTools (F12)
2. Go to Application tab
3. Clear Storage → Clear site data
4. Refresh the page

### Step 5: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Common errors and solutions below

---

## Common Errors and Solutions

### Error: "Permission denied"

**Cause:** Database rules are too restrictive

**Solution:**
1. Go to Firebase Console → Database → Rules
2. Set rules to:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
3. Click "Publish"

### Error: "Database not found"

**Cause:** Realtime Database not created

**Solution:**
1. Go to Firebase Console
2. Click "Realtime Database" in left menu
3. Click "Create Database"
4. Choose location and start in test mode

### Error: "Failed to load Firebase"

**Cause:** Network or import issues

**Solution:**
1. Check internet connection
2. Clear browser cache
3. Try in incognito mode
4. Check if Firebase CDN is accessible

### Error: "CORS policy"

**Cause:** Cross-origin request blocked

**Solution:**
1. Make sure you're running on localhost or deployed domain
2. Check Firebase project settings
3. Add your domain to authorized domains in Firebase Console

---

## Manual Database Setup

If automatic initialization doesn't work, manually add data:

### Step 1: Go to Firebase Console
https://console.firebase.google.com/project/orga4soft-35b70/database

### Step 2: Click on "Data" tab

### Step 3: Click the "+" button next to your database name

### Step 4: Add this structure:

```
Root
├── siteData
│   ├── logo: "ORGA SOFT"
│   ├── logoImageUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=300"
│   └── ... (copy from constants.ts)
└── userPreferences
    └── language: "ar"
```

### Step 5: Import JSON

You can also import the entire structure:

1. Click the three dots (⋮) next to your database name
2. Click "Import JSON"
3. Use this JSON:

```json
{
  "siteData": {
    "logo": "ORGA SOFT",
    "logoImageUrl": "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=300&h=300&auto=format&fit=crop",
    "favicon": "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=32&h=32&auto=format&fit=crop"
  },
  "userPreferences": {
    "language": "ar"
  }
}
```

---

## Testing Firebase Connection

### Test 1: Check if Firebase is accessible

Open browser console and run:
```javascript
fetch('https://orga4soft-35b70-default-rtdb.firebaseio.com/.json')
  .then(r => r.json())
  .then(d => console.log('Firebase data:', d))
  .catch(e => console.error('Firebase error:', e));
```

### Test 2: Write test data

```javascript
fetch('https://orga4soft-35b70-default-rtdb.firebaseio.com/test.json', {
  method: 'PUT',
  body: JSON.stringify({ message: 'Hello Firebase!' })
})
  .then(r => r.json())
  .then(d => console.log('Write success:', d))
  .catch(e => console.error('Write error:', e));
```

### Test 3: Read test data

```javascript
fetch('https://orga4soft-35b70-default-rtdb.firebaseio.com/test.json')
  .then(r => r.json())
  .then(d => console.log('Read success:', d))
  .catch(e => console.error('Read error:', e));
```

---

## Fallback: Use LocalStorage Only

If Firebase continues to have issues, you can temporarily disable it:

### Option 1: Comment out Firebase in SiteContext.tsx

Find this line in `context/SiteContext.tsx`:
```typescript
const firebaseData = await loadSiteDataFromFirebase();
```

Replace with:
```typescript
// Temporarily disabled Firebase
const firebaseData = null;
```

### Option 2: Use localStorage only

The app will automatically fall back to localStorage if Firebase fails.

---

## Check Firebase Project Status

### Verify Project is Active

1. Go to: https://console.firebase.google.com/project/orga4soft-35b70
2. Check if project shows "Active" status
3. Check if billing is enabled (if required)
4. Check if Realtime Database is enabled

### Check Service Status

1. Go to: https://status.firebase.google.com/
2. Check if all services are operational
3. Look for any ongoing incidents

---

## Network Issues

### Check if Firebase CDN is accessible

Try accessing these URLs in your browser:
- https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js
- https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js

If they don't load:
1. Check your internet connection
2. Check if firewall is blocking
3. Try using a VPN
4. Try a different network

---

## Still Not Working?

### Collect Debug Information

1. Open browser console (F12)
2. Copy all error messages
3. Check Network tab for failed requests
4. Note the exact error message

### Check These:

- [ ] Firebase project exists and is active
- [ ] Realtime Database is created
- [ ] Database rules allow read/write
- [ ] Database URL is correct in firebase.ts
- [ ] Internet connection is working
- [ ] No firewall blocking Firebase
- [ ] Browser console shows specific error
- [ ] Firebase CDN URLs are accessible

### Contact Information

If you've tried everything:
1. Check Firebase Status: https://status.firebase.google.com/
2. Firebase Support: https://firebase.google.com/support
3. Check documentation files in this project

---

## Alternative: Use Firebase SDK via npm

If CDN imports don't work, install Firebase via npm:

```bash
npm install firebase
```

Then update `firebase.ts` to use npm imports:
```typescript
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue, update } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';
```

This is more reliable than CDN imports.

---

## Success Indicators

You'll know Firebase is working when you see:

### In Browser Console:
```
✅ Firebase initialized successfully
✅ Site data loaded from Firebase successfully
```

### In Firebase Console:
- Data visible under "Data" tab
- No errors in "Rules" tab
- Usage statistics showing reads/writes

### In Application:
- Loading screen appears briefly
- Content loads correctly
- Changes in admin save successfully
- Sync indicator appears when saving
