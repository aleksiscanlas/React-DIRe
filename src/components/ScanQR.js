import React, { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useParams } from 'react-router-dom'

export default function ScanQR() {
    const { uid, qr } = useParams()
    const { anonymousLogin, retrieveQRData } = useAuth()
    const [files, setFiles] = useState([])
    const [expired, setExpired] = useState(false)

    const date = new Date();
    const currDate = date.getFullYear() + '-'
             + ('0' + (date.getMonth()+1)).slice(-2) + '-'
             +  ('0' + date.getDate()).slice(-2);


    useEffect(() => {
        const test = async() => {
            try{
                await retrieveQRData(uid, qr).then(snapshot => {
                    if(!snapshot.exists) {
                        snapshot.docs.map(doc => {
                            console.log(doc.data().expires, currDate)
                            if (currDate === doc.data().expires) {
                                setExpired(true)
                            }
                            setFiles([...doc.data().files])
                        })
                    }
                })                
            }catch{
                await anonymousLogin().then( async() => {
                    await retrieveQRData(uid, qr).then(snapshot => {
                        if(!snapshot.exists) {
                            snapshot.docs.map(doc => {
                                var d1 = Date.parse(doc.data().expires);
                                console.log(doc.data().expires)
                                if (currDate === d1) {
                                    setExpired(true)
                                }
                                setFiles([...doc.data().files])
                            })
                        }
                    })
                }).catch(err => {
                     console.log(err)
                })
            }
        }
        test()
    //eslint-disable-next-line
    }, [])

    return (
        <div>
            {expired ? <div>Custom 404 found for Expired QR</div>:
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
            }
        </div>
    )
}
