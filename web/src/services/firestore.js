 import admin from "firebase-admin";

  let firestore;
  let firestoreInitializationFailed = false;

  function normalizePrivateKey(key) {
    if (!key) {
      return undefined;
    }

    return key
      .trim()
      .replace(/^"|"$/g, "")
      .replace(/\\n/g, "\n");
  }

  function logFirebaseAdminDiagnostics(privateKey) {
    console.info("Firebase Admin SDK initialization diagnostics:", {
      hasProjectId: Boolean(process.env.FIREBASE_PROJECT_ID),
      projectId: process.env.FIREBASE_PROJECT_ID,
      hasClientEmail: Boolean(process.env.FIREBASE_CLIENT_EMAIL),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      hasRawPrivateKey: Boolean(process.env.FIREBASE_PRIVATE_KEY),
      hasNormalizedPrivateKey: Boolean(privateKey),
      normalizedPrivateKeyHasBeginMarker: privateKey?.includes("BEGIN PRIVATE KEY") ?? false,
      normalizedPrivateKeyHasEndMarker: privateKey?.includes("END PRIVATE KEY") ?? false,
      normalizedPrivateKeyLength: privateKey?.length ?? 0
    });
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
        const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
        logFirebaseAdminDiagnostics(privateKey);

        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey
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
      console.warn(`Failed to save Shopify token for ${shop}:`, {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      return false;
    }
  }
