import React, { useRef, useState } from "react"
import { Form, Button, Alert} from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"
import BasicUI from './BasicUI'

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
    <BasicUI>
      <div className="w-50 mt-5 pt-5 mx-auto">
        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}
      </div>
      <Form className="w-50 mx-auto" onSubmit={handleSubmit}>
        <Form.Group id="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" ref={emailRef} required />
        </Form.Group>
        <Button disabled={loading} className="w-100" type="submit">
          Reset Password
        </Button>
      </Form>
      <div className="w-100 text-center mt-2">
        <Link to="/login">Login</Link>
      </div>
    </BasicUI>
  )
}
