import React, { useState } from 'react';
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
import { Launcher } from 'react-chat-window';


const NavbarUser = (props) => {
const [isOpen, setIsOpen] = useState(false)
const [messages, setMessages] = useState([])

const openChat = () => {
	props.openChat()
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
		</Navbar>*/}
		<NavWhite>
			<Bars />

			<NavMenu>
			<NavLinkwithOnClick style={{color: 'black'}} onClick={(e) => props.openRepo(e)} activeStyle>
				Your Repositories
			</NavLinkwithOnClick>
			<NavLinkwithOnClick style={{color: 'black'}} onClick={(e) => props.openRequest(e)} activeStyle>
				Your Requests
			</NavLinkwithOnClick>
			<NavLink style={{color: 'black'}} to="/projects" activeStyle>
				Projects
			</NavLink>
			<NavLink style={{color: 'black'}} to='/Ideas' activeStyle>
				Ideas
			</NavLink>
			{window.currentUser && props.user != window.currentUser?
				<Button onClick={()=>openChat()}>Message</Button>
				:
				''
			}
			{/* Second Nav
                       <Button onClick={props.openDiscussions} activeStyle>
				Discussions
			</Button> */}
			{/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
			</NavMenu>
		</NavWhite>
	</>
);
};

export default NavbarUser;
