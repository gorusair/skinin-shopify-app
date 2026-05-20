 import admin from "firebase-admin";

  let firestore;
  let firestoreInitializationFailed = false;

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

    if (firestoreInitializationFailed) {
      return null;
    }

    try {
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
    } catch (error) {
      firestoreInitializationFailed = true;
      console.warn("Firebase initialization failed:", error.message);
      return null;
    }
  }

  export async function saveIngredientCheck(check) {
    try {
      const db = getFirestore();

      if (!db) {
        return false;
      }

      await db.collection("ingredientChecks").add({
        ...check,
        checkedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return true;
    } catch (error) {
      console.warn("Failed to save ingredient check:", error.message);
      return false;
    }
  }

  export async function saveShopToken(shop, accessToken) {
    try {
      const db = getFirestore();

      if (!db) {
        return false;
      }

      await db.collection("shopTokens").doc(shop).set(
        {
          shop,
          accessToken,
          installedAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        },
        { merge: true }
      );

      return true;
    } catch (error) {
      console.warn(`Failed to save Shopify token for ${shop}:`, error.message);
      return false;
    }
  }

