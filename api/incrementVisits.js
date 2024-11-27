import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK (if not already initialized globally)
// const app = initializeApp({
//     credential: cert({
//         projectId: process.env.FIREBASE_PROJECT_ID,
//         clientEmail: 'derekgou19@gmail.com',
//         privateKey: process.env.FIREBASE_PRIVATE_KEY,
//     }),
// });

// const db = getFirestore(app);

// export default async function handler(req, res) {
//     const origin = req.headers.origin;
//     if (origin !== allowedOrigin) {
//         return res.status(403).json({ error: "Unauthorized request" });
//     }
//     const allowedOrigin = ["https://wcim-app-v2.vercel.app", "https://wcimap.vercel.app/"]; // Add development URLs if needed
//     if (!allowedOrigin.includes(origin)) {
//     return res.status(403).json({ error: "Unauthorized request" });
//     }
//     console.log(origin, req.method)
//     // Verify request origin

//     if (req.method != 'POST') {
//         return res.status(405).json({ error: `${req.method} not allowed` });
//     }

//     try {
//         const docRef = db.collection('analytics').doc('clicks');
//         await db.runTransaction(async (transaction) => {
//         const doc = await transaction.get(docRef);
//         if (!doc.exists) {
//             transaction.set(docRef, { val: 1 });
//         } else {
//             const currentVal = doc?.data()?.val || 0;
//             transaction.update(docRef, { val: currentVal + 1 });
//         }
//         });

//         return res.status(200).json({ message: "Clicks incremented successfully" });
//     } catch (error) {
//         console.error("Error incrementing clicks:", error);
//         return res.status(500).json({ error: "Internal Server Error" });
//     }
// }