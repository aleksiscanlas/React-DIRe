import React, { useState } from "react"
import { Button, Image, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import logo from "./images/dire-logo.png"
import logo2 from "./images/park1.png"

export default function Dashboard() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const history = useHistory()

  async function handleLogout() {
    setError("")

    try {
      await logout()
      history.push("/login")
    } catch {
      setError("Failed to log out")
    }
  }

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <Image src={logo2}/>
          <div className="col bg-secondary">
              <Image className="img-responsive w-100 h-50" src={logo} />
              {error && <Alert variant="danger">{error}</Alert>}
              <p><strong>Email:</strong> {currentUser.email}</p>
              <Link to="/update-profile" className="btn btn-primary w-100 mb-3">
                My Profile
              </Link>
              <Link to="/upload-document" className="btn btn-primary w-100 mb-3">
                Upload and Manage Documents
              </Link>
              <Link to="/update-profile" className="btn btn-primary w-100 mb-3">
                Generate QR Code
              </Link>
              <div className="w-100 text-center mt-2">
                <Button variant="link" onClick={handleLogout}>
                  Sign Out
                </Button>
              </div>   
              <div className="text-center">
                <p>"A digital all-in-one QR code Identifcation system"</p>
                <p>DIRe support email: DigIDRecord@gmail.com</p> 
              </div>
          </div>
        </div>
      </div>
    </>
  )
}
