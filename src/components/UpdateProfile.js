import React, { useRef, useState } from "react"
import { Form, Button, Row, Col, Alert, Image } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import logo from "./images/dire-logo.png"
import logo2 from "./images/park1.png"

export default function UpdateProfile() {
  const suffixRef = useRef()
  const firstRef = useRef()
  const middleRef = useRef()
  const lastRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { currentUser, updatePassword, updateEmail, 
    updateSuffix, updateFirst, updateMiddle, updateLast } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  function handleSubmit(e) {
    e.preventDefault()
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }

    const promises = []
    setLoading(true)
    setError("")

    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value))
    }
    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value))
    }
    if (suffixRef.current.value) {
      promises.push(updateSuffix(suffixRef.current.value))
    }
    if (firstRef.current.value) {
      promises.push(updateFirst(firstRef.current.value))
    }
    if (middleRef.current.value) {
      promises.push(updateMiddle(middleRef.current.value))
    }
    if (lastRef.current.value) {
      promises.push(updateLast(lastRef.current.value))
    }

    Promise.all(promises)
      .then(() => {
        history.push("/")
      })
      .catch(() => {
        setError("Failed to update account")
      })
      .finally(() => {
        setLoading(false)
      })
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
          <Form onSubmit={handleSubmit}>
          <Form.Group id="suffix">
              <Form.Label>Suffix</Form.Label>
              <Form.Control
                type="text"
                ref={suffixRef}
              />
            </Form.Group>
            <Form.Group id="first">
              <Form.Label>First</Form.Label>
              <Form.Control
                type="text"
                ref={firstRef}
              />
            </Form.Group>
            <Form.Group id="middle">
              <Form.Label>Middle</Form.Label>
              <Form.Control
                type="text"
                ref={middleRef}
              />
            </Form.Group>
            <Form.Group id="last">
              <Form.Label>Last</Form.Label>
              <Form.Control
                type="text"
                ref={lastRef}
              />
            </Form.Group>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                ref={emailRef}
                defaultValue={currentUser.email}
              />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                ref={passwordRef}
              />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control
                type="password"
                ref={passwordConfirmRef}
              />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Update
            </Button>
          </Form>
        </div>
        <div className="w-100 text-center mt-2">
          <Link to="/">Cancel</Link>
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
