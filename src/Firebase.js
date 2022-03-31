import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDmHcxpdjmOU7E0KAxAr3lyRF9sL95bO04",
  authDomain: "first-project-18ef8.firebaseapp.com",
  databaseURL: "https://first-project-18ef8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "first-project-18ef8",
  storageBucket: "first-project-18ef8.appspot.com",
  messagingSenderId: "963317650155",
  appId: "1:963317650155:web:9a52e0eb9db9427c40e4ae"
};

const app = initializeApp(firebaseConfig);

export default app;