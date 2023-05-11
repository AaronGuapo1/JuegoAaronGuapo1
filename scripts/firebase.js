import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  orderBy,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";



const firebaseConfig = {

    apiKey: "AIzaSyDyl_AL3NkFnPGfkt70I1K1tRilD8eWX-s",
  authDomain: "app-950f2.firebaseapp.com",
  projectId: "app-950f2",
  storageBucket: "app-950f2.appspot.com",
  messagingSenderId: "760773890074",
  appId: "1:760773890074:web:349073d72a17b4a47cc1a3",
  measurementId: "G-RG8GE1TLK0"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)/**
* Save a New Task in Firestore
* @param {string} title the title of the Task
* @param {string} description the description of the Task
*/
export const saveTask = (title, description,stats) =>
 addDoc(collection(db, "aaronguapo"), { title, description,stats });

export const onGetTasks = (callback) =>
 onSnapshot(collection(db, "aaronguapo"), callback);

/**
*
* @param {string} id Task ID
*/
export const deleteTask = (id) => deleteDoc(doc(db, "aaronguapo", id));

export const getTask = (id) => getDoc(doc(db, "aaronguapo", id));

export const updateTask = (id, newFields) =>
 updateDoc(doc(db, "aaronguapo", id), newFields);

 export const getTasks = async (orderByField) => {
  const tasksSnapshot = await getDocs(
    query(collection(db, "aaronguapo"), orderBy(orderByField))
  );
  const tasks = tasksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return tasks;
};

