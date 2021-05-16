import React, { useState } from "react"
import { Form, Button, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import BasicUI from './BasicUI'

export default function UpdateProfile() {
  const [data, setData] = useState({suffix: '', first: '', middle: '', last: '',
                                 address: '', contact: '', gender: '', civil: '',
                                email: '', newPassword: '', password: '', confirm: '', selector: 1})                             
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const [step, setStep] = useState(0);
  const { updatePassword, updateEmail, 
    updateUser, reAuthenticateUser } = useAuth()

  const handleSubmit = async(e) => {
    e.preventDefault()
    setError("")
    let updateObject = {}
    if (await reAuthenticateUser(data.password)){
        setLoading(true)   
        switch (step) {
            case 1: 
            case 2:
            case 3:
            case 4:
            case 6:
                if(data.suffix) updateObject = {...updateObject, Suffix: data.suffix};
                if(data.first)  updateObject = {...updateObject, First: data.first};
                if(data.middle)  updateObject = {...updateObject, Middle: data.middle};
                if(data.last) updateObject = {...updateObject, Last: data.last};
                if(data.address) updateObject = {...updateObject, Address: data.address};
                if(data.contact)  updateObject = {...updateObject, Contact: data.contact};
                if(data.gender)  updateObject = {...updateObject, Gender: data.gender};
                if(data.civil) updateObject = {...updateObject, Civil: data.civil};
                if(Object.keys(updateObject).length > 0){
                    try{
                        await updateUser(updateObject)
                            .then(() => {
                                history.push("/")
                            }).catch(err => {
                                setError(err.message)
                            });
                    } catch {
                        console.log("Something went wrong!")
                    } 
                }
                if(data.email) await updateEmail(data.email).then(() => history.push("/"));
                break;
            case 5: 
                if(data.newPassword !== data.confirm){
                    setError("Password do not match!")
                }else{
                    await updatePassword(data.newPassword).then(() => history.push("/"))
                }
                break;
            default:
        }
    }else{
        setError("Wrong Password")
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    let {name, value} = e.target
    if(name === "selector") value = parseInt(value, 10);
    setData({...data,
      [name]: value
    })
  }

  return (
    <BasicUI>
        <div className="w-50 mx-auto">
            {error && <Alert variant="danger">{error}</Alert>}
        </div>
        <Form className="w-50 mx-auto" onSubmit={handleSubmit}>
            {step === 0 &&
            <>  
                <Form.Group>
                    <Form.Control as="select" name="selector" className="update-container" onChange={handleChange} value={data.selector}>
                        <option value="1">Update Current Name</option>
                        <option value="2">Update Contact Details</option>
                        <option value="3">Update Civil Status</option>
                        <option value="4">Update Email</option>
                        <option value="5">Update Password</option>
                    </Form.Control>
                </Form.Group>
                <Button variant="info" onClick={() => setStep(data.selector)} className="w-100">Proceed</Button>   
            </>
            }
            {step === 1 && 
            <>
                <Form.Group id="suffix">
                <Form.Label>Suffix</Form.Label>
                <Form.Control type="text" name="suffix" onChange={handleChange} value={data.suffix}/>
                </Form.Group>
                <Form.Group id="first">
                <Form.Label>First name</Form.Label>
                <Form.Control type="text" name="first" onChange={handleChange} value={data.first} />
                </Form.Group>
                <Form.Group id="middle">
                <Form.Label>Middle name</Form.Label>
                <Form.Control type="text" name="middle" onChange={handleChange} value={data.middle} />
                </Form.Group>
                <Form.Group id="last">
                <Form.Label>Last name</Form.Label>
                <Form.Control type="text" name="last" onChange={handleChange} value={data.last} />
                </Form.Group>
                <Button disabled={loading} className="w-100" onClick={() => setStep(6)}>Update</Button>
            </>
            }
            {step === 2 &&
            <>
            <Form.Group id="address" className="mt-3">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" name="address" onChange={handleChange} value={data.address} />
            </Form.Group>
            <Form.Group id="contact">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type="text" name="contact" onChange={handleChange} value={data.contact} />
            </Form.Group>
            <Button disabled={loading} className="w-100" onClick={() => setStep(6)}>Update</Button>
            </>
            }
            {step === 3 &&
            <>
                <Form.Group id="civil">
                <Form.Label>Civil Status</Form.Label>
                <Form.Control name="civil" as="select" onChange={handleChange} value={data.civil} >
                    <option value="Single">Single</option>
                    <option value="Cohabiting">Cohabiting</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option> 
                    <option value="Separated">Separated</option>
                    <option value="Married">Married</option>
                </Form.Control>
                </Form.Group>
                <Form.Group id="gender">
                <Form.Label>Gender</Form.Label>
                <Form.Control name="gender" as="select" onChange={handleChange} value={data.gender} >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Non-Binary</option>
                </Form.Control>
                </Form.Group>
                <Button disabled={loading} className="w-100" onClick={() => setStep(6)}>Update</Button>
            </>
            }
            {step === 4 &&
            <>
                <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" onChange={handleChange} value={data.email}  />
                </Form.Group>
                <Button disabled={loading} className="w-100" onClick={() => setStep(6)}>Update</Button>
            </>
            }
            {step === 5 &&
            <>
                <Form.Group id="password">
                <Form.Label>Old Password</Form.Label>
                <Form.Control type="password" name="password" onChange={handleChange} value={data.password} required/>
                </Form.Group>
                <Form.Group id="newPassword">
                <Form.Label>New Password</Form.Label>
                <Form.Control type="password" name="newPassword" onChange={handleChange} value={data.newPassword} required/>
                </Form.Group>
                <Form.Group id="password-confirm">
                <Form.Label>New Password Confirmation</Form.Label>
                <Form.Control type="password" name="confirm" onChange={handleChange} value={data.confirm} required/>
                </Form.Group>
                <Button disabled={loading} className="w-100" type="submit">Confirm</Button>               
            </>
            }
            {step === 6 &&
            <>
                <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" onChange={handleChange} value={data.password} required />
                </Form.Group>
                <Button disabled={loading} className="w-100" type="submit">Confirm Changes</Button>
            </>
            }
        </Form>
        <div className="w-100 text-center mt-2">
            <Link to="/">Cancel</Link>
        </div>
    </BasicUI>
  )
}
