import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Button, Form, Input } from 'semantic-ui-react'
import { Card } from 'react-bootstrap'
import './LogIn.css'
import {autoBind} from 'react-autobind'

class LogIn extends React.Component {

    state = {
        username: '',
        password: '',
        name: '',
        gender: '',
        errors: [],
        signUp: false,
        email: '',
        githubId: '',
        organization: ''
    }

    constructor(props){
        super(props)
        this.signUp = this.signUp.bind(this)
    }

    signUp(){
        this.setState({
            signUp: true
        })
    }

    logInForm = ()=>{
        return (<div className="Login" >
                    {this.state.errors.length>0?
                        (<Card style={{background: 'pink', borderColor: 'red', marginBottom: '20px', width: '600px', left: '34%'}}>{this.state.errors[0]}</Card>)
                    :
                        ''
                    }
                    <Card style={{top: '20%', left: '34%', position: 'absolute', background: 'white', width: '600px', margin: 'auto'}}>
                        <Card.Header style={{background: '#034afc', borderRadius: '5px'}}>
                            Sign In to BitBator.
                        </Card.Header>

                        <Form className="Login">
                        <Form.Field style={{maxWidth: '320px', margin: '0 auto'}}>
                        <label htmlFor="username" className="name-input">User Name or Email address:</label>
                        <Input onChange={this.handleOnChangeName} type="text" id='username'name="username" placeholder="write your username"/>
                        </Form.Field>

                        <Form.Field style={{maxWidth: '320px', margin: '0 auto'}}>
                            <label htmlFor="password" className="password">Password:</label>
                            <Input onChange={this.handleOnChangePass} type="password" id='password' name="password" placeholder="write your password"/>
                        </Form.Field>
                        <Button style={{margin: '20px', backgroundColor: 'orange'}} type="submit" onClick={this.logInSubmitted}>Sign In</Button>
                        <Card style={{color: 'white'}}>Don't have an account on Collab? <Link to='/signin' onClick={this.signUp}>Sign Up</Link></Card>
                        </Form>
                    </Card>
                </div>)
    }

    signUpForm = ()=>{
       return (
           <Card style={{background: 'white'}}>
            <Form onChange={this.handleOnChange} className="sign-up-form">
                <Form.Field style={{maxWidth: '320px', margin: '0 auto'}}>
                    <label htmlFor="name" className="name-input">Name: (Your real Name) *</label>
                    <Input onChange={(e)=>this.setState({name: e.target.value})} type="text" id='name' name="name" placeholder="write your name"/>
                </Form.Field>
                <Form.Field style={{maxWidth: '320px', margin: '0 auto'}}>
                    <label htmlFor="Description/Interests" className="name-input">Description: (Tell us about you and your interests. So that we would match you with people with similar interests.)</label>
                    <Input onChange={(e)=>this.setState({description: e.target.value})} type="text" id='name' name="name" placeholder="Tell us about yourself..."/>
                </Form.Field>
                <Form.Field style={{maxWidth: '320px', margin: '0 auto'}}>
                    <label htmlFor="E-mail" className="name-input">E-mail *</label>
                    <Input onChange={(e)=>this.setState({email: e.target.value})} type="email" id='name' name="name" />
                </Form.Field>
                <Form.Field style={{maxWidth: '320px', margin: '0 auto'}}>
                    <label htmlFor="E-mail" className="name-input">Github Profile</label>
                    <Input onChange={(e)=>this.setState({githubId: e.target.value})} type="email" id='name' name="name" placeholder="Your github profile (The shared repos will be created on your github)"/>
                </Form.Field>
                <Form.Field style={{maxWidth: '320px', margin: '0 auto'}}>
                    <label htmlFor="E-mail" className="name-input">Organization</label>
                    <Input onChange={(e)=>this.setState({organization: e.target.value})} type="email" id='name' name="name" />
                </Form.Field>

            {/*<label htmlFor="location" className="location"> Location:</label>
            <input type="text" id='location' name="location" placeholder="write your location"/>*/}
                <Form.Field style={{maxWidth: '320px', margin: '0 auto'}}>
                    <label htmlFor="username" className="username">User Name (The name that will be used to uniquely identify on Collab.) *</label>
                    <Input onChange={(e)=>this.setState({username: e.target.value})} type="text" id='username' name="username" className="username-input"placeholder="write your username"/>
                </Form.Field>

                <Form.Field style={{maxWidth: '320px', margin: '0 auto'}}>
                    <label htmlFor="password" className="password">Password *</label>
                    <Input onChange={(e)=>this.setState({password: e.target.value})} type="password" id='password' className="password-input" name="password" placeholder="write your password"/>
                </Form.Field>

                <Button style={{margin: '10px 10px 10px 10px', color: 'green'}} type="submit" onClick={this.signUpSubmitted} >Create account</Button>

        </Form></Card> )
    }

    handleOnChangeName = (event) => {
        // console.log(event.target.name, event.target.value)
        this.setState({
            username: event.target.value
        })
    }

    handleOnChangePass = (event) => {
        // console.log(event.target.name, event.target.value)
        this.setState({
            password: event.target.value
        })
    }

    logInSubmitted = (event) => {
        event.preventDefault()
        // console.log("derya is life")
        console.log(this.state.username+" "+this.state.password)
        fetch("http://127.0.0.1:8000/login/", {
            method: 'POST',
            headers: {
               "Content-Type": "application/json",
               "Accept": "application/json"
           },
           body: JSON.stringify(
               {
                   username: this.state.username,
                   password: this.state.password
               }
           )
       })
       .then(res => res.json())
       .then(data => {
           console.log(data)
           if (data.error) {
               console.log(data)
               if(this.state.errors.length == 0){
                this.setState({
                    errors: this.state.errors.concat(data.error)
                })
               }
           }else{
               //this.props.setToken(data.token, data.user_id)
               console.log(data)
               window.currentUser = data.name
               localStorage.setItem("username", data.name)
               this.props.history.push('/dashboard')
           }
       })
       .catch((exception) => {
            /*this.setState({
                errors: exception.errors
            })*/
           console.log(exception)
       })
       this.setState({
           username: '',
           password: ''
       })
    //    this.props.history.push('/')
    }

    signUpSubmitted = (event) => {
        event.preventDefault()
        // console.log("derya is life")
        fetch("http://127.0.0.1:8000/login/", {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
           },
           body: JSON.stringify(
               { 
                   name: this.state.name,
                   descrption: this.state.description,
                   username: this.state.username,
                   password: this.state.password,
                   email: this.state.email,
                   githubId: this.state.githubId
               }
           )
       })
       .then(res => res.json())
       .then(data => {
           if (data.errors) {
            this.setState({
                errors: data.errors
            })
           }else{
            //this.props.setToken(data.token, data.user_id)
            window.currentUser = data.name
            this.props.history.push('/dashboard')
           }
       })
       .catch(error=>{
            this.setState({
                errors: this.state.errors.concat(error)
            })
       })
       fetch("http://127.0.0.1:8000/users/", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
           },
           body: JSON.stringify(
               {
                name: this.state.name,
                description: this.state.description,
                visible: true
               }
           )
        }).then(res => res.json())
        .then(data => {
            if (data.errors) {
             this.setState({
                 errors: data.errors
             })
            }
        })
    }
    

    render (){

        return(
            <div>
      { this.state.errors && this.state.errors.length > 0 ?
      
           <ul>
      {this.state.errors.map(error => <li>{error}</li>)}
          </ul> : null
    }
               
               
               {
                   /*this.props.renderProps.location.pathname === '/'  ? 
                   
                   this.logInForm()
                  : */
                  this.state.signUp?
                  this.signUpForm():
                   this.logInForm()
               }  

               
            </div>
            
        )
    }
}

export default withRouter(LogIn);