import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const createUserProfile = functions.auth.user().onCreate(async (user) => {
  const uid = user.uid;
  const email = user.email || '';
  try {
    await admin.firestore().doc(`users/${uid}`).set({
      uid,
      correo: email,
      role: 'empleado',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      displayName: user.displayName || ''
    });
    console.log(`Created Firestore profile for uid=${uid}`);
  } catch (error) {
    console.error(`Error creating Firestore profile for uid=${uid}:`, error);
    throw error;
  }
});

export const deleteUserProfile = functions.auth.user().onDelete(async (user) => {
  const uid = user.uid;
  const ref = admin.firestore().doc(`users/${uid}`);
  try {
    await ref.delete();
    console.log(`Deleted Firestore profile for uid=${uid}`);
  } catch (error) {
    console.error(`Error deleting Firestore profile for uid=${uid}:`, error);
    // Consider implementing recursive delete of subcollections here if needed.
  }
});
