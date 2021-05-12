import React, { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useParams } from 'react-router-dom'


const Owner = (props) => {
    console.log(typeof(props.data));
    return (
        <ul>
            {
                Object.keys(props.data).map(function(keyName, keyIndex) {
                    return <div key={keyName}>{keyName}: {props.data[keyName]}</div>
                    // use keyName to get current key's name
                    // and a[keyName] to get its value
                })
            }
        </ul>
    )
}
export default function ScanQR() {
    const { uid, qr } = useParams()
    const { anonymousLogin, retrieveQRData, getUser, currentUser } = useAuth()
    const [files, setFiles] = useState([])
    const [expired, setExpired] = useState(false)
    const [owner, setOwner] = useState()

    const date = new Date();
    const currDate = date.getFullYear() + '-'
             + ('0' + (date.getMonth()+1)).slice(-2) + '-'
             +  ('0' + date.getDate()).slice(-2);

    const getDataAndUser = async() => {
        //retrieve qr record
        await retrieveQRData(uid, qr).then(snapshot => {
            if(!snapshot.exists) {
                snapshot.docs.map(doc => {
                    if (Date.parse(currDate) >= Date.parse(doc.data().expires)) {
                        setExpired(true)
                    }
                    setFiles([...doc.data().files])
                })
            }
        }).catch(err => console.log(err));
        //retrieve qr owner data  
        await getUser(uid).then(snapshot => {
            setOwner(snapshot.data())
            console.log(owner)
        }).catch(err => console.log(err));   
    }

    //runs if currentUser changes
    useEffect(() => {
        const retrieveData = async() => {
            if(currentUser){
                console.log(currentUser.uid)
                getDataAndUser();
            }else{
                //provision an anonymous account if current user does not exist
                await anonymousLogin().catch(err => {
                    console.log(err)
                })              
            }
        }
        retrieveData();
    }, [currentUser])

    return (
        <div>
            {expired ? <div>Sorry! The QR Code you Scanned may have an expired file in it</div>:
                <>  
                    {owner ? <Owner data={owner}/>:
                    <div>Retrieving Data...</div>}
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
                </>
            }
        </div>
    )
}
