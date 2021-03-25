import React from "react"
import Signup from "./Signup"
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Dashboard from "./Dashboard"
import Login from "./Login"
import PrivateRoute from "./PrivateRoute"
import ForgotPassword from "./ForgotPassword"
import UpdateProfile from "./UpdateProfile"
import Documents from "./Documents"
import GenerateQR from "./GenerateQR"

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Switch>
          <PrivateRoute exact path="/" component={Dashboard} />
          <PrivateRoute path="/update-profile" component={UpdateProfile} />
          <PrivateRoute path="/generate-qr" component={GenerateQR} />
          <PrivateRoute path="/Documents" component={Documents} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/" render={() => <div className="text-center">404 Page Not Found</div>}/>
        </Switch>
        </AuthProvider>
      </Router>
    </>
    )
}

export default App
