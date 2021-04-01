import React from "react"
import { Link } from "react-router-dom"
import BasicUI from './BasicUI'

export default function GenerateQR() {
  return ( 
    <BasicUI>
      <div className="w-100 text-center mt-2">
        <Link to="/">Back</Link>
      </div>     
    </BasicUI>
  )
}
