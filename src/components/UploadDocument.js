import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"

export default function UploadDocument() {
  const emailRef = useRef()
  const history = useHistory()

  return (
    <>
      <Card>
        <Card.Body>
            <Form>
                <Form.Group>
                    <Form.Label>Manage Documents</Form.Label>
                    <Form.Control id="file-manage" label="Manage File" />
                </Form.Group>
                <Form.Group>
                    <Form.File id="file-upload" label="Upload File" />
                </Form.Group>
            </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Link to="/">Back</Link>
      </div>
    </>
  )
}
