import React, {useEffect, useState} from 'react';
import {
Nav,
NavLink,
NavLinkIcon,
Bars,
NavMenu,
NavBtn,
NavBtnLink,
NavBlack,
} from './NavBarElements';
import './NavBar.css'
import { ButtonGroup, Dropdown } from 'react-bootstrap'
import { useHistory } from "react-router-dom";
import BellIcon from 'react-bell-icon';
import { FaPlus } from 'react-icons/fa';


const Navbar2 = (props) => {
let history = useHistory();

const [seen, setSeen] = useState(0)
const [seenReq, setSeenReq] = useState(0)

useEffect( () => {
	fetch("http://127.0.0.1:8000/user/" + currentUser.name)
	.then(res=>res.json())
	.then(data => {
		setSeen(data[0].seenNotifications)}
	)
}, []);

useEffect( () => {
	fetch("http://127.0.0.1:8000/user/" + currentUser.name, {  method: "PATCH",  headers: {    "Content-type": "application/json"  }, body: JSON.stringify({ seenNotifications: seen })})
	.then(res=>res.json())
	console.log(seen)
}, [seen]);

const currentUser = {"projects": [{"name": "collab", "detail": "Application for collaborating on projects"}], "name": "arpit", "description": "MLEng", "requests": [{"user": "abc", "project": "def"}]}

localStorage.setItem('requests', props.totalRequests - seenReq)

const changeSeenReq = () => {
	if(props.totalRequests){
		setSeenReq(props.totalRequests)
	}
	else{
		localStorage.setItem('requests', 0)
	}
}

/*const changeSeen = () => {
	if(props.totalRequests){
		setSeenReq(props.totalRequests)
	}
	else{
		localStorage.setItem('requests', 0)
	}
}*/

const changeSeen = () => {
	if(props.notifications){
		setSeen(props.notifications.length)
		/*fetch("http://127.0.0.1:8000/user/" + currentUser.name + "/notifications")
		.then(res=>res.json())
		.then(data => setSeen(data.length))*/
		
		//.then(data => setSeen(data.length))
	}
	else{
		localStorage.setItem('requests', 0)
	}
}


const showSettings = () =>{
	history.push("/settings");
}

const signIn = () =>{
	history.push("/signin");
}

const logOut = () =>{
	delete window.currentUser
	history.push("/signin")
}

const notificationItem = (notification) =>{
	console.log(new Date(notification.timestamp).getTime())
	let message="";
	if(notification.message?.includes("join")){
		var user= notification.message.substring(0,notification.message.indexOf("wants"))
		var rest = notification.message.substring(notification.message.indexOf("wants"))
		message = <Dropdown.Item><NavLink to={'/user/'+user}>{user}</NavLink>{rest}</Dropdown.Item>
	}
	if(notification.message?.includes("project")){
		var rest = notification.message.substring(0,notification.message.indexOf("project")+"project".length-1)
		var project = notification.message.substring(notification.message.indexOf("project")+"project".length)
		return <Dropdown.Item>{rest}<NavLink to={'/user/'+user}>{project}</NavLink></Dropdown.Item>
	}
	if(message !== ""){
		return message
	}
	return <Dropdown.Item>{notification.message}</Dropdown.Item>
}

const displayNotification = () => {

	if(props.notification){
		props.notifications.map(notification=>{
			return notificationItem(notification)
		})
	}
	else if(window.notifications){
		window.notifications.map(notification=>{
			return notificationItem(notification)
		})
	}
}

const renderUnseenNotifications = () => {
	if(props.notifications && props.notifications.length-seen>0){
		return <div class="circle"><p>{props.notifications?.length - seen}</p></div>
	}
	else if(window.notifications && window.notifications.length-seen>0){
		return <div class="circle"><p>{window.notifications.length - seen}</p></div>
	}
	else{
		return ''
	}
}

const sortByTime = (a, b) => {
	if( a === undefined || b === undefined){
		return 0
	}
	var d1 = new Date(a.timestamp).getTime()
	var d2 = new Date(b.timestamp).getTime()

	console.log(d1+" "+d2);
	console.log(d1>d2);
	console.log("Huiiiiiii")
	return (d1 > d2)
}

const sortAndTrim = () => {
	if(props.notifications){
		var sorted = props.notifications?.sort(function(a,b){
			if( a === undefined || b === undefined){
				return 0
			}
			var d1 = new Date(a.timestamp).getTime()
			var d2 = new Date(b.timestamp).getTime()
		
			console.log(d1+" "+a.user);
			console.log(d1>d2);
			console.log("Huiiiiiii")
			return (d2 - d1)
		})
		console.log(sorted)
		var render = []
		sorted?.slice(0,8).map(notification=>{
			console.log(notification)
			render = render.concat(notificationItem(notification))
		})
		console.log(render)
		return render
	}
	else{
		var sorted = window.notifications?.sort((a,b)=>sortByTime(a,b))
		var render = []
		sorted?.slice(0,8).map(notification=>{
			render = render.concat(notificationItem(notification))
		})
		console.log(render)
		return render
	}
}

const sortAndReturn = (notifications) => {
	return notifications.sort(sortByTime())
}

return (
	<>
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
		</Navbar>
		{props.notifications.map(notification => {
						return (
						<Dropdown.Menu>
								<Dropdown.Item>{notification.message}</Dropdown.Item>
						</Dropdown.Menu>
						)
					})}
					onClick={setSeen(props.notifications.length)}*/}
		
		<NavBlack>
			<Bars />
			<NavMenu>
			<div>
				{props.notification && props.notification===true?
				<div class="rowC" style={{display: 'flex'}} >
					<Dropdown text="Notifications">
							<Dropdown.Toggle className="navDrop" onClickCapture={()=>changeSeen()} ><BellIcon width='30' height="30" active={true} color="white" /></Dropdown.Toggle>
							<Dropdown.Menu>
									{sortAndTrim()}
							</Dropdown.Menu>
					</Dropdown>{renderUnseenNotifications()}
				</div>
				:''
				}
			</div>
			{props.request && props.request===true?
				<React.Fragment>
					<NavLink onClickCapture={() => changeSeenReq()} to='/requests' activeStyle>
						Your Requests
					</NavLink>
					{ props.totalRequests && (props.totalRequests - seenReq)>0 ? 
					<div class="circle"><p>{props.totalRequests - seenReq}</p></div>
					: localStorage.getItem('requests') > 0 ? 
						<div class="circle"><p>{localStorage.getItem('requests')}</p></div>
					: ''
					}
				</React.Fragment>
				:
				''
			}

			<NavLink to='/dashboard' activeStyle>
				Projects
			</NavLink>
			<NavLink to='/blogs' activeStyle>
				Blogs
			</NavLink>
			{/* Second Nav */}
			{/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
			</NavMenu>
			<Dropdown  /*as={ButtonGroup}*/>
				<div class="rowC">
				{window.currentUser && !(props.noProfile === true)?
				<NavBtn>
				<NavBtnLink style={{borderRadius: '50%', backgroundColor: 'grey', marginBottom: '30px'}} to={'/user/' + window.currentUser}>
                        <h1 className="font-fit2">{window.currentUser.split("/(\s+)/")[0].charAt(0).toUpperCase()}</h1>
				</NavBtnLink>
				</NavBtn>
				:''
				}
				<Dropdown.Toggle style={{backgroundColor: 'black', borderColor: 'black', height: '45px'}} split variant="success" id="dropdown-custom-2" />
				<Dropdown.Menu className="super-colors">
					<Dropdown.Item eventKey="1" >Repositories</Dropdown.Item>
					<Dropdown.Item eventKey="2" onClick={()=>showSettings()}>Settings</Dropdown.Item>
					<Dropdown.Item eventKey="3" >Customization</Dropdown.Item>
					<Dropdown.Divider />
					{!window.currentUser || window.currentUser?.type === 'cors'?
					<Dropdown.Item eventKey="5" onClick={()=>signIn()}>Sign In</Dropdown.Item>
					:
					<Dropdown.Item eventKey="4" onClick={()=>logOut()}>Log Out</Dropdown.Item>
					}
				</Dropdown.Menu>
				{window.currentUser && typeof window.currentUser === "string"?
				<Dropdown style={{marginLeft: '100px', marginBottom: '10px'}}>
					<Dropdown.Toggle style={{marginTop: '-8px'}} className="navDrop bigPlus" onClickCapture={()=>changeSeen()} ><FaPlus/></Dropdown.Toggle>
					<Dropdown.Menu>
						<Dropdown.Item eventKey="1" href={'/repository'}>Create Repository</Dropdown.Item>
						<Dropdown.Item eventKey="2" href={'/repository'}>Import Git Repository</Dropdown.Item>	
					</Dropdown.Menu>
				</Dropdown>
				:''
				}
				</div>
			</Dropdown>
			
			</NavBlack>
	</>
);
};

export default Navbar2;
