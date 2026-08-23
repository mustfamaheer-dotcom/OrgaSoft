// Dump live Firestore products for accurate testing
const fs = require('fs');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const m = line.match(/^VITE_FIREBASE_(\w+)=(.+)$/);
  if (m) env[m[1]] = m[2].trim();
});

const firebaseConfig = {
  apiKey: env.API_KEY,
  authDomain: env.AUTH_DOMAIN,
  projectId: env.PROJECT_ID,
  storageBucket: env.STORAGE_BUCKET,
  messagingSenderId: env.MESSAGING_SENDER_ID,
  appId: env.APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

(async () => {
  try {
    const snap = await getDoc(doc(db, 'siteData', 'main'));
    if (!snap.exists()) { console.log('[]'); process.exit(0); }
    const data = snap.data();
    const products = (data.products || []).map(p => ({
      id: p.id,
      name: p.name || { en: '', ar: '' },
      descEn: p.description?.en || '',
      descAr: p.description?.ar || '',
      longEn: p.longDescription?.en || '',
      longAr: p.longDescription?.ar || '',
      industries: p.industries || [],
      needs: p.needs || [],
      showOnHome: p.showOnHome !== false,
      enabled: p.enabled !== false,
    }));
    console.log(JSON.stringify(products, null, 2));
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();
