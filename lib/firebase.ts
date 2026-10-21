import { getApp, getApps, initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, connectAuthEmulator, getAuth, onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./firebase-config";
import { createProfileSync } from "./cloud-sync";

let emulatorsConnected=false;
export function firebaseServices() {
  const app=getApps().length?getApp():initializeApp(firebaseConfig);
  const auth=getAuth(app);const db=getFirestore(app);
  if(process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS==="true"&&!emulatorsConnected&&typeof window!=="undefined"&&["localhost","127.0.0.1"].includes(window.location.hostname)){
    connectAuthEmulator(auth,"http://127.0.0.1:9099",{disableWarnings:true});connectFirestoreEmulator(db,"127.0.0.1",8088);emulatorsConnected=true;
  }
  const provider=new GoogleAuthProvider();provider.setCustomParameters({prompt:"select_account"});
  return {
    watch:(callback:(user:User|null)=>void,onError:()=>void)=>onAuthStateChanged(auth,callback,onError),
    login:()=>signInWithPopup(auth,provider),
    emailLogin:(email:string,password:string)=>signInWithEmailAndPassword(auth,email,password),
    register:(email:string,password:string)=>createUserWithEmailAndPassword(auth,email,password),
    resetPassword:(email:string)=>sendPasswordResetEmail(auth,email),logout:()=>signOut(auth),sync:createProfileSync(db),
  };
}
export type FirebaseServices=ReturnType<typeof firebaseServices>;
