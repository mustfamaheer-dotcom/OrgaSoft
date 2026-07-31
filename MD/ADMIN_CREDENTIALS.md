# 🔐 Admin Credentials

## Firebase Authentication

The admin dashboard now uses Firebase Authentication for secure login.

### Production Credentials (Firebase)

**Email:** `admin@orga4soft.com`  
**Password:** *(set in Firebase Console → Authentication → Users — never commit it to the repository)*

### Development Fallback Credentials

> ⚠️ **Removed for security.** The dev fallback login was never implemented in code
> and must not be added. All logins go through Firebase Authentication only.

---

## How Login Works

### 1. Firebase Authentication (Primary)
- User enters email and password
- System attempts Firebase Authentication
- If successful, user is logged in
- Session is managed by Firebase

### 2. Fallback Authentication (Development)
- If Firebase fails, system tries fallback
- Checks if username is "admin" and password is "admin"
- Only for development/testing purposes

---

## Setting Up Firebase Authentication

### Step 1: Enable Email/Password Authentication

1. Go to Firebase Console: https://console.firebase.google.com/project/orga4soft-35b70
2. Click "Authentication" in the left sidebar
3. Click "Get Started" (if not already enabled)
4. Go to "Sign-in method" tab
5. Click "Email/Password"
6. Enable it and click "Save"

### Step 2: Add Admin User

1. In Firebase Console, go to "Authentication"
2. Click "Users" tab
3. Click "Add user"
4. Enter:
   - **Email:** `admin@orga4soft.com`
   - **Password:** *(choose a strong password, keep it in your password manager)*
5. Click "Add user"

### Step 3: Test Login

1. Go to your app's admin page
2. Enter the Firebase credentials
3. You should be logged in successfully

---

## Security Features

### Current Implementation

✅ Firebase Authentication integration  
✅ Secure password handling  
✅ Session management  
✅ Logout functionality  
✅ Fallback for development  

### Recommended Enhancements

1. **Password Reset**
   - Implement "Forgot Password" feature
   - Use Firebase password reset email

2. **Multi-Factor Authentication**
   - Add 2FA for extra security
   - Use Firebase MFA

3. **Role-Based Access**
   - Create different admin roles
   - Limit access based on role

4. **Session Timeout**
   - Auto-logout after inactivity
   - Configurable timeout period

5. **Login Attempts Limit**
   - Block after X failed attempts
   - Temporary account lockout

---

## Changing Admin Password

### Method 1: Firebase Console

1. Go to Firebase Console → Authentication → Users
2. Find the admin user
3. Click the three dots (⋮)
4. Click "Reset password"
5. Enter new password

### Method 2: In Application (Future Feature)

Add a "Change Password" section in admin dashboard:
```typescript
import { updatePassword } from 'firebase/auth';

const changePassword = async (newPassword: string) => {
  const user = auth.currentUser;
  if (user) {
    await updatePassword(user, newPassword);
  }
};
```

---

## Adding More Admin Users

### Via Firebase Console

1. Go to Authentication → Users
2. Click "Add user"
3. Enter email and password
4. Click "Add user"

### Via Code (Future Feature)

```typescript
import { createUserWithEmailAndPassword } from 'firebase/auth';

const addAdmin = async (email: string, password: string) => {
  await createUserWithEmailAndPassword(auth, email, password);
};
```

---

## Troubleshooting

### "Invalid credentials" error

**Check:**
- Email is exactly: `admin@orga4soft.com`
- The Firebase Authentication user has the correct password
- Email/Password authentication is enabled in Firebase
- User exists in Firebase Authentication

### "Too many requests" error

**Solution:**
- Wait a few minutes
- Firebase temporarily blocks after multiple failed attempts
- This is a security feature

### Firebase Authentication not working

- Check browser console for errors
- Verify Firebase Authentication is enabled
- Do NOT add a client-side fallback password — it would be exposed to everyone

---

## Security Best Practices

### ✅ DO:
- Use strong passwords
- Enable 2FA when available
- Regularly update passwords
- Monitor login attempts
- Use HTTPS only
- Keep credentials secret

### ❌ DON'T:
- Share admin credentials
- Use simple passwords
- Store passwords in plain text
- Commit credentials to git
- Use same password everywhere
- Leave sessions open

---

## Environment Variables (Recommended)

For production, store credentials in environment variables:

```bash
# .env.local
VITE_ADMIN_EMAIL=admin@orga.com
VITE_ADMIN_PASSWORD=your-secure-password
```

Then use in code:
```typescript
const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
```

---

## Login Flow Diagram

```
User enters credentials
        ↓
Try Firebase Authentication
        ↓
    Success? ──Yes──→ Login successful
        ↓
       No
        ↓
Try fallback (admin/admin)
        ↓
    Success? ──Yes──→ Login successful
        ↓
       No
        ↓
Show error message
```

---

## Session Management

### Current Behavior
- Session persists until logout
- Managed by Firebase
- Survives page refresh
- Cleared on logout

### Future Enhancements
- Auto-logout after 30 minutes inactivity
- "Remember me" option
- Session timeout warning
- Multiple device management

---

## Quick Reference

| Purpose | Email | Password |
|---------|-------|----------|
| Production | admin@orga4soft.com | Set in Firebase Console — never commit it |

**⚠️ Never commit credentials to the repository. This file only documents the login flow.**

---

## Support

For authentication issues:
1. Check Firebase Console → Authentication
2. Verify user exists
3. Check browser console for errors
4. Try fallback credentials
5. Review this documentation
