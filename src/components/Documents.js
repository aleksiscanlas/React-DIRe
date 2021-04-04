import React, { useState, useRef, useEffect } from "react"
import { Row, Button, Modal, Form, Alert } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import BasicUI from './BasicUI'


function SearchBar(props) {
  return (
    <div className="mx-auto input-group mb-2" style={{maxWidth:"400px"}}>
      <input type="text" className="form-control" placeholder="Search..." aria-label="Search..." aria-describedby="basic-addon2" onChange={props.onChange} value={props.value}/>
      <div className="input-group-prepend">
        <button className="btn btn-outline-secondary rounded fa fa-search" onClick={props.onClick}></button>
      </div>
    </div>
  );
}

export default function Documents() {
  const fileRef = useRef()
  const dateRef = useRef()
  const [search, setSearch] = useState()
  const [show, setShow] = useState(false)
  const [error, setError] = useState()
  const [check, setCheck] = useState([])
  const [expires, setExpires] = useState(true)
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState([])
  const { storageRef, addFile, retrieveFiles, searchFiles, deleteFiles } = useAuth()
  const handleShow = () => setShow(true)

  const handleClose = () => {
    setShow(false)
    setExpires(true)
    setError("")
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const fileName = fileRef.current.files[0].name;
    try{
      setError("")
      setLoading(true)
      await storageRef(fileName, fileRef.current.files[0])
      addFile(fileName, dateRef.current.value)
      setLoading(false)
      getFiles()
      handleClose()
    } catch {
      setError("Document Upload Failed")
    }
  }

  const getFiles = async() => {
    const snapshot = search ? await searchFiles(search): await retrieveFiles()
    let arr = []
    snapshot.docs.map(doc => {
      return arr.push({name: doc.data().FileName, url: doc.data().URL, expiry: doc.data().FileExpiry})
    })
    setFiles(arr)
    setSearch('')
  }

  const handleCheck = (e) => {
    e.target.checked ? setCheck([...check, {name: e.target.name, value: e.target.checked}]):
                        setCheck(check.filter(item => item.name !== e.target.name));
  }

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteFiles(check);
      await getFiles();
      setLoading(false);
      setCheck([]);
    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getFiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })
  
  return (
    <BasicUI>
    <Modal
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
      </Modal>
      <SearchBar onClick={getFiles} onChange={(e) => setSearch(e.target.value)} value={search}/>
      <div className="mx-auto mt-2 pt-2" style={{overflow:"scroll", maxWidth:"800px", maxHeight:"250px"}}>
        <table className="table overflow-scroll" >
          <thead>
            <tr>
              <th>Document</th>
              <th>File Expiry</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
                files.map(file => {
                    return (
                      <tr key={file.name}>
                        <td><a href={file.url}>{file.name}</a></td>
                        <td>{file.expiry}</td>
                        <td><input onClick={handleCheck} name={file.name} type="checkbox"></input></td>
                      </tr>
                    )
                })
            }  
          </tbody> 
        </table>
      </div>
      <div className="w-100 text-center mt-2">
      <Button className="fa fa-upload w-25 p-1 m-1" disabled={loading} onClick={handleShow}> Upload Document</Button>
      {check.length > 0 && <Button className="fa fa-trash w-25 p-1 m-1" disabled={loading} onClick={handleDelete}> Delete Documents</Button>}
      <Link to="/"><br/>Back</Link>
      </div>
    </BasicUI>
  )
}
