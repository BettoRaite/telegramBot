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

const uploadProccessedData = async (subjectName, id, data) => {
  const dataToUpload = {
    [id]: data,
  };
  try {
    const docRef = doc(firestoreDb, COLLECTION_NAME, subjectName);
    await setDoc(docRef, dataToUpload);

    return data;
  } catch (error) {
    errorHandler(error, "firebase-uploadProcessedData");
  }
};
const getDataOnDate = async (subjectName, date) => {
  try {
    if (typeof subjectName !== "string" || typeof date !== "string") {
      errorHandler("Subject name and date must be of type string", "getDataOnDate", "firebase");
      return;
    }
    // Getting data on a certain subject *DDN*
    const docRef = doc(firestoreDb, COLLECTION_NAME, subjectName);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      console.log("Doc exists");
      const docData = snapshot.data();
      // Getting data under certain date *DDN*
      const specificDateData = docData[date];
      // if there is field with data create one *DDN*
      if (specificDateData) {
        return specificDateData;
      }
      // initializing empty field on a certain date
      return await uploadProccessedData(subjectName, date, {});
    } else {
      console.log("Document not found!");
    }
  } catch (error) {
    errorHandler(error, "firebase-getDataOnDate", "firebase");
  }
};
const getData = async (subjectName) => {
  try {
    if (typeof subjectName !== "string") {
      errorHandler("Subject name and date must be of type string", "getData", "firebase");
      return;
    }
    // Getting data on a certain subject *DDN*
    const docRef = doc(firestoreDb, COLLECTION_NAME, subjectName);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      console.log("Doc exists 'get data'");
      const docData = snapshot.data();
      return docData;
    } else {
      console.log("Document not found!");
    }
  } catch (error) {
    errorHandler(error, "firebase-getDataOnDate", "firebase");
  }
};

const getFirebaseApp = () => app;

module.exports = {
  initializeFirebaseApp,
  initFirestoreDb,
  getFirebaseApp,
  uploadProccessedData,
  getDataOnDate,
  getData,
};
