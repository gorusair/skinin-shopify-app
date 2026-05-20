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

  function logFirebaseAdminDiagnostics(source, credential) {
    const privateKey = credential.privateKey ?? credential.private_key;

    console.info(`[Firebase Admin] Using ${source}`, {
      serviceAccountJsonExists: Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON),
      projectId: credential.projectId ?? credential.project_id,
      clientEmail: credential.clientEmail ?? credential.client_email,
      privateKeyExists: Boolean(privateKey),
      privateKeyHasBegin: privateKey?.includes("BEGIN PRIVATE KEY") ?? false,
      privateKeyHasEnd: privateKey?.includes("END PRIVATE KEY") ?? false,
      privateKeyLength: privateKey?.length ?? 0
    });
  }

  function getFirebaseCredential() {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      serviceAccount.private_key = normalizePrivateKey(serviceAccount.private_key);

      logFirebaseAdminDiagnostics("FIREBASE_SERVICE_ACCOUNT_JSON", serviceAccount);

      return admin.credential.cert(serviceAccount);
    }

    const credential = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY)
    };

    logFirebaseAdminDiagnostics("split env vars", credential);

    return admin.credential.cert(credential);
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
          credential: getFirebaseCredential()
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
      console.info("[Firestore] saveShopToken called for shop:", shop);

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

      console.info("[Firestore] Saved Shopify token for shop:", shop);
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
