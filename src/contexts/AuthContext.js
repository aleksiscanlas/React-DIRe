import React, { useContext, useState, useEffect } from "react"
import { auth, db, storage, reAuth } from "../firebase"

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const usersDB = db.collection("users");
  const storageDB = storage.ref();

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function signupFirestore(suffix, first, middle, last, email, address, contact, gender, civil) {
    return usersDB.doc(auth.currentUser.uid).set({ Suffix: suffix, First: first, Middle: middle, Last: last, Email: email, Address: address, Contact: contact, Gender: gender, Civil: civil });
  }

  function sendEmail() {
    return auth.currentUser.sendEmailVerification();
  }

  function isVerified() {
    return currentUser.emailVerified;
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email)
  }

  function updateEmail(email) {
    usersDB.doc(auth.currentUser.uid).set({Email: email}, {merge:true})
    return currentUser.updateEmail(email)
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password)
  }

  function updateUser(info) {
    return usersDB.doc(auth.currentUser.uid).set(info, {merge: true})
  }

  async function addFile(file, expiration) {
    const date = new Date()
    const dlURL = await storageDB.child(auth.currentUser.uid).child(file).getDownloadURL()
    return usersDB.doc(auth.currentUser.uid).collection("files").doc(file).set({Email: auth.currentUser.email, FileName:file, FileUpload:date, FileExpiry:expiration, FileModified:date, URL:dlURL},{merge: true})
  }

  function storageRef(file, actual) {
    const path = auth.currentUser.uid + '/' + file
    return storageDB.child(path).put(actual)
  }

  function retrieveFiles() {
    return usersDB.doc(auth.currentUser.uid).collection("files").get()
  }

  function searchFiles(file) {
    return usersDB.doc(auth.currentUser.uid).collection("files").where("FileName", "==", file).get()
  }

  async function deleteFiles(files) {
    files.forEach(file =>{
      const storagePath = auth.currentUser.uid + '/' + file.name;
      storageDB.child(storagePath).delete();
      usersDB.doc(auth.currentUser.uid).collection("files").doc(file.name).delete();
    })
    return console.log("file deleted")
  }

  async function reAuthenticateUser(currentPassword) {
    let credentials = reAuth.credential(auth.currentUser.email, currentPassword);
    let result = false;
    await auth.currentUser.reauthenticateWithCredential(credentials)
      .then(() => result = true)
      .catch((error) => console.log("Error: ", error))
    return result
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const value = {
    currentUser,
    login,
    signup,
    signupFirestore,
    logout,
    sendEmail,
    isVerified,
    resetPassword,
    updateEmail,
    updatePassword,
    updateUser,
    storageRef,
    addFile,
    retrieveFiles,
    searchFiles,
    deleteFiles,
    reAuthenticateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
