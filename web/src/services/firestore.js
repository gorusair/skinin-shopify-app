import admin from "firebase-admin";

let firestore;

function normalizePrivateKey(privateKey) {
  if (!privateKey) {
    return undefined;
  }

  let normalizedKey = privateKey.trim();

  if (
    (normalizedKey.startsWith('"') && normalizedKey.endsWith('"')) ||
    (normalizedKey.startsWith("'") && normalizedKey.endsWith("'"))
  ) {
    normalizedKey = normalizedKey.slice(1, -1);
  }

  return normalizedKey.replace(/\\n/g, "\n");
}

export function getFirestore() {
  if (firestore) {
    return firestore;
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY)
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

export async function saveShopToken(shop, accessToken) {
  const db = getFirestore();

  await db.collection("shopTokens").doc(shop).set(
    {
      shop,
      accessToken,
      installedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    { merge: true }
  );
}
