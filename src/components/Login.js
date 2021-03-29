import React, { useRef, useState } from "react"
import { Form, Button, Row, Col, Alert, Image } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import logo from "./images/dire-logo.png"
import logo2 from "./images/park1.png"

export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  // const resendEmail = <span className="text-info" onClick={sendEmail}>Resend Email Verification</span>

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError("")
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
      // isVerified()
      history.push("/")
    } catch {
      setError("Failed to log in")
    }

    setLoading(false)
  }

  return (
    <Row>
      <Col md={4} className="d-sm-none d-md-block d-none d-sm-block">
        <Image src={logo2} className="h-100" fluid/>
      </Col>
      <Col>
        <div className="text-center">
          <Image src={logo} fluid/>
        </div>
        <div className="w-50 mx-auto">
          {error && <Alert variant="danger">{error}</Alert>}
        </div>
        <Form className="w-50 mx-auto" onSubmit={handleSubmit}>
          <Form.Group id="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" ref={emailRef} required />
          </Form.Group>
          <Form.Group id="password">
            <Form.Label>Passworrrrrrrrrrrrrrd</Form.Label>
            <Form.Control type="password" ref={passwordRef} required />
          </Form.Group>
          <Button disabled={loading} className="w-100" type="submit">
            Log In
          </Button>
        </Form>
        <div className="w-100 text-center mt-3">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
        <div className="w-100 text-center mt-2">
          Need an account? <Link to="/signup">Sign Up</Link>
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
