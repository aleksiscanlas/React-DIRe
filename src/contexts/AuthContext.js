import React, { useContext, useState, useEffect } from "react"
import { auth, db, storage } from "../firebase"

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)
  const usersDB = db.collection("users")

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password)
  }

  function signupFirestore(suffix, first, middle, last, email, address, contact, gender, civil) {
    return usersDB.doc(auth.currentUser.uid).set({ Suffix: suffix, First: first, Middle: middle, Last: last, Email: email, Address: address, Contact: contact, Gender: gender, Civil: civil })
  }

  function sendEmail() {
    return auth.currentUser.sendEmailVerification()
  }

  function isVerified() {
    return currentUser.emailVerified
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  function logout() {
    return auth.signOut()
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email)
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email)
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password)
  }

  function updateSuffix(suffix) {
    return usersDB.doc(auth.currentUser.uid).set({Suffix:suffix}, {merge: true})
  }

  function updateFirst(first) {
    return usersDB.doc(auth.currentUser.uid).set({First:first}, {merge: true})
  }

  function updateMiddle(middle) {
    return usersDB.doc(auth.currentUser.uid).set({Middle:middle}, {merge: true})
  }

  function updateLast(last) {
    return usersDB.doc(auth.currentUser.uid).set({Last:last}, {merge: true})
  }

  async function addFile(file, expiration) {
    const date = new Date()
    const dlURL = await storage.ref().child(auth.currentUser.uid).child(file).getDownloadURL()
    return usersDB.doc(auth.currentUser.uid).collection("files").doc(file).set({FileName:file, FileUpload:date, FileExpiry:expiration, FileModified:date, URL:dlURL},{merge: true})
  }

  function storageRef(file, actual) {
    const path = auth.currentUser.uid + '/' + file
    return storage.ref().child(path).put(actual)
  }

  function retrieveFiles() {
    return usersDB.doc(auth.currentUser.uid).collection("files").get()
  }

  function searchFiles(file) {
    return usersDB.doc(auth.currentUser.uid).collection("files").where("FileName", "==", file).get()
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
    updateSuffix,
    updateFirst,
    updateMiddle,
    updateLast,
    storageRef,
    addFile,
    retrieveFiles,
    searchFiles
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
