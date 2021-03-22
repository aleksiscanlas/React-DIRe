import React, { useState } from "react"
import { Row, Col, Button, Image, Alert } from "react-bootstrap"
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
    <Row>
      <Col md={4} className="d-sm-none d-md-block d-none d-sm-block">
        <Image src={logo2} className="h-100" fluid/>
      </Col>
      <Col className="text-center">
        <Image src={logo} fluid/>
        <div className="w-50">
          {error && <Alert variant="danger">{error}</Alert>}
        </div>
          <p><strong>Email:</strong> {currentUser.uid}</p>
          <Link to="/update-profile" className="btn btn-primary w-75 mb-3">
            My Profile
          </Link>
          <Link to="/upload-document" className="btn btn-primary w-75 mb-3">
            Upload and Manage Documents
          </Link>
          <Link to="/update-profile" className="btn btn-primary w-75 mb-3">
            Generate QR Code
          </Link>
          <div className="w-100 text-center mt-2">
            <Button variant="link" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>   
          <div className="text-center mt-5 pt-5 font-weight-bold">
            <p>"A digital all-in-one QR code Identifcation system"<br/>
            DIRe support email: DigIDRecord@gmail.com
            </p>
          </div>
      </Col>
    </Row>
  )
}
