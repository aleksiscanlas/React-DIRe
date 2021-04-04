import React from 'react'
import { Image, Row, Col } from "react-bootstrap"
import logo from "./images/dire-logo.png"
import logo2 from "./images/park1.png"

export default function BasicUI(props) {
    return (
        <Row>
            <Col md={4} className="d-sm-none d-md-block d-none d-sm-block">
                <Image src={logo2} className="h-100" fluid/>
            </Col>
            <Col className={props.styling}>
            <div className="text-center">
                <Image src={logo} fluid/>
            </div>
            {props.children}
            <div className="text-center mx-auto mt-5 pt-5 font-weight-bold">
                <p>"A digital all-in-one QR code Identifcation system"<br/>
                DIRe support email: DigIDRecord@gmail.com
                </p>
            </div>
            </Col>           
        </Row>            
    )
}