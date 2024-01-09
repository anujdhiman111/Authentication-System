import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvDvNgaXE_b3XvU5xOXFz1Ili46Qzo870",
  authDomain: "authentication-system-9cf2c.firebaseapp.com",
  projectId: "authentication-system-9cf2c",
  storageBucket: "authentication-system-9cf2c.appspot.com",
  messagingSenderId: "1055807234486",
  appId: "1:1055807234486:web:50dcc4b16bedd47fb1e117",
  measurementId: "G-CP86RZ1WJ2",
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const storage = getStorage(app);
const firestore = getFirestore(app);

export { storage, firestore };
