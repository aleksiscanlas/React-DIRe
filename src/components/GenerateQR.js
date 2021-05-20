import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as QRCode from 'easyqrcodejs'
import BasicUI from './BasicUI'
import { useAuth } from "../contexts/AuthContext"
import { Form, Button, Modal} from "react-bootstrap"
import wmark from "./images/dire-icon.png"

function GenerateQRModal (props) {
  const { getQR, deleteQR } = useAuth();
  const [check, setCheck] = useState([]);
  const [qrs, setQRS] = useState([]);
  const [loading, setLoading] = useState(false);
  let arr= [];
  const date = new Date();

  const handleClose = () => {
    props.setShow(false);
  }

  const currDate = date.getFullYear() + '-'
           + ('0' + (date.getMonth()+1)).slice(-2) + '-'
           +  ('0' + date.getDate()).slice(-2);


  const handleCheck = (e) => {
    e.target.checked ? setCheck([...check, {name: e.target.name, value: e.target.checked}]):
                        setCheck(check.filter(item => item.name !== e.target.name));
  }

  const retrieveQR = async() => {
    await getQR().then(snapshot => {
      snapshot.docs.map(doc => {
        return arr.push({name: doc.data().qr, url: doc.data().qrImage, expiry: doc.data().expires, files: doc.data().files})
      })
    }).then(() => {
      setQRS(arr)
    })
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      await deleteQR(check).then(() => {
        retrieveQR()
        setCheck([]);
      }).then(() => {
        setLoading(false);
      })
    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => {
    retrieveQR()
    //eslint-disable-next-line
  }, [props.show])

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
      <table className="w-100 table overflow-scroll" >
          <thead>
            <tr>
              <th>QR</th>
              <th>Name</th>
              <th>Expiration</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
                qrs.map(ar => {
                    return (
                      <tr key={ar.name}>
                        <td><a download={ar.name} href={ar.url} target="_blank" rel="noopener noreferrer"><img src={ar.url} className="w-75" alt="qr"/></a></td>
                        <td>{ar.name}</td>
                        <td>{Date.parse(ar.expiry) > Date.parse(currDate) || ar.expiry ? ar.expiry : 'Expired'}</td>
                        <td><input onClick={handleCheck} name={ar.name} type="checkbox"></input></td>
                      </tr>
                    )
                })
            }  
          </tbody> 
      </table>
      </Modal.Body>
      <Modal.Footer>
        {check.length > 0 && <Button  variant="info" className="fa fa-trash w-25 p-1 ml-1" disabled={loading} onClick={handleDelete}>  Delete</Button>}
        <Button variant="outline-info" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function QRLogModal (props) {
  const { getLog } = useAuth()
  const [logs, setLogs] = useState([])
  let arr = [];
  const handleClose = () => {
    props.setShow(false);
  }

  const retrieveLog = async() => {
    await getLog().then(snapshot => {
      snapshot.docs.map(doc => {
        var tempDate = doc.data().DateAccessed.toDate().toString().slice(0,24);
        return arr.push({AccessedBy: doc.data().AccessedBy, Date: tempDate, QR: doc.data().qrCode})
      })
    }).then(() => {
      setLogs(arr)
    })
  }

  useEffect(() => {
    retrieveLog()
    //eslint-disable-next-line
  }, [props.show])

  return (
    <Modal
    show={props.show}
    onHide={handleClose}
    animation={false}
    backdrop="static"
    keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Logs for Accessed QR Codes</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <table className="w-100 table overflow-scroll" >
          <thead>
            <tr>
              <th>QR</th>
              <th>Accessed By</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
                logs.map(log => {
                    return (
                      <tr  key={log.Date}>
                        <td>{log.QR}</td>
                        <td>{log.AccessedBy}</td>
                        <td>{log.Date}</td>
                      </tr>
                    )
                })
            }  
          </tbody> 
      </table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-info" onClick={handleClose}>Close</Button>
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
                                  expires: ''})
  const [check, setCheck] = useState([])
  const [hide, setHide] = useState(true)
  const [disable, setDisable] = useState(false)
  const [showLog, setShowLog] = useState(false)

  const handleCheck = (e) => {
    const f = e.target.name.split("~~")
    e.target.checked ? setCheck([...check, {name: f[0], url: f[1], expired: f[2], value: e.target.checked}]):
                        setCheck(check.filter(item => item.name !== f[0]));
  }

  const getFiles = async() => {
    let arr = []
    await retrieveFiles().then(snapshot => {
      snapshot.docs.map(doc => {
        return arr.push({name: doc.data().FileName, url: doc.data().URL, expiry: doc.data().FileExpiry, disabled: doc.data().Disabled})
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
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    var options = {
      text: `http://localhost:3000/${currentUser.uid}/${data.qr}`,
      width: 200,
      height: 200,
      colorDark : "#31c6e8",
      colorLight : "#ffffff",
      quietZone: 10,
      quietZoneColor: "rgba(49,232,159,0.6)",
      logo:wmark,
      logoWidth:50,
      logoHeight:50,
      logoBackgroundTransparent:false,
      logoBackgroundColor: '#ffffff',
      correctLevel : QRCode.CorrectLevel.H,
    }
    new QRCode( qrcode.current, options);
    var ch = check.length
    var expires;
    switch(ch){
      case 0: expires="None"; break;
      case 1: expires=check[0].expired;
              break;
      case 2: if(check[0].expired < check[1].expired){
                expires=check[0].expired
              }else{
                expires=check[1].expired
              }
              break;
      default: expires = check[0].expired
              check.forEach(che => {
                if(che.expired !== ''){
                  expires = che.expired < expires ? che.expired : expires
                }
              })
    }
    setData({...data, qrImage: qrcode.current.children[0].toDataURL(), expires: expires, files:check}) 
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
    <QRLogModal show={showLog} setShow={setShowLog}/>
    <div className="w-100 text-center mt-2">
    <Button variant="info" onClick={()=>setShow(!show)} className="fa fa-eye mr-4"> QR codes</Button>
    <Button variant="info" onClick={()=>setShowLog(!showLog)} className="fa fa-history"> Logs</Button><br/><br/>
      <div>

      </div>
      <Form className="w-50 mx-auto" onSubmit={handleSubmit}>
          <Form.Group id="qr">
          <Form.Label>QR Code name</Form.Label>
          <Form.Control disabled={disable} type="text" name="qr" onChange={handleChange} value={data.qr} required/>
          </Form.Group>
          {hide ?
            <Button variant="info" type="submit">Generate new QR code</Button>:
            <>
            <Button variant="info" className="m-2" onClick={storeIT}>Save</Button>
            <Button variant="info" onClick={deleteQR}>Cancel</Button>
            </>
          }
          <br/><br/>
      </Form>
      <div ref={qrcode}></div>
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
                        <td><input onClick={handleCheck} disabled={file.disabled} name={file.name + "~~" + file.url + '~~' + file.expiry} type="checkbox"></input></td>
                      </tr>
                    )
                })
            }  
          </tbody> 
      </table>
      <Link className="m-2 p-2" to="/">🡠 Back</Link>
    </div>     
    </BasicUI>
  )
}

