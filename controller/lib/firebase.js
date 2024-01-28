const { initializeApp } = require("firebase/app");
const { errorHandler } = require("./helpers");
const { SUBJECT_NAMES, COLLECTION_NAME } = require("./constants");

const { getFirestore, doc, setDoc, getDoc, collection } = require("firebase/firestore");

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

const initializeFirebaseApp = () => {
  try {
    app = initializeApp(firebaseConfig);
    firestoreDb = getFirestore();

    return app;
  } catch (error) {
    errorHandler(error, "initializeFirebaseApp", "firebase.js");
  }
};
const initFirestoreDb = async () => {
  try {
    for (const subject of SUBJECT_NAMES) {
      const subjectsRef = collection(firestoreDb, COLLECTION_NAME);
      await setDoc(doc(subjectsRef, subject), {});
    }
  } catch (error) {
    errorHandler(error, "initFirestoreDb", "firebase.js");
  }
};
const uploadProccessedData = async (subjectName, date, uploadData) => {
  try {
    const subjectData = await getData(subjectName);
    if (subjectData == null) {
      errorHandler("subject data is null", "uploadProcessedData", "firebase.js");
      return null;
    }

    removePastDates(subjectData);
    subjectData[date] = uploadData;
    const docRef = doc(firestoreDb, COLLECTION_NAME, subjectName);
    await setDoc(docRef, subjectData);

    return subjectData;
  } catch (error) {
    errorHandler(error, "uploadProcessedData", "firebase.js");
  }
};

const getData = async (subjectName, date = "") => {
  try {
    if (typeof subjectName !== "string" || typeof date !== "string") {
      errorHandler("Subject name and date must be of type string", "getData", "firebase");
      return;
    }
    // Getting data on a certain subject *DDN*
    const docRef = doc(firestoreDb, COLLECTION_NAME, subjectName);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      const docData = snapshot.data();
      if (!date) {
        return docData;
      }
      // Getting data under certain date *DDN*
      const specificDateData = docData[date];
      // if there is field with data create one *DDN*
      if (specificDateData) {
        return specificDateData;
      }
      // if there is no data on the current date then send empty object*DDN*
      return {};
    } else {
      errorHandler("Undefined reference", "getData", "firebase.js");
      return null;
    }
  } catch (error) {
    errorHandler(error, "getData", "firebase.js");
  }
};

function removePastDates(subjectData) {
  const MAX_FIELDS_PER_SUBJECT = 3;
  const dates = Object.keys(subjectData);

  if (dates.length > MAX_FIELDS_PER_SUBJECT) {
    const lastDate = sortDates(dates)[0];
    console.log(lastDate);
    delete subjectData[lastDate];
    return subjectData;
  }
  return subjectData;
}
function sortDates(dates) {
  if (!Array.isArray(dates)) {
    return null;
  }

  const SEPARATOR = "-";
  const datesLen = dates.length;

  const swap = (i) => {
    const swap = dates[i + 1];
    dates[i + 1] = dates[i];
    dates[i] = swap;
  };

  for (let c = 0; c < datesLen; ++c) {
    for (let i = 0; i < datesLen - 1; ++i) {
      const dateComponents = dates[i].split(SEPARATOR);
      const [year, month, day] = dateComponents.map((component) => Number(component));

      const nextDateComponents = dates[i + 1].split(SEPARATOR);
      const [nextYear, nextMonth, nextDay] = nextDateComponents.map((component) =>
        Number(component)
      );
      if (year > nextYear) {
        swap(i);
      } else if (year == nextYear) {
        if (month > nextMonth) {
          swap(i);
        } else if (month == nextMonth) {
          if (day > nextDay) {
            swap(i);
          }
          continue;
        }
      }
    }
  }
  return dates;
}
const getFirebaseApp = () => app;

module.exports = {
  initializeFirebaseApp,
  initFirestoreDb,
  getFirebaseApp,
  uploadProccessedData,
  getData,
  removePastDates,
  sortDates,
};
