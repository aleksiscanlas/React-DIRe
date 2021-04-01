import React, { useState } from "react"
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
    animation={false}
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
  );
}

export default function Signup() {
  const [data, setData] = useState({suffix: '', first: '', middle: '', last: '',
                                 address: '', contact: '', gender: 'Male', civil: 'Single',
                                email: '', password: '', confirm: ''})
  const { signup, signupFirestore, sendEmail } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const [step, setStep] = useState(1);
  const [show, setShow] = useState(false);


  const dataLabel = <p>I Agree to <span className="text-info" onClick={()=>setShow(!show)}>Data Privacy Consent</span></p>

  const handleSubmit = async(e) => {
    e.preventDefault()
    if(step !== 4 && data.first && data.middle && data.last){
      _next()
    }else if(step !== 4 && data.address && data.contact){
      _next()
    }else if(step !== 4 && data.civil && data.gender){
      _next()
    }else{
      if (data.password !== data.confirm) {
        return setError("Passwords do not match")
      }
  
      try {
        setError("")
        setLoading(true)
        await signup(data.email, data.password)
        signupFirestore(data.suffix, data.first, data.middle, data.last, data.email, data.address,
                      data.contact, data.gender, data.civil)
        sendEmail()
        history.push("/login")
      } catch {
        setError("Failed to create an account")
      }
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const {name, value} = e.target
    setData({...data,
      [name]: value
    })
  }

  const _next = () => {
    setStep(step + 1)
  }

  const _back = () => {
    setStep(step - 1)
  }

  return (
    <BasicUI>
      <DataPrivacyModal show={show} setShow={setShow}/>
      <div className="w-50 mx-auto">
        {error && <Alert variant="danger">{error}</Alert>}
      </div>
      <Form className="w-50 mx-auto" onSubmit={handleSubmit}>
        {step === 1 && 
          <>
            <Form.Group id="suffix">
              <Form.Label>Suffix</Form.Label>
              <Form.Control type="text" name="suffix" onChange={handleChange} value={data.suffix}/>
            </Form.Group>
            <Form.Group id="first">
              <Form.Label>First name</Form.Label>
              <Form.Control type="text" name="first" onChange={handleChange} value={data.first} required/>
            </Form.Group>
            <Form.Group id="text">
              <Form.Label>Middle name</Form.Label>
              <Form.Control type="text" name="middle" onChange={handleChange} value={data.middle} required/>
            </Form.Group>
            <Form.Group id="text">
              <Form.Label>Last name</Form.Label>
              <Form.Control type="text" name="last" onChange={handleChange} value={data.last} required/>
            </Form.Group>
            <Button className="w-100" type="submit">Next</Button>
          </>
        }
        {step === 2 &&
        <>
          <Form.Group id="address" className="mt-3">
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" name="address" onChange={handleChange} value={data.address} required/>
          </Form.Group>
          <Form.Group id="contact">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control type="text" name="contact" onChange={handleChange} value={data.contact} required/>
          </Form.Group>
          <Button className="w-25" onClick={_back}>Back</Button>
          <Button className="w-25" type="submit">Next</Button>
        </>
        }
        {step === 3 &&
          <>
            <Form.Group id="civil">
              <Form.Label>Civil Status</Form.Label>
              <Form.Control name="civil" as="select" onChange={handleChange} value={data.civil} >
                <option value="Single">Single</option>
                <option value="Cohabiting">Cohabiting</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option> 
                <option value="Separated">Separated</option>
                <option value="Married">Married</option>
              </Form.Control>
            </Form.Group>
            <Form.Group id="gender">
              <Form.Label>Gender</Form.Label>
              <Form.Control name="gender" as="select" onChange={handleChange} value={data.gender} required>
                <option>Male</option>
                <option>Female</option>
                <option>Non-Binary</option>
              </Form.Control>
            </Form.Group>
            <Button className="w-25" onClick={_back}>Back</Button>
            <Button className="w-25" type="submit">Next</Button>
          </>
        }
        {step === 4 &&
          <>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" onChange={handleChange} value={data.email} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" onChange={handleChange} value={data.password}required />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" name="confirm" onChange={handleChange} value={data.confirm}required />
            </Form.Group>
            <Form.Check type="checkbox" label={dataLabel} required/>
            <Button className="w-25" onClick={_back}>Back</Button>
            <Button disabled={loading} className="float-right w-50" type="submit">Sign Up</Button>
          </>
        }
      </Form>
      <div className="w-100 text-center mt-2">
      Already have an account? <Link to="/login">Log In</Link>
      </div>
    </BasicUI>
  )
}
