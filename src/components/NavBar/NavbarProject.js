import React, { useState, useEffect }  from 'react';
import {
Nav,
NavLink,
Bars,
NavMenu,
NavBtn,
NavBtnLink,
NavWhite,
NavLinkwithOnClick
} from './NavBarElements';
import Button from 'react-bootstrap/Button' 
import helpers  from '../../container/RequestHelper'
import { publish, subscribe } from 'pubsub-js'
import NavBar from './NavBar';
import './NavBar.css'

const NavbarUser = (props) => {

let currentUser = {"projects": [{"name": "collab", "detail": "Application for collaborating on projects"}], "name": "arpit", "description": "MLEng", "requests": [{"user": "abc", "project": "dadasds"}]}
const [onDiscussions, setOnDiscussions] = useState(false)
const [newNotification, setNewNotification] = useState(props.discussions)
const [seenDiscussions, setSeenDisc] = useState(props.seenDiscussions)
const [userRequests, setUserRequests] = useState([])

const getCurrentUserRequests = () => {
	fetch('http://127.0.0.1:8000/user/'+window.currentUser+'/requests')
	.then(res => res.json())
	.then(requests =>{
		console.log(requests)
		console.log("requests")
		setUserRequests(requests)
		console.log(userRequests)
	})
}

useEffect(() => {
	getCurrentUserRequests()
}, [])

useEffect(() => {
	modifyRequest()
}, [userRequests])

const subscriber = (msg, data) => {
	console.log("Subscriber has msg " + msg + " and data " + data);
	// Update the UI with a new copy of all messages.
	if(!onDiscussions){
		setNewNotification(newNotification+1)
	}
}

const onNotifications = (e) => {
	setOnDiscussions(true)
	setSeenDisc(newNotification)
	fetch('http://127.0.0.1:8000/user/'+currentUser.name, {method: 'PATCH', headers: {    "Content-type": "application/json"  }, body: JSON.stringify({ seenDiscussions: seenDiscussions })})
	.then(res => res.json())
	props.openDiscussions(e)
}

const sendRequest = (project) => {
	var currentRequests = userRequests
	let request = {request: project.name, user: currentUser.name}
	let newRequests = currentRequests.concat(request)
	setUserRequests(newRequests)
	console.log("Huiojisd")
	console.log(newRequests)
	helpers.sendJoinRequest(project)
}

const onCommits = (e) => {
	props.openCommits()
}

const onSettings = (e) => {
	props.openSettings()
}

const modifyRequest = () => {
	if(props.enableJoinProject && userRequests.filter(request => request.request === props.project.name).length>0){
		return (<Button onClick={()=>helpers.removeRequest(userRequests.filter(request => request.request === props.project.name)[0])} style={{color: 'white', borderRadius: '20px', right: '100px', position: 'absolute'}}>
			Withdraw Request
		</Button>)
	}
	else if(props.enableJoinProject && !(userRequests.filter(request => request.request === props.project.name).length>0)){
		console.log(props.project)
		return (<Button onClick={()=>sendRequest(props.project)} style={{color: 'white', backgroundColor: 'blue', fontWeight: '600', borderRadius: '20px', right: '100px', position: 'absolute'}}>
			Send Join Request
		</Button>)
	}
}

const showRequests = () => {
	if(props.showRequests){
		return (<NavLinkwithOnClick className={props.active === "requests" ? 'active' : null} style={{ color: "black", padding: "20px"}} onClick={(e) => props.openRequests(e)}>
			Requests
		</NavLinkwithOnClick>
		)
	}
}

var token = subscribe('notifications-channel', subscriber)
return (
	<div style={{fontWeight: '550'}}>
		{/*import Navbar from 'react-bootstrap/Navbar'
			import NavDropdown from 'react-bootstrap/NavDropdown'
			import Nav from 'react-bootstrap/Nav'<Navbar bg="light" expand="lg">
		<Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
		<Navbar.Toggle aria-controls="basic-navbar-nav" />
		<Navbar.Collapse id="basic-navbar-nav">
			<Nav className="mr-auto">
			<Nav.Link href="#home">Home</Nav.Link>
			<Nav.Link href="#link">Link</Nav.Link>
			<NavDropdown title="Dropdown" id="basic-nav-dropdown">
				<NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
				<NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
				<NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
				<NavDropdown.Divider />
				<NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
			</NavDropdown>
			</Nav>
		</Navbar.Collapse>
		</Navbar>*/
		getCurrentUserRequests}
		<NavWhite>
			<Bars />

			<NavMenu>
			<NavLinkwithOnClick className={props.active === "code" ? 'active' : null} style={{ color: "black", padding: "20px"}} onClick={(e) => props.openCode(e)} >
				Code
			</NavLinkwithOnClick>
			{
				showRequests()
			}
			{props.showRequests && props.totalReq>0?
				<div class="circle"><p>{props.totalReq}</p></div>: ''
			}
			<NavLinkwithOnClick className={props.active === "discussions" ? 'active' : null} style={{ color: "black", padding: "20px"}} onClick={(e) => onNotifications(e)} >
				Discussions
			</NavLinkwithOnClick>
			{
				newNotification>0?<div class="circle"><p>{newNotification - seenDiscussions}</p></div>: ''
			}
			<NavLinkwithOnClick className={props.active === "commits" ? 'active' : null} style={{color: 'black'}} onClick={(e) => onCommits(e)}>
				Commits
			</NavLinkwithOnClick>
            {/*<NavLink className={props.active === "prs" ? 'active' : null} style={{color: 'black'}} to="/projects">
				Pull Requests
			</NavLink>*/}
			<NavLinkwithOnClick className={props.active === "commits" ? 'active' : null} style={{color: 'black'}} onClick={(e) => onSettings(e)}>
				Settings
			</NavLinkwithOnClick>
			{modifyRequest()}
			<NavLinkwithOnClick className={props.active === "commits" ? 'active' : null} style={{color: 'black'}} onClick={(e) => onSettings(e)}>
				Add Collaborators
			</NavLinkwithOnClick>
            {
			console.log(currentUser.requests.filter(request => request.project === props.project.name).length>0)}
			{/* Second Nav
                       <Button onClick={props.openDiscussions} activeStyle>
				Discussions
			</Button> */}
			{/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
			</NavMenu>
		</NavWhite>
	</div>
);
};

export default NavbarUser;
