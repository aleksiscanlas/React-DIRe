import React, { useRef, useState } from "react"
import { Form, Button, Alert, Image, Row, Col, Modal } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import logo from "./images/dire-logo.png"
import logo2 from "./images/park1.png"

export default function Signup() {
  const emailRef = useRef()
  const suffix = useRef()
  const first = useRef()
  const middle = useRef()
  const last = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { signup, signupFirestore, sendEmail } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const dataLabel = <p>I Agree to <span className="text-info" onClick={handleShow}>Data Privacy Consent</span></p>

  async function handleSubmit(e) {
    e.preventDefault()

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }

    try {
      setError("")
      setLoading(true)
      await signup(emailRef.current.value, passwordRef.current.value)
      signupFirestore(emailRef.current.value, suffix.current.value, first.current.value, middle.current.value, last.current.value)
      sendEmail()
      history.push("/")
    } catch {
      setError("Failed to create an account")
    }

    setLoading(false)
  }


  return (
    <Row>
      <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Data Privacy Consent</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              I understand and concur that by clicking the “I Agree to the Privacy Notice 
              and Give my Consent”, I confirm that I freely and voluntarily give consent 
              to the collection and processing of my data, which may include personal 
              information and/or sensitive information set out in this registration and 
              application possessed by The Digital Identification Record web application.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleClose}>Understood</Button>
            </Modal.Footer>
      </Modal>
      <Col md={4} className="d-sm-none d-md-block d-none d-sm-block">
        <Image src={logo2} className="" fluid/>
      </Col>
      <Col>
        <div className="text-center">
          <Image src={logo} fluid/>
        </div>
        <div className="w-50 mx-auto">
          {error && <Alert variant="danger">{error}</Alert>}
        </div>
        <Form className="w-50 mx-auto" onSubmit={handleSubmit}>
          <Form.Group id="text">
            <Form.Label>Suffix</Form.Label>
            <Form.Control type="text" ref={suffix}/>
          </Form.Group>
          <Form.Group id="text">
            <Form.Label>First name</Form.Label>
            <Form.Control type="text" ref={first} required/>
          </Form.Group>
          <Form.Group id="text">
            <Form.Label>Middle name</Form.Label>
            <Form.Control type="text" ref={middle} required/>
          </Form.Group>
          <Form.Group id="text">
            <Form.Label>Last name</Form.Label>
            <Form.Control type="text" ref={last} required/>
          </Form.Group>
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
          <Form.Check type="checkbox" label={dataLabel} required/>
          <Button disabled={loading} className="mt-3 w-100" type="submit">
            Sign Up
          </Button>
        </Form>
        <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login">Log In</Link>
        </div>
        <div className="text-center mt-5 font-weight-bold">
          <p>"A digital all-in-one QR code Identifcation system"<br/>
          DIRe support email: DigIDRecord@gmail.com
          </p>
        </div>
      </Col>
    </Row>
  )
}
