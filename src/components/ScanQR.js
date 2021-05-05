import React, { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useParams } from 'react-router-dom'

export default function ScanQR() {
    const { uid, qr } = useParams()
    const { anonymousLogin, retrieveQRData } = useAuth()
    const [files, setFiles] = useState([])

    useEffect(() => {
        const test = async() => {
            await anonymousLogin().then( async() => {
                await retrieveQRData(uid, qr).then(snapshot => {
                    if(!snapshot.exists) {
                        snapshot.docs.map(doc => {
                            console.log(doc.data().files)
                            setFiles([...doc.data().files])
                        })
                    }
                })
            })//.catch(err => {
            //     console.log(err)
            // })
        }
        test()
    //eslint-disable-next-line
    }, [])
    return (
        <div>
            <p>{uid} and {qr}</p>
            <table className="table overflow-scroll" >
                <thead>
                    <tr>
                    <th>Document</th>
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        files.map(file => {
                            return (
                            <tr key={file.name}>
                                <td><a href={file.url}>{file.name}</a></td>
                            </tr>
                            )
                        })
                    }  
                </tbody> 
            </table>
        </div>
    )
}
