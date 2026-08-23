const fs = require('fs');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');
const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => { const m = line.match(/^VITE_FIREBASE_(\w+)=(.+)$/); if (m) env[m[1]] = m[2].trim(); });
const app = initializeApp({ apiKey: env.API_KEY, authDomain: env.AUTH_DOMAIN, projectId: env.PROJECT_ID, storageBucket: env.STORAGE_BUCKET, messagingSenderId: env.MESSAGING_SENDER_ID, appId: env.APP_ID });
const db = getFirestore(app);
(async () => {
  try {
    const snap = await getDoc(doc(db, 'siteData', 'main'));
    if (!snap.exists()) { console.log('no doc'); process.exit(0); }
    const d = snap.data();
    const dump = (arr, label) => (arr || []).map(s => ({ id: s.id, name: s.name, image: s.image || '(none)', icon: s.icon || '(none)', enabled: s.enabled }));
    console.log('=== services.items ===');
    console.log(JSON.stringify(dump(d.services && d.services.items, 'services'), null, 2));
    console.log('=== orgaProServices.items ===');
    console.log(JSON.stringify(dump(d.orgaProServices && d.orgaProServices.items, 'orgaPro'), null, 2));
    process.exit(0);
  } catch (e) { console.error('Error:', e.message); process.exit(1); }
})();
