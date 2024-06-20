// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
function firebaseConfig() {
const firebaseConfig = {
  apiKey: "AIzaSyAjlqUwJGiO3QCnxqJCN0jxjNMgcBL_xWA",
  authDomain: "precious-birthday.firebaseapp.com",
  projectId: "precious-birthday",
  storageBucket: "precious-birthday.appspot.com",
  messagingSenderId: "263332478578",
  appId: "1:263332478578:web:f606a85a057b0d97fdcceb"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
return getDatabase(app);
}

export default firebaseConfig;