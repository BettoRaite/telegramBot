import { initializeApp } from "firebase/app";
import errorHandler from "./helpers.js";
import { FIREBASE, SUBJECT_NAMES, COLLECTION_NAME } from "./constants.js";

import { getFirestore, doc, setDoc, getDoc, collection } from "firebase/firestore";

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
};

let app;
let firestoreDb;

export const initializeFirebaseApp = () => {
  try {
    console.log("Firebase app has been initialized!");
    app = initializeApp(firebaseConfig);
    firestoreDb = getFirestore();

    return app;
  } catch (error) {
    errorHandler(error, "initializeFirebaseApp", "firebase.js");
  }
};
export const initFirestoreDb = async () => {
  try {
    for (const subject of SUBJECT_NAMES) {
      const subjectsRef = collection(firestoreDb, COLLECTION_NAME);
      await setDoc(doc(subjectsRef, subject), {});
    }
  } catch (error) {
    errorHandler(error, "initFirestoreDb", "firebase.js");
  }
};
export const uploadProccessedData = async (subjectName, date, uploadData) => {
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

export const getData = async (subjectName, date = "") => {
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

export function removePastDates(subjectData) {
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
export function sortDates(dates) {
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
export function toSortedDates(dates) {
  if (!Array.isArray(dates)) {
    return null;
  }
  const copyDates = Object.assign([], dates);

  copyDates.sort((a, b) => {
    const SEPARATOR = "-";
    const [year1, month1, day1] = a.split(SEPARATOR);
    const [year2, month2, day2] = b.split(SEPARATOR);
    console.log(`a: ${a} b: ${b}`);
    if (year1 > year2) {
      return 1;
    } else if (year1 < year2) {
      return -1;
    }
    if (month1 > month2) {
      return 1;
    } else if (month1 < month2) {
      return -1;
    }
    if (day1 > day2) {
      return 1;
    } else if (day1 < day2) {
      return -1;
    }
    return 0;
  });

  return copyDates;
}

export const getFirebaseApp = () => app;
// TEST *DNN*
export const uploadScheduleData = async (groupName, timeIntervalsArr) => {
  try {
    const GROUPS_COLLECTION_NAME = "groups";

    const uploadData = {
      schedule: JSON.stringify(timeIntervalsArr),
    };

    const docRef = doc(firestoreDb, GROUPS_COLLECTION_NAME, groupName);
    await setDoc(docRef, uploadData);

    return uploadData;
  } catch (error) {
    errorHandler(error, "uploadScheduleData", "firebase.js");
  }
};
export const getStudyTimeIntervals = async (groupName) => {
  try {
    if (typeof groupName !== "string") {
      errorHandler("groupName is expected to be a string", "getStudyTimeIntervals", "firebase.js");
      return null;
    }
    const GROUPS_COLLECTION_NAME = "groups";

    const docRef = doc(firestoreDb, GROUPS_COLLECTION_NAME, groupName);

    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      console.log(data);
      return data;
    } else {
      console.log("doc couldn't be found");
      return null;
    }
  } catch (error) {
    errorHandler(error, "getStudyTimeIntervals", "firebase.js");
  }
};

export async function getUserGroupName(userId) {
  try {
    if (typeof userId !== "string") {
      throw new TypeError("userId is expected to be a string");
    }
    const docRef = doc(firestoreDb, FIREBASE.USERS_COLLECTION_NAME, userId);

    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      return data.groupName;
    } else {
      throw new Error("no such user");
    }
  } catch (error) {
    errorHandler(error, "getUserGroupName", "firebase.js");
    return null;
  }
}
export async function getGroupScheduleData(groupName) {
  try {
    if (typeof groupName !== "string") {
      throw new TypeError("groupName is expected to be a string");
    }
    const docRef = doc(firestoreDb, FIREBASE.GROUPS_COLLECTION_NAME, groupName);

    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      return data;
    } else {
      throw new Error("no such group");
    }
  } catch (error) {
    errorHandler(error, "getUserGroupName", "firebase.js");
    return null;
  }
}

export function getUserTimezoneHours() {
  return 5;
}
