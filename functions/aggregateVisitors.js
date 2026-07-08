const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.aggregateVisitorStats = functions.pubsub.schedule('every 1 hours').onRun(async () => {
  const db = admin.firestore();
  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  try {
    const since = new Date(now);
    since.setHours(since.getHours() - 1);
    const snap = await db.collection('visitorEvents')
      .where('createdAt', '>=', since)
      .get();

    if (snap.empty) return null;

    const events = snap.docs.map(d => d.data());
    const totalPageViews = events.filter(e => e.eventType === 'pageview').length;
    const uniqueSessions = new Set(events.map(e => e.sessionId)).size;
    const ctaClicks = events.filter(e => e.eventType === 'cta_click').length;
    const whatsappClicks = events.filter(e => e.eventType === 'whatsapp_click').length;
    const phoneClicks = events.filter(e => e.eventType === 'phone_click').length;

    const pageCounts = {};
    events.filter(e => e.eventType === 'pageview').forEach(e => {
      pageCounts[e.page] = (pageCounts[e.page] || 0) + 1;
    });
    const topPages = Object.entries(pageCounts).map(([page, views]) => ({ page, views }));

    const deviceCounts = {};
    events.forEach(e => {
      if (e.deviceType) deviceCounts[e.deviceType] = (deviceCounts[e.deviceType] || 0) + 1;
    });
    const devices = Object.entries(deviceCounts).map(([device, count]) => ({ device, count }));

    const langCounts = {};
    events.forEach(e => {
      if (e.language) langCounts[e.language] = (langCounts[e.language] || 0) + 1;
    });
    const languages = Object.entries(langCounts).map(([language, count]) => ({ language, count }));

    const docRef = db.collection('visitorStats').doc(today);
    await docRef.set({
      date: today,
      totalPageViews: admin.firestore.FieldValue.increment(totalPageViews),
      uniqueSessions: admin.firestore.FieldValue.increment(uniqueSessions),
      ctaClicks: admin.firestore.FieldValue.increment(ctaClicks),
      whatsappClicks: admin.firestore.FieldValue.increment(whatsappClicks),
      phoneClicks: admin.firestore.FieldValue.increment(phoneClicks),
      topPages,
      devices,
      languages,
    }, { merge: true });

    console.log(`Aggregated ${events.length} events for ${today}`);
    return null;
  } catch (error) {
    console.error('Aggregation failed:', error);
    return null;
  }
});
