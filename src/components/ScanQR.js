import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useParams } from 'react-router-dom';
import { Image, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import logo from "./images/dire-logo.png";
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import BasicUI from './BasicUI';

const Owner = (props) => {
    return (
        <div>
            <h5>Personal Details</h5>
            <p>Name: {`${props.data['Last']}, ${props.data['First']} ${props.data['Middle']} ${props.data['Suffix']}`}</p>
            <p>Email: {`${props.data['Email']}`}</p>
            <p>Contact: {`${props.data['Contact']}`}</p>
            <p>Address: {`${props.data['Address']}`}</p>
            <p>Gender: {`${props.data['Gender']}`}</p>
            <p>Civil: {`${props.data['Civil']}`}</p>
        </div>
    )
}

export default function ScanQR() {
    const { uid, qr } = useParams()
    const { anonymousLogin, retrieveQRData, getUser, currentUser, logUser } = useAuth()
    const [files, setFiles] = useState([])
    const [expired, setExpired] = useState(false)
    const [owner, setOwner] = useState()
    var urls = [];

    const date = new Date();
    const currDate = date.getFullYear() + '-'
             + ('0' + (date.getMonth()+1)).slice(-2) + '-'
             +  ('0' + date.getDate()).slice(-2);

    const getDataAndUser = async() => {
        //retrieve qr record
        await retrieveQRData(uid, qr).then(snapshot => {
            if(snapshot.docs.length > 0){
                snapshot.docs.map(doc => {
                    if (Date.parse(currDate) >= Date.parse(doc.data().expires)) {
                        return setExpired(true)
                    }
                    return setFiles([...doc.data().files])
                })
            }else{
                setExpired(true)
            }
        }).catch(err => console.log(err));
        //retrieve qr owner data  
        await getUser(uid).then(snapshot => {
            setOwner(snapshot.data())
        }).catch(err => console.log(err));   
    }

    const retrieveData = async() => {
        if(currentUser){
            getDataAndUser();
        }else{
            //provision an anonymous account if current user does not exist
            await anonymousLogin().catch(err => {
                console.log(err)
            })              
        }
    }

    const handleDownload = async(e) => {
        var zip = new JSZip();
        var count = 0;

        urls.forEach((url) => {
            // loading a file and add it in a zip file
            JSZipUtils.getBinaryContent(url[1], (err, data) => {
                if(err) {
                    throw err; // or handle the error
                }
                zip.file(url[0], data, {binary:true});
                count++;
                if (count === urls.length) {        
                    zip.generateAsync({type:'blob', comment: 'Zip Generated from DIRe - An all-in-one Identification Record'}).then(function(content) {
                        var link = document.createElement('a');
                        link.href = URL.createObjectURL(content);
                        link.download = `${owner.Last}, ${owner.First} ${owner.Last}.zip`;
                        link.click();
                    });
                }
            });
        });
        await logUser(currentUser.uid, qr, owner.Email, date)
    }
    
    
    useEffect(() => {
        retrieveData();
        //eslint-disable-next-line
    }, [currentUser])

    return (
        <div>
            {expired ?  <BasicUI styling="text-center"> 
                        <div className = "font-weight-bold text-center text-danger">
                        <h1>OOPS!</h1>
                        <h3>403 - Access Denied</h3>
                        <h5>Sorry! This page might have an expired or invalid QR Code.</h5>
                        <Link to="/" class="font-weight-normal"><br/>🡠 Back</Link>
                        </div>
                        </BasicUI>
                :
                <div className="text-center"> 
                    <Link to="/">
                        <Image src={logo} fluid/>
                    </Link>
                    <div className="d-flex justify-content-center">
                        <div className="text-left pr-2">
                            {owner ? <Owner data={owner}/>:
                            <div>Retrieving Data...</div>}
                        </div>
                        <div className="text-left pl-3">
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
                                        urls.push([file.name, file.url])
                                        return (
                                        <tr key={file.name}>
                                            <td><a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a></td>
                                        </tr>
                                        )
                                    })
                                }  
                            </tbody> 
                            </table>
                        </div>
                    </div>
                    <Button className="mt-4 fa fa-download" variant="info" onClick={handleDownload}> Download</Button>
                    <div className="mt-5 font-weight-bold">
                        <p>"A digital all-in-one QR code Identifcation system"<br/>
                        DIRe support email: DigIDRecord@gmail.com
                        </p>
                    </div>
                </div>
            }
        </div>
    )
}
