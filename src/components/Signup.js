import React, { useRef, useState } from "react"
import { Form, Button, Container, Alert, Image, Row, Col } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import logo from "./images/dire-logo.png"
import logo2 from "./images/park1.png"

export default function Signup() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { signup } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }

    try {
      setError("")
      setLoading(true)
      await signup(emailRef.current.value, passwordRef.current.value)
      history.push("/")
    } catch {
      setError("Failed to create an account")
    }

    setLoading(false)
  }

  return (
    <>
      <Container fluid="ls">
        <Row>
          <Col md={4} className="d-sm-none d-md-block d-none d-sm-block">
            <Image src={logo2} className="w-100 h-100" fluid/>
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
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>
              <Form.Group id="password-confirm">
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control type="password" ref={passwordConfirmRef} required />
              </Form.Group>
              <Button disabled={loading} className="w-100" type="submit">
                Sign Up
              </Button>
            </Form>
            <div className="w-100 text-center mt-2">
            Already have an account? <Link to="/login">Log In</Link>
            </div>
            <div className="text-center mt-5 pt-5 font-weight-bold">
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
