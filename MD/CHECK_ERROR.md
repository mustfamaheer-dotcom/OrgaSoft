# 🔍 Check Firebase Error

## What to Do Now

### Step 1: Open Browser Console
1. Press **F12** on your keyboard
2. Click the **"Console"** tab
3. Keep it open

### Step 2: Try to Save Again
1. Make a small change (like changing logo text)
2. Click **"DEPLOY CHANGES"**
3. Look at the console

### Step 3: Find the Error

Look for messages starting with:
- ❌ (red X)
- Error
- Failed

Copy the COMPLETE error message.

## Common Errors and Solutions

### Error 1: "PERMISSION_DENIED"

**Full error might look like:**
```
Error: Permission denied
code: "PERMISSION_DENIED"
```

**Solution:**
1. Go to: https://console.firebase.google.com/project/orga4soft-35b70/database
2. Click **"Rules"** tab
3. Change to:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
4. Click **"Publish"**

### Error 2: "Network request failed"

**Full error might look like:**
```
Error: Network request failed
Failed to fetch
```

**Solution:**
- Check internet connection
- Check if Firebase is blocked by firewall
- Try disabling VPN
- Check if you can access: https://firebase.google.com

### Error 3: "Database not found"

**Full error might look like:**
```
Error: Database not found
404 Not Found
```

**Solution:**
1. Go to Firebase Console
2. Create Realtime Database
3. Follow steps in FIREBASE_FIX.md

### Error 4: "Invalid data"

**Full error might look like:**
```
Error: Invalid data
Cannot convert undefined or null to object
```

**Solution:**
- Data might be corrupted
- Clear localStorage:
```javascript
localStorage.clear();
location.reload();
```

## Quick Test

### Test 1: Check if Firebase is accessible

Open console and paste:

```javascript
fetch('https://orga4soft-35b70-default-rtdb.firebaseio.com/.json')
  .then(r => {
    console.log('Status:', r.status);
    return r.json();
  })
  .then(d => console.log('✅ Firebase accessible:', d))
  .catch(e => console.error('❌ Firebase error:', e));
```

**Expected result:** Should show status 200 and some data or empty object

### Test 2: Check if you can write

```javascript
fetch('https://orga4soft-35b70-default-rtdb.firebaseio.com/test.json', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ test: true, time: Date.now() })
})
  .then(r => {
    console.log('Status:', r.status);
    return r.json();
  })
  .then(d => console.log('✅ Write successful:', d))
  .catch(e => console.error('❌ Write failed:', e));
```

**Expected result:** Should show status 200 and the data you sent

**If you get 401 or 403:** Permission denied - fix Firebase rules

### Test 3: Check current data

```javascript
console.log('Current data:', JSON.parse(localStorage.getItem('orgasoft_site_data')));
```

## What to Report

If you need help, provide:

1. **Complete error message from console**
   - Copy everything in red
   - Include error code if shown

2. **Test results**
   - Did Test 1 work? (Yes/No)
   - Did Test 2 work? (Yes/No)
   - What status codes did you get?

3. **Firebase Console screenshots**
   - Database Rules tab
   - Database Data tab

4. **What you changed**
   - Example: "Changed logo text from X to Y"

## Most Likely Issues

### 99% of the time it's one of these:

1. **Firebase Rules** - Not set to allow writes
   - Fix: Set rules to `".write": true`

2. **Database Not Created** - Realtime Database doesn't exist
   - Fix: Create database in Firebase Console

3. **Network Issue** - Can't reach Firebase
   - Fix: Check internet, firewall, VPN

4. **Authentication Required** - Rules require auth but you're not logged in
   - Fix: Either login or change rules

## Quick Fix

Try this in order:

1. **Set Firebase Rules:**
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

2. **Clear Cache:**
```javascript
localStorage.clear();
location.reload();
```

3. **Test Connection:**
Run Test 1 and Test 2 above

4. **Try Save Again:**
Make a change and click save

## Still Not Working?

1. Take screenshot of console errors
2. Take screenshot of Firebase Rules
3. Run all 3 tests above
4. Copy all error messages
5. Check TROUBLESHOOTING.md
