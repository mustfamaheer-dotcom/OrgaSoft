const functions = require('firebase-functions');
const crypto = require('crypto');

const IMAGEKIT_PRIVATE_KEY = functions.config().imagekit.private_key;

exports.imagekitAuth = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const token = crypto.randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 3600;
    const signature = crypto
      .createHmac('sha1', IMAGEKIT_PRIVATE_KEY)
      .update(token + expire)
      .digest('hex');

    res.json({ token, expire, signature });
  } catch (error) {
    console.error('ImageKit auth error:', error);
    res.status(500).json({ error: 'Failed to generate auth params' });
  }
});
