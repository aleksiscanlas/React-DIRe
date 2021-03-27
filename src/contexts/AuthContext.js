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

  function signupFirestore(suffix, first, middle, last) {
    return usersDB.doc(auth.currentUser.uid).set({Suffix:suffix, First:first, Middle:middle, Last:last})
  }

  function sendEmail() {
    return auth.currentUser.sendEmailVerification()
  }

  function isVerified() {
    return auth.currentUser.emailVerified()
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

  function addFile(file, expiration) {
    const date = new Date()
    return usersDB.doc(auth.currentUser.uid).set({files:{[file]:{FileUpload:date, FileExpiry:expiration}}},{merge: true})
  }

  function uploadDocument(document) {
    return storage.child(auth.currentUser.uid).child(document.name).put(document)
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
    uploadDocument,
    addFile,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
