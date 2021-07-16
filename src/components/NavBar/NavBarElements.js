import { FaBars } from 'react-icons/fa';
import { NavLink as Link1, Link as Link2 } from 'react-router-dom';
import styled from 'styled-components';

export const Nav = styled.nav`
background: black;
height: 70px;
display: flex;
justify-content: space-between;
padding: 0.2rem calc((100vw - 1000px) / 2);
z-index: 12;
/* Third Nav */
/* justify-content: flex-start; */
`;

export const NavBlack = styled.nav`
background: black;
height: 80px;
display: flex;
justify-content: space-between;
padding: 0.2rem calc((100vw - 1000px) / 2);
z-index: 12;
/* Third Nav */
/* justify-content: flex-start; */
`;

export const NavWhite = styled.nav`
background: white;
color: black;
border-color: #808080;
border-style: solid;
border-width: thin;
height: 66px;
display: flex;
justify-content: space-between;
padding: 0.2rem calc((100vw - 1000px) / 2);
z-index: 12;
/* Third Nav */
/* justify-content: flex-start; */
`
;

export const NavLinkIcon = styled(Link1)`
color: white;
font-size: medium;
border-color: #808080;
display: flex;
align-items: center;
text-decoration: none;
padding: 0 1rem;
cursor: pointer;
&.active {
	color: white;
	border-bottom: 3px solid orange
}
`;

export const NavLink = styled(Link1)`
color: white;
font-size: medium;
border-color: #808080;
display: flex;
align-items: center;
text-decoration: none;
padding: 0 1rem;
height: 100%;
cursor: pointer;
&.active {
	color: white;
	border-bottom: 3px solid orange
}
&:hover{
	background: grey;
	border-radius: 10px;
	padding: 5px;
}
`;

export const NavLinkwithOnClick = styled(Link2)`
color: white;
font-size: medium;
border-color: orange;
display: flex;
align-items: center;
text-decoration: none;
padding: 0 1rem;
height: 100%;
cursor: pointer;
&:active {
	color: white;
	border-bottom: 5px solid orange
}
&:hover{
	background: grey;
	border-radius: 10px
}
`;

export const Bars = styled(FaBars)`
display: none;
color: #808080;
@media screen and (max-width: 768px) {
	display: block;
	position: absolute;
	top: 0;
	right: 0;
	transform: translate(-100%, 75%);
	font-size: 1.8rem;
	cursor: pointer;
}
`;

export const NavMenu = styled.div`
display: flex;
align-items: center;
margin-right: -24px;
/* Second Nav */
/* margin-right: 24px; */
/* Third Nav */
/* width: 100vw;
white-space: nowrap; */
@media screen and (max-width: 768px) {
	display: none;
}
`;

export const NavBtn = styled.nav`
display: flex;
align-items: center;
margin-right: 24px;
/* Third Nav */
/* justify-content: flex-end;
width: 100vw; */
@media screen and (max-width: 768px) {
	display: none;
}
`;

export const NavBtnLink = styled(Link1)`
border-radius: 4px;
background: #808080;
padding: 10px 22px;
color: #000000;
outline: none;
border: none;
cursor: pointer;
transition: all 0.2s ease-in-out;
text-decoration: none;
/* Second Nav */
margin-left: 24px;
&:hover {
	transition: all 0.2s ease-in-out;
	background: #fff;
	color: #808080;
}
`;
