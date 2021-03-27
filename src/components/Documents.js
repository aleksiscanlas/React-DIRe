import React, { useState, useRef } from "react"
import { Row, Col, Image, Button, Modal, Form, Alert } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import logo from "./images/dire-logo.png"
import logo2 from "./images/park1.png"

export default function Documents() {
  const fileRef = useRef()
  const dateRef = useRef()
  const [show, setShow] = useState(false)
  const [error, setError] = useState()
  const [expires, setExpires] = useState(true)
  const { uploadDocument, addFile } = useAuth()
  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false)
    setExpires(true)
    setError("")
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try{
      setError("")
      await uploadDocument(fileRef.current.files[0])
      addFile(fileRef.current.value.split("\\").pop(), dateRef.current.value)
      handleClose()
    } catch {
      setError("Document Upload Failed")
    }

  }

  return (
    <Row>
        {<Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
        <Modal.Header closeButton>
          <Modal.Title>File Upload</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="w-50 mx-auto">
            {error && <Alert variant="danger">{error}</Alert>}
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>
                Upload Document
              </Form.Label>
              <Form.Control 
                  type="file" 
                  ref={fileRef}
                  >
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Document Expires?
              </Form.Label>
              <Row>
                <Form.Check
                  type="radio"
                  label="Yes"
                  name="documentExpiration"
                  id="radioYes"
                  className="m-3 mt-0"
                  onClick={() => setExpires(false)}
                  required
                />
                <Form.Check
                  type="radio"
                  label="No"
                  name="documentExpiration"
                  id="radioNo"
                  className="m-3 mt-0"
                  onClick={() => setExpires(true)}
                />
              </Row>
              </Form.Group>
              <Form.Control type="date" name='date_of_birth' disabled={expires} ref={dateRef} className="w-75 mb-3"/>
              <Button type="submit" className="mr-3">Upload</Button>
              <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          </Form>
        </Modal.Body>
      </Modal>}
      <Col md={4} className="d-sm-none d-md-block d-none d-sm-block">
        <Image src={logo2} className="h-100" fluid/>
      </Col>
      <Col className="text-center">
        <Image src={logo} fluid/>
        <Button className="w-50" onClick={handleShow}>Upload Document</Button>
        <div className="w-100 text-center mt-2">
        <Link to="/">Back</Link>
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
