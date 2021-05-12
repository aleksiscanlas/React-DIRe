import React, { useState, useEffect } from "react"
import { Button, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import BasicUI from './BasicUI'
import closedFolder from './images/closedFolder.png'
import openedFolder from './images/openedFolder.png'
import qrCode from './images/qr-code.png'
import qrCodeScan from './images/qr-code-scan.png'
import man2 from './images/man.png'
import man from './images/man (1).png'
import woman2 from './images/woman.png'
import woman from './images/woman (1).png'

const DashboardIcons = (props) => {
  return (
    <img src={props.out} 
        onMouseOver={(e) => e.currentTarget.src = props.enter} 
        onMouseOut={(e) => e.currentTarget.src = props.out} 
        alt={props.alt}
        style={{maxWidth:[props.width], maxHeight:[props.height]}}
    />
  )
}

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
    const check = async() => {
      const res = await currentUser.emailVerified
      if(!res) setWarning(resendEmail)
    }
    check()
  }, [])

  return ( 
    <BasicUI styling="text-center"> 
      <div className="w-50 mx-auto">
        {warning && <Alert variant="warning">{warning}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
      </div>
        <p><strong>Email:</strong> {currentUser.email}</p>
        <div className="dashboard-container">
          <Link to="/update-profile" className="dashboard-icon btn mb-3" >
            <DashboardIcons enter={man2} out={man} alt="man-icon" width="120px" height="150px"/>
            <DashboardIcons enter={woman2} out={woman} alt="woman-icon" width="120px" height="110px"/>
            <p className="font-weight-bold"><br/>Update Profile</p>
          </Link>
          <Link to="/Documents" className="dashboard-icon btn mb-3">
            <DashboardIcons enter={openedFolder} out={closedFolder} alt="document-icon" width="150px" height="150px"/> 
            <p className="font-weight-bold">Upload and Manage Documents</p>
          </Link>
          <Link to="/generate-qr" className="dashboard-icon btn mb-3">
            <DashboardIcons enter={qrCodeScan} out={qrCode} alt="qr-code-icon" width="150px" height="150px"/>
            <p className="font-weight-bold">Generate QR Code</p>
          </Link>
        </div>
        <div className="w-100 text-center mt-2">
          <Button variant="outline-info" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>    
    </BasicUI>
  )
}
