import { initializeApp, auth as authFire, apps, firestore } from 'firebase/app';
import 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { errFirebase } from "./message";

const config = {
  apiKey: "AIzaSyDsTMelTbuQOStKsv3ZMWhUer4E_WHbuHc",
  authDomain: "eltriunfo-ca926.firebaseapp.com",
  databaseURL: "https://eltriunfo-ca926.firebaseio.com",
  projectId: "eltriunfo-ca926",
  storageBucket: "eltriunfo-ca926.appspot.com",
  messagingSenderId: "873632175371"
};

const settings = { timestampsInSnapshots: true };


if (!apps.length) {
  initializeApp(config);
}

const auth = authFire();
const db = firestore()
db.settings(settings);

export {
  auth,
  errFirebase,
  db,
};