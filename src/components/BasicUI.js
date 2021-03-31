import React from 'react'
import { Image, Row, Col, Container } from "react-bootstrap"
import logo from "./images/dire-logo.png"
import logo2 from "./images/park1.png"

export default function BasicUI(props) {
    return (
        <Row>
            <Col md={4} className="d-sm-none d-md-block d-none d-sm-block">
                <Image src={logo2} fluid/>
            </Col>
            <Col>
            <div className="text-center">
                <Image src={logo} fluid/>
            </div>
            {props.children}
            <div className="text-center mt-5 font-weight-bold">
                <p>"A digital all-in-one QR code Identifcation system"<br/>
                DIRe support email: DigIDRecord@gmail.com
                </p>
            </div>
            </Col>           
        </Row>
    )
}