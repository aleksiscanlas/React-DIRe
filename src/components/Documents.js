import React, { useState } from "react"
import { Row, Col, Image, Button, Modal, Form } from "react-bootstrap"
import { Link } from "react-router-dom"
import logo from "./images/dire-logo.png"
import logo2 from "./images/park1.png"

export default function Documents() {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = (e) => {
    e.preventDefault()
    handleClose()
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
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>
                Upload Document
              </Form.Label>
              <Form.Control type="file">
              </Form.Control>
            </Form.Group>
            <Button type="submit">Upload</Button>
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
