import React, { Component } from 'react'
import { Form, Button } from 'react-bootstrap'
import Navbar2 from '../components/NavBar/NavBar2'
import './Settings.css'

class Settings extends Component{
    type="radio";
    currentUser="arpit"
    state = {
        name: "",
        access: "all"
    }

    constructor(props){
        super(props)
    }

    changeAccess(accessLevel){
        this.setState({
            access: accessLevel
        })
        
    }

    changeProfile(){
        fetch('http://127.0.0.1:8000/user/' + this.currentUser, {  method: "POST",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({   access: this.state.access, name: this.state.name  })})
        .then(res => res.json())
    }

    render(){
        return(
        <div>
        <div style={{color: "white", fontSize: "medium"}}><Navbar2 notification={true} request={true} notifications={["0"]}/></div>
        <Form style={{width: "300px", margin: 'auto', textAlign: 'left'}}>
            <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control onChange={this.changeName} type="name" placeholder="" />
                <Form.Text className="text-muted">
                Your username as it will appear around Collaborate.
                </Form.Text>
            </Form.Group>

            <Form.Label>Set Access level to your Repositories</Form.Label>
            <Form.Check style={{color: 'black'}} name="access"
                        type={this.type}
                        id={`default-${this.type}`}
                        label={"Myself"}
                        onChange={()=>this.changeAccess("private")}>
            </Form.Check>
            <Form.Check name="access"
                        type={this.type}
                        id={`default-${this.type}`}
                        label={"Anyone on Collaborate"}
                        onChange={()=>this.changeAccess("all")}>
            </Form.Check>
            <Form.Check name="access"
                        type={this.type}
                        id={`default-${this.type}`}
                        label={"People from my Organization"}
                        onChange={()=>this.changeAccess("organization")}>
            </Form.Check>
            <Form.Check name="access"
                        type={this.type}
                        id={`default-${this.type}`}
                        label={"Connected to me"}
                        onChange={()=>this.changeAccess("connections")}>
            </Form.Check>

            <Button onClick={this.changeProfile}>Update Profile</Button>

        </Form>
        </div>
        )
    }
}

export default Settings