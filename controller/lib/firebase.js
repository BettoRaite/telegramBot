const { initializeApp } = require("firebase/app");
const { errorHandler } = require("./helpers");
const { SUBJECT_NAMES } = require("./constants");
const {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  getDoc,
  query,
  collection,
  getDocs,
  updateDoc,
  limit,
} = require("firebase/firestore");

const {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
} = process.env;

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};

let app;
let firestoreDb;
const COLLECTION_NAME = "subjects";
const initializeFirebaseApp = () => {
  try {
    app = initializeApp(firebaseConfig);
    firestoreDb = getFirestore();
    return app;
  } catch (error) {
    errorHandler(error, "firebase-initializeFirebaseApp");
  }
};
/*
  What is I have a subject like russian
  and I create three docs under it like date1, date2,date3

*/
const initFirestoreDb = async () => {
  try {
    for (const subject of SUBJECT_NAMES) {
      const subjectsRef = collection(firestoreDb, COLLECTION_NAME);
      await setDoc(doc(subjectsRef, subject), {});
    }
  } catch (error) {
    errorHandler(error, "firebase-initFirestoreDb");
  }
};
const createSubjectDoc = async (subjectName) => {
  try {
    const subjectsRef = collection(firestoreDb, COLLECTION_NAME);
    const dataUpdated = await setDoc(doc(subjectsRef, subjectName));
    return dataUpdated;
  } catch (error) {
    errorHandler(error, "firebase-createSubjectDoc");
  }
};
const uploadProccessedData = async (subjectName, date, description) => {
  const dataToUpload = {
    [date]: description,
  };
  try {
    console.log(date);
    const docRef = doc(firestoreDb, `${COLLECTION_NAME}/${subjectName}`);
    const dataUpdated = await updateDoc(docRef, dataToUpload, { merge: true });
    return dataUpdated;
  } catch (error) {
    errorHandler(error, "firebase-uploadProcessedData");
  }
};
const getData = async (subjectName) => {
  try {
    const docRef = doc(firestoreDb, COLLECTION_NAME, subjectName);
    // const q = query(docRef, limit(3));
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const docData = snapshot.data();
      console.log(JSON.stringify(docData, null, 4));
      return docData;
    } else {
      console.log("Document not found!");
    }
  } catch (error) {
    errorHandler(error, "firebase-getData");
  }
};
const getFirebaseApp = () => app;

module.exports = {
  initializeFirebaseApp,
  initFirestoreDb,
  getFirebaseApp,
  uploadProccessedData,
  getData,
};
