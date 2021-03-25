import React from "react"
import { Row, Col, Image} from "react-bootstrap"
import { Link } from "react-router-dom"
import logo from "./images/dire-logo.png"
import logo2 from "./images/park1.png"

export default function GenerateQR() {
  return ( 
    <Row>
      <Col md={4} className="d-sm-none d-md-block d-none d-sm-block">
        <Image src={logo2} className="h-100" fluid/>
      </Col>
      <Col className="text-center">
        <Image src={logo} fluid/>
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
