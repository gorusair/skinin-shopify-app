import admin from "firebase-admin";

let firestore;
let firestoreInitializationFailed = false;

function normalizePrivateKey(key) {
  if (!key) {
    return undefined;
  }

  return key.trim().replace(/^"|"$/g, "").replace(/\\n/g, "\n");
}

function logFirebaseAdminDiagnostics(source, credential) {
  console.info(`[Firebase Admin] Using ${source}`, {
    serviceAccountJsonExists: Boolean(
      process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
    ),
    projectIdConfigured: Boolean(credential.projectId ?? credential.project_id),
    clientEmailConfigured: Boolean(
      credential.clientEmail ?? credential.client_email,
    ),
    privateKeyConfigured: Boolean(
      credential.privateKey ?? credential.private_key,
    ),
  });
}

function getFirebaseCredential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
    );
    serviceAccount.private_key = normalizePrivateKey(
      serviceAccount.private_key,
    );

    logFirebaseAdminDiagnostics(
      "FIREBASE_SERVICE_ACCOUNT_JSON",
      serviceAccount,
    );

    return admin.credential.cert(serviceAccount);
  }

  const credential = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY),
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
        credential: getFirebaseCredential(),
      });
    }

    firestore = admin.firestore();
    return firestore;
  } catch (error) {
    firestoreInitializationFailed = true;
    console.warn("Firebase initialization failed");
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
      checkedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.warn("Failed to save ingredient check");
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
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    console.info("[Firestore] Saved Shopify token for shop:", shop);
    return true;
  } catch (error) {
    console.warn("[Firestore] Failed to save Shopify token:", {
      code: error.code,
      message: error.message,
      shop,
    });
    return false;
  }
}

const DEFAULT_SETTINGS = {
  buttonText: "Check Ingredients",
  buttonColor: "#1f2937",
  modalTitle: "Ingredient Check",
  labels: {
    low: "Low concern",
    mid: "Worth noting",
    high: "Potential sensitivity",
  },
  disclaimerText:
    "Ingredient notes are based on the ingredient list in the product description and are for informational purposes only. Not medical advice.",
};

export async function getShopSettings(shop) {
  try {
    const db = getFirestore();
    if (!db) return { ...DEFAULT_SETTINGS, labels: { ...DEFAULT_SETTINGS.labels } };

    const snapshot = await db.collection("shopTokens").doc(shop).get();
    if (!snapshot.exists) return { ...DEFAULT_SETTINGS, labels: { ...DEFAULT_SETTINGS.labels } };

    const saved = snapshot.data()?.settings;
    if (!saved) return { ...DEFAULT_SETTINGS, labels: { ...DEFAULT_SETTINGS.labels } };

    return {
      ...DEFAULT_SETTINGS,
      ...saved,
      labels: { ...DEFAULT_SETTINGS.labels, ...(saved.labels || {}) },
    };
  } catch (error) {
    console.warn("[Firestore] Failed to get shop settings:", {
      shop,
      message: error.message,
    });
    return { ...DEFAULT_SETTINGS, labels: { ...DEFAULT_SETTINGS.labels } };
  }
}

export async function saveShopSettings(shop, settings) {
  try {
    const db = getFirestore();
    if (!db) return false;

    await db
      .collection("shopTokens")
      .doc(shop)
      .set(
        {
          settings,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

    return true;
  } catch (error) {
    console.warn("[Firestore] Failed to save shop settings:", {
      shop,
      message: error.message,
    });
    return false;
  }
}

export async function getShopAccessToken(shop) {
  try {
    const db = getFirestore();

    if (!db) {
      return null;
    }

    const snapshot = await db.collection("shopTokens").doc(shop).get();

    if (!snapshot.exists) {
      return null;
    }

    return snapshot.data()?.accessToken || null;
  } catch (error) {
    console.warn("[Firestore] Failed to get Shopify access token:", {
      code: error.code,
      message: error.message,
      shop,
    });
    return null;
  }
}
