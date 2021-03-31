import React, { useRef, useState } from "react"
import { Form, Button, Alert, Modal } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import BasicUI from './BasicUI'


const DataPrivacyModal = (props) => {
  const handleClose = () => {
    props.setShow(false);
  }

  return (
    <Modal
    show={props.show}
    onHide={handleClose}
    backdrop="static"
    animation={false}
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
  );
}

const Step1 = (props) => {
  if(props.step !== 1) return null;
  return (
    <>  
      <Form.Group id="text">
        <Form.Label>Suffix</Form.Label>
        <Form.Control type="text" ref={props.suffix}/>
      </Form.Group>
        <Form.Group id="text">
        <Form.Label>First name</Form.Label>
        <Form.Control type="text" ref={props.first} required/>
      </Form.Group>
        <Form.Group id="text">
        <Form.Label>Middle name</Form.Label>
        <Form.Control type="text" ref={props.middle} required/>
      </Form.Group>
        <Form.Group id="text">
        <Form.Label>Last name</Form.Label>
        <Form.Control type="text" ref={props.last} required/>
      </Form.Group>
    </>
  );
}

const Step2 = (props) => {
  if(props.step !== 2) return null;

  const handleChange = () => {

  }
  return (
    <>  
      <Form.Group id="email">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" ref={props.email} required />
      </Form.Group>
      <Form.Group id="password">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" ref={props.password} required />
      </Form.Group>
      <Form.Group id="password-confirm">
        <Form.Label>Password Confirmation</Form.Label>
        <Form.Control type="password" ref={props.confirm} required />
      </Form.Group>
      <Form.Check type="checkbox" label={props.dataLabel} required/>
    </>
  );
}


export default function Signup() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { signup, signupFirestore, sendEmail } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const [step, setStep] = useState(1);
  const [show, setShow] = useState(false);

  const dataLabel = <p>I Agree to <span className="text-info" onClick={() => setShow(!show)}>Data Privacy Consent</span></p>

  async function handleSubmit(e) {
    e.preventDefault()

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }

    try {
      setError("")
      setLoading(true)
      await signup(emailRef.current.value, passwordRef.current.value)
      signupFirestore(emailRef.current.value)
      sendEmail()
      history.push("/")
    } catch {
      setError("Failed to create an account")
    }

    setLoading(false)
  }

  return (
    <BasicUI>
      <DataPrivacyModal show={show} setShow={setShow}/>
      <div className="w-50 mx-auto">
          {error && <Alert variant="danger">{error}</Alert>}
      </div>
      <Form className="w-50 mx-auto" onSubmit={handleSubmit}>
        <Step1 step={step} suffix={suffix} first={first} middle={middle} last={last}/>
        <Step2 step={step} email={emailRef} password={passwordRef} confirm={passwordConfirmRef} dataLabel={dataLabel}/>
        {step === 1 ? <Button onClick={() => setStep(step + 1)}>Next</Button>:
              <Button onClick={() => setStep(step - 1)}>Back</Button>     
        }
        {step === 3 && <Button disabled={loading} className="mt-3 w-100" type="submit">Sign Up</Button>}
      </Form>   
        <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login">Log In</Link>
        </div>
    </BasicUI>
  )
}
