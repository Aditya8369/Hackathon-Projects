const admin = require("firebase-admin")

let firestore = null

function initializeFirebase() {
  if (admin.apps.length > 0) {
    firestore = admin.firestore()
    return firestore
  }

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY

  if (!projectId || !clientEmail || !privateKey) {
    return null
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, "\n"),
    }),
  })

  firestore = admin.firestore()
  return firestore
}

function getFirestore() {
  if (!firestore) {
    return initializeFirebase()
  }

  return firestore
}

module.exports = {
  initializeFirebase,
  getFirestore,
}
