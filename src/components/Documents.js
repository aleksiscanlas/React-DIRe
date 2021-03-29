import React, { useState, useRef, useEffect } from "react"
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
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState([])
  const { storageRef, addFile, retrieveFiles } = useAuth()
  const handleShow = () => setShow(true)

  const handleClose = () => {
    setShow(false)
    setExpires(true)
    setError("")
  }


  async function handleSubmit(e) {
    e.preventDefault()
    try{
      setError("")
      setLoading(true)
      await storageRef().put(fileRef.current.files[0])
      const ref = await storageRef().getDownloadURL()
      addFile(fileRef.current.value.split("\\").pop(), ref, dateRef.current.value)
      setLoading(false)
      handleClose()
    } catch {
      setError("Document Upload Failed")
    }
  }

  useEffect(() => {
    const getFiles = async() => {
      const snapshot = await retrieveFiles()
      const arrayFiles = []
      snapshot.docs.map(async doc => {
        arrayFiles.push({name: doc.data().FileName, url: doc.data().URL, expiry: doc.data().FileExpiry})
      })
      setFiles(arrayFiles)
      console.log(files)
    }
    getFiles()
    //fix this dependency because the document re renders whenever handleclose is called
    //consider adding a refresh button to re render this page or nah??
  }, [handleClose])
  
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
              <Button type="submit" disabled={loading} className="mr-3">Upload</Button>
              <Button variant="secondary" disabled={loading} onClick={handleClose}>Cancel</Button>
          </Form>
        </Modal.Body>
      </Modal>}
      <Col md={4} className="d-sm-none d-md-block d-none d-sm-block">
        <Image src={logo2} className="h-100" fluid/>
      </Col>
      <Col className="text-center">
        <Image src={logo} fluid/>
        <Button className="w-50" onClick={handleShow}>Upload Document</Button>
        <div className="mx-auto mt-2" style={{overflow:"scroll", maxWidth:"750px", maxHeight:"250px"}}>
          <table className="table">
            <thead>
              <th>Document</th>
              <th>File Expiry</th>
            </thead>
            <tbody>
              {
                  files.map(file => {
                      return (
                        <tr>
                          <td><a href={file.url}>{file.name}</a></td>
                          <td>{file.expiry}</td>
                        </tr>
                      )
                  })
              }  
            </tbody> 
          </table>
        </div>

        <div className="w-100 text-center mt-2">
        <Link to="/">Back</Link>
        </div>
        <div className="text-center mt-3 pt-3 font-weight-bold">
          <p>"A digital all-in-one QR code Identifcation system"<br/>
          DIRe support email: DigIDRecord@gmail.com
          </p>
        </div>
      </Col>
    </Row>
  )
}
