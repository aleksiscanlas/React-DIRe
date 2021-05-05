import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as QRCode from 'easyqrcodejs'
import BasicUI from './BasicUI'
import { useAuth } from "../contexts/AuthContext"
import { Form, Button, Modal } from "react-bootstrap"

function GenerateQRModal (props) {
  const { getQR } = useAuth()
  const [qrs, setQRS] = useState([])
  const handleClose = () => {
    props.setShow(false);
  }

  let arr= []

  const retrieveQR = async() => {
    await getQR().then(snapshot => {
      snapshot.docs.map(doc => {
        return arr.push({name: doc.data().qr, url: doc.data().qrImage, expiry: doc.data().expiration, files: doc.data().files})
      })
    }).then(() => {
      setQRS(arr)
    })
  }

  useEffect(() => {
    retrieveQR()
    //eslint-disable-next-line
  }, [])

  return (
    <Modal
    show={props.show}
    onHide={handleClose}
    animation={false}
    backdrop="static"
    keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Stored QR Code</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <table className="table overflow-scroll" >
          <thead>
            <tr>
              <th>QR</th>
              <th>Name</th>
              <th>QR Expiry</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
                qrs.map(ar => {
                    return (
                      <tr key={ar.name}>
                        <td><img src={ar.url} alt="qr"/></td>
                        <td>{ar.name}</td>
                        <td>{ar.expiry}</td>
                      </tr>
                    )
                })
            }  
          </tbody> 
      </table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function GenerateQR() {
  var qrcode = useRef()
  const [files, setFiles] = useState([])
  const [show, setShow] = useState(false);
  const { currentUser, storeQR, retrieveFiles } = useAuth()
  const [data, setData] = useState({qr: '', 
                                  qrImage: '', 
                                  files: [], 
                                  expiration: ''})
  const [check, setCheck] = useState([])
  const [hide, setHide] = useState(true)
  const [disable, setDisable] = useState(false)

  const handleCheck = (e) => {
    const f = e.target.name.split("~~")
    e.target.checked ? setCheck([...check, {name: f[0], url: f[1], value: e.target.checked}]):
                        setCheck(check.filter(item => item.name !== f[0]));
  }

  const getFiles = async() => {
    let arr = []
    await retrieveFiles().then(snapshot => {
      snapshot.docs.map(doc => {
        return arr.push({name: doc.data().FileName, url: doc.data().URL, expiry: doc.data().FileExpiry})
      })
    }).finally(() => {
      setFiles(arr)
    })
  }
  
  const storeIT = async() => {
    await storeQR(data).then(() => {
      qrcode.current.removeChild(qrcode.current.children[0])
      setHide(true)
      setDisable(false)
      setData({qr: '', qrImage: ''})
    })
    console.log(data)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    var options = {
      text: `https://maindb-8acfe.web.app/${currentUser.uid}/${data.qr}`,
      width: 100,
      height: 100,
    }
    new QRCode( qrcode.current, options);
    setData({...data, qrImage: qrcode.current.children[0].toDataURL(), files:check}) 
    setHide(false)
    setDisable(true)
  }

  const handleChange = (e) => {
    const {name, value} = e.target
    setData({...data,
      [name]: value
    })
  }

  const deleteQR = () => {
    qrcode.current.removeChild(qrcode.current.children[0])
    setHide(true)
    setDisable(false)
    setData({qr: '', qrImage: ''})
  }

  useEffect(() => {
    getFiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <BasicUI>
    <GenerateQRModal show={show} setShow={setShow}/>
    <div className="w-100 text-center mt-2">
    <Button onClick={()=>setShow(!show)}>QR Codes</Button>
      <div>

      </div>
      <Form className="w-50 mx-auto" onSubmit={handleSubmit}>
          <Form.Group id="qr">
            <Form.Label>Name</Form.Label>
            <Form.Control disabled={disable} type="text" name="qr" onChange={handleChange} value={data.qr} required/>
          </Form.Group>
          {hide ?
            <Button type="submit">Generate</Button>:
            <>
            <Button onClick={storeIT}>Save</Button>
            <Button onClick={deleteQR}>Cancel</Button>
            </>
          }
      </Form>
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
                        <td><input onClick={handleCheck} name={file.name + "~~" + file.url} type="checkbox"></input></td>
                      </tr>
                    )
                })
            }  
          </tbody> 
      </table>
      <ul ref={qrcode}></ul>
      <Link className="m-2 p-2" to="/">Back</Link>
    </div>     
    </BasicUI>
  )
}

