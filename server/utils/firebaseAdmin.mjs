import admin from "firebase-admin"
 import serviceAccount from "./private.json" with {type: "json"}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://realtime-database-85a38-default-rtdb.europe-west1.firebasedatabase.app"
});

export default admin
