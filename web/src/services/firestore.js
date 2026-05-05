import admin from "firebase-admin";

let firestore;

export function getFirestore() {
  if (firestore) {
    return firestore;
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
      })
    });
  }

  firestore = admin.firestore();
  return firestore;
}

export async function saveIngredientCheck(check) {
  const db = getFirestore();

  await db.collection("ingredientChecks").add({
    ...check,
    checkedAt: admin.firestore.FieldValue.serverTimestamp()
  });
}
