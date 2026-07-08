import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { app } from '../firebase';
import logger from './logger';

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 30000;

let authInstance: ReturnType<typeof getAuth> | null = null;
function getFirebaseAuth() {
  if (!authInstance) {
    authInstance = getAuth(app);
  }
  return authInstance;
}

export const ADMIN_EMAIL = 'admin@orga4soft.com';

let loginAttempts = 0;
let lockoutTimer: ReturnType<typeof setTimeout> | null = null;
let lockoutUntil = 0;

export function getLoginStatus(): { locked: boolean; remainingTime: number; attemptsLeft: number } {
  const now = Date.now();
  if (now < lockoutUntil) {
    return { locked: true, remainingTime: lockoutUntil - now, attemptsLeft: 0 };
  }
  return { locked: false, remainingTime: 0, attemptsLeft: MAX_ATTEMPTS - loginAttempts };
}

export function resetLoginAttempts(): void {
  loginAttempts = 0;
  if (lockoutTimer) {
    clearTimeout(lockoutTimer);
    lockoutTimer = null;
  }
  lockoutUntil = 0;
}

export const loginWithFirebase = async (email: string, password: string): Promise<User> => {
  const status = getLoginStatus();
  if (status.locked) {
    throw new Error(`Too many attempts. Try again in ${Math.ceil(status.remainingTime / 1000)}s.`);
  }

  try {
    const userCredential = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
    logger.log('User logged in:', userCredential.user.email);
    loginAttempts = 0;
    return userCredential.user;
  } catch (error: any) {
    loginAttempts++;
    logger.error('Login error:', error.message);

    if (loginAttempts >= MAX_ATTEMPTS) {
      lockoutUntil = Date.now() + LOCKOUT_DURATION;
      if (lockoutTimer) clearTimeout(lockoutTimer);
      lockoutTimer = setTimeout(() => {
        lockoutUntil = 0;
        loginAttempts = 0;
      }, LOCKOUT_DURATION);
      throw new Error(`Too many attempts. Try again in ${LOCKOUT_DURATION / 1000}s.`);
    }

    throw new Error(loginErrorMessage(error.code));
  }
};

export const logoutFromFirebase = async (): Promise<void> => {
  try {
    await signOut(getFirebaseAuth());
    logger.log('User logged out');
  } catch (error: any) {
    logger.error('Logout error:', error.message);
    throw error;
  }
};

export const onAuthChange = (callback: (user: User | null) => void): (() => void) => {
  return onAuthStateChanged(getFirebaseAuth(), callback);
};

export const getCurrentUser = (): User | null => {
  return getFirebaseAuth().currentUser;
};

function loginErrorMessage(code: string): string {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password.';
    case 'auth/invalid-email':
      return 'Invalid email format.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection.';
    default:
      return 'Authentication failed. Please try again.';
  }
}
