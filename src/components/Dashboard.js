import React, { useState } from "react"
import { Container, Row, Col, Button, Image, Alert } from "react-bootstrap"
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
    <Container fluid className="text-center">
        <Row> 
        <Image src={logo2} className="d-sm-none d-md-block d-none d-sm-block"/>
          <Col>
              <Image src={logo} fluid/>
              {error && <Alert variant="danger">{error}</Alert>}
              <p><strong>Email:</strong> {currentUser.email}</p>
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
              <div className="text-center mt-5 p-0 font-weight-bold">
                <p>"A digital all-in-one QR code Identifcation system"</p>
                <p>DIRe support email: DigIDRecord@gmail.com</p> 
              </div>
          </Col>
        </Row>
    </Container>
  )
}
