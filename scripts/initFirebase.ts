import { readFileSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA0WbhM687P5RksCCPh2jfkiRFOBANaq0E',
  authDomain: 'orga4softwebsite.firebaseapp.com',
  projectId: 'orga4softwebsite',
  storageBucket: 'orga4softwebsite.firebasestorage.app',
  messagingSenderId: '659577590380',
  appId: '1:659577590380:web:9b05c36f5ce9f018b17e49',
};

function cleanData(obj: any): any {
  if (typeof obj === 'string' && obj.length > 1000000) return '';
  if (Array.isArray(obj)) return obj.map(cleanData);
  if (obj && typeof obj === 'object') {
    const cleaned: any = {};
    for (const [k, v] of Object.entries(obj)) cleaned[k] = cleanData(v);
    return cleaned;
  }
  return obj;
}

async function main() {
  try {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    await signInWithEmailAndPassword(auth, 'admin@orga4soft.com', 'admin@orga4soft.com');
    const db = getFirestore(app);
    console.log('Authenticated');

    const raw = readFileSync('orga4soft-35b70-default-rtdb-export.json', 'utf-8');
    const siteData = JSON.parse(raw).siteData;
    const cleaned = cleanData(siteData);

    console.log('Writing all sections to siteData/main...');
    await setDoc(doc(db, 'siteData', 'main'), cleaned);
    console.log('siteData/main written');

    await setDoc(doc(db, 'userPreferences', 'language'), { value: 'ar' });
    console.log('userPreferences/language written');

    // Verify
    const snap = await getDoc(doc(db, 'siteData', 'main'));
    if (snap.exists()) {
      const data = snap.data();
      console.log(`\nVerification: ${Object.keys(data).length} root keys in Firestore`);
      console.log(`  Products: ${data.products?.length || 0} products`);
      console.log(`  Partners: ${data.partners?.length || 0} partners`);
      console.log(`  Image fields > 1MB stripped: ${data.products?.filter((p: any) => !p.image).length || 0}`);
      await setDoc(doc(db, 'siteData', 'main'), { uiStrings: cleaned.uiStrings }, { merge: true });
    }

    // Cleanup debug docs
    try { await deleteDoc(doc(db, '_test', 'product_0')); } catch {}
    try { await deleteDoc(doc(db, '_test', 'product_1')); } catch {}
    try { await deleteDoc(doc(db, '_test', 'product_2')); } catch {}
    try { await deleteDoc(doc(db, '_test', 'field_image')); } catch {}

    console.log('\nImport complete!');
    process.exit(0);
  } catch (error: any) {
    console.error('Error:', error.code || error.message || error);
    process.exit(1);
  }
}

main();
