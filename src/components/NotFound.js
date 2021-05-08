import React from 'react'
import BasicUI from './BasicUI'
import { Link } from "react-router-dom"

export default function NotFound() {
    return (
        <BasicUI styling="text-center"> 
        <div className = "font-weight-bold text-center text-danger">
        <h1>OOPS!</h1>
        <h3>404 - Page not found</h3>
        <h5>We can't seem to find the page you're looking for.</h5>
        <Link to="/" class="font-weight-normal"><br/>🡠 Back</Link>
        </div>
        </BasicUI>
    )
}
