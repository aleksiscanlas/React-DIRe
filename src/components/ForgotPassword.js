import React, { useRef, useState } from "react"
import { Form, Button, Container, Col, Row, Alert, Image } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"
import logo from "./images/dire-logo.png"
import logo2 from "./images/park1.png"

export default function ForgotPassword() {
  const emailRef = useRef()
  const { resetPassword } = useAuth()
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setMessage("")
      setError("")
      setLoading(true)
      await resetPassword(emailRef.current.value)
      setMessage("Check your inbox for further instructions")
    } catch {
      setError("Failed to reset password")
    }

    setLoading(false)
  }

  return (
    <>
      <Container fluid="ls">
        <Row>
          <Col md={4} className="d-sm-none d-md-block d-none d-sm-block">
            <Image src={logo2} style={{width:"100%", height:"100%"}} fluid/>
          </Col>
          <Col>
            <div className="text-center">
              <Image src={logo} fluid/>
            </div>
            <div className="w-50 mx-auto">
              {error && <Alert variant="danger">{error}</Alert>}
              {message && <Alert variant="success">{message}</Alert>}
            </div>
            <Form className="w-50 mt-5 pt-5 mx-auto" onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>
              <Button disabled={loading} className="w-100" type="submit">
                Reset Password
              </Button>
            </Form>
            <div className="w-100 text-center mt-3">
              <Link to="/login">Login</Link>
            </div>
            <div className="text-center font-weight-bold mt-5 pt-5">
              <p>"A digital all-in-one QR code Identifcation system"<br/>
              DIRe support email: DigIDRecord@gmail.com
              </p>
            </div>
          </Col>
        </Row>
      </Container>

    </>
  )
}
