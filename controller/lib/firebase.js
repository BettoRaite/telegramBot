import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection } from "firebase/firestore";
import errorHandler from "./helpers.js";
import { FIREBASE_COLLECTIONS, SUBJECT_NAMES } from "./constants.js";
import { isObject } from "./utils/typeChecking.js";
import "dotenv/config.js";
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

export const fetchUserGroupId = async (userId) => {
  if (typeof userId !== "string") {
    // userId is not a string -> throw *DNN*
    throw new TypeError("userId is expected to be a string");
  }

  const docRef = doc(firestoreDb, FIREBASE_COLLECTIONS.users, userId);
  // firebase error -> fatal error
  const snapshot = await getDoc(docRef);

  if (snapshot.exists()) {
    const data = snapshot.data();
    const groupId = data.groupId;
    // no group -> fatal error (user must be member of a group to use time feature) *DNN*
    if (typeof groupId === "string") {
      return groupId;
    }
    throw new SyntaxError("user is not a member of any group");
  } else {
    // no such user -> fatal error *DNN*
    throw new SyntaxError("user doesn't exist");
  }
};
export const fetchDataOnGroup = async (groupId) => {
  if (typeof groupId !== "string") {
    throw new TypeError("groupId is expected to be a string");
  }
  const docRef = doc(firestoreDb, FIREBASE_COLLECTIONS.groups, groupId);

  const snapshot = await getDoc(docRef);

  if (snapshot.exists()) {
    const data = snapshot.data();
    return data;
  } else {
    throw new SyntaxError("group doesn't exist");
  }
};
export const fetchGroupStudySchedules = async (groupName) => {
  if (typeof groupName !== "string") {
    throw new TypeError("groupName is expected to be a string");
  }
  const docRef = doc(firestoreDb, FIREBASE_COLLECTIONS.groups, groupName);

  const snapshot = await getDoc(docRef);

  if (snapshot.exists()) {
    const data = fetchDataOnGroup(groupName);
    const studySchedule = data.schedule;
    if (isObject(studySchedule)) {
      return studySchedule;
    }
    // schedule isn't set up, so return null, and ask the user to set it
    return null;
  } else {
    throw new SyntaxError("no such group");
  }
};

export const fetchGroupTimezone = async (groupName) => {
  if (typeof groupName !== "string") {
    throw new TypeError("groupName is expected to be a string");
  }
  const docRef = doc(firestoreDb, FIREBASE_COLLECTIONS.groups, groupName);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    const data = snapshot.data();
  }
};
