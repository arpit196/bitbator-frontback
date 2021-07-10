import React, {useState} from 'react';
import {
Nav,
NavLink,
Bars,
NavMenu,
NavBtn,
NavBtnLink,
NavLinkwithOnClick
} from './NavBarElements';
import Button from 'react-bootstrap/Button'
import { Dropdown, ButtonGroup } from 'react-bootstrap'
import { useHistory, Link } from "react-router-dom";


const Navbar3 = (props) => {
	let history = useHistory();
	const [seen, setSeen] = useState(0)
	const [seenReq, setSeenReq] = useState(0)

	localStorage.setItem('requests', props.totalRequests - seenReq)

	console.log(localStorage.getItem('requests'))

	const changeSeen = () => {
		if(props.totalRequests){
			setSeenReq(props.totalRequests)
		}
		else{
			localStorage.setItem('requests', 0)
		}
	}

	const showSettings = () =>{
		history.push("/settings");
	}
return (
	<div style={{fontWeight: '600'}}>
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
		</Navbar>*/}
		<Nav>
			<Bars />

			<NavMenu>
			<NavLink to='/notification' activeStyle>
				Notifications
			</NavLink>
			<NavLink to='/requests' activeStyle>
				Your Requests
			</NavLink>
			<NavLink to='/dashboard' activeStyle>
				Projects
			</NavLink>
			<NavLink to='/blogs' activeStyle>
				Blogs
			</NavLink>
            <NavLinkwithOnClick onClick={props.openDiscussions} activeStyle>
				Discussions
			</NavLinkwithOnClick>
            {console.log(props)}
			{/* Second Nav */}
			{/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
			</NavMenu>
			<Dropdown class={{height: '30px'}}>
				<div class="rowC">
				<NavBtn>
				<NavBtnLink to='/signin'>Profile</NavBtnLink>
				</NavBtn>
				<Dropdown.Toggle split variant="success" id="dropdown-custom-2" />
				<Dropdown.Menu  className="super-colors">
					<Dropdown.Item eventKey="1" >Repositories</Dropdown.Item>
					<Dropdown.Item eventKey="2" onClick={()=>showSettings()}>Settings</Dropdown.Item>
					<Dropdown.Item eventKey="3" active>Customization</Dropdown.Item>
					<Dropdown.Divider />
					<Dropdown.Item eventKey="4">Log Out</Dropdown.Item>
				</Dropdown.Menu>
				</div>
			</Dropdown>
		</Nav>
	</div>
);
};

export default Navbar3;
