import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "Your_api_Key",
  authDomain: "Your_auth_Domain",
  databaseURL: "Your_database_URL",
  projectId: "Your_project_Id",
  storageBucket: "Your_storage_Bucket",
  messagingSenderId: "Your_messaging_Sender_Id",
  appId: "Your_app_Id"
};

const app = initializeApp(firebaseConfig);

export default app;
