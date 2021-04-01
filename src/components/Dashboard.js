import React, { useState, useEffect } from "react"
import { Button, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import BasicUI from './BasicUI'

export default function Dashboard() {
  const [error, setError] = useState("")
  const [warning, setWarning] = useState("")
  const { currentUser, logout, sendEmail } = useAuth()
  const history = useHistory()
  const resendEmail = <p>Email not Verified.<span className="text-info" onClick={sendEmail}> Resend Email Verification</span></p>

  async function handleLogout() {
    setError("")

    try {
      await logout()
      history.push("/login")
    } catch {
      setError("Failed to log out")
    }
  }

  useEffect(()=>{
    let isMounted = true;
    if(isMounted){
      const check = async() => {
        const res = await currentUser.emailVerified
        if(!res) setWarning(resendEmail)
      }
      check()
    } 
    return ()=> isMounted=false;
  })

  return ( 
    <BasicUI styling="text-center"> 
      <div className="w-50 mx-auto">
        {warning && <Alert variant="warning">{warning}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
      </div>
        <p><strong>Email:</strong> {currentUser.uid}</p>
        <Link to="/update-profile" className="btn btn-primary w-75 mb-3">
          My Profile
        </Link>
        <Link to="/Documents" className="btn btn-primary w-75 mb-3">
          Upload and Manage Documents
        </Link>
        <Link to="/generate-qr" className="btn btn-primary w-75 mb-3">
          Generate QR Code
        </Link>
        <div className="w-100 text-center mt-2">
          <Button variant="link" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>    
    </BasicUI>
  )
}
