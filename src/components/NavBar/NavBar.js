import React from 'react'
import { NavLink  } from 'react-router-dom';

const NavBar = () => {

const renderButtons = () => {
    if (localStorage.token) {
     return<>
     <NavLink className="nav-link" to='/'>Home</NavLink>
     {/* <NavLink className="nav-link" to="/Profile">Profile</NavLink>    */}
     </>
    }else {
      return (
        <>
        <NavLink className="nav-link" to='/requests'>Your Requests</NavLink>
        <NavLink className="nav-link" to='/profile'>Profile</NavLink>
        
        </>
      )
    }
  }
      return (
            
        <div className="App">
          <header className="header"> 
              <h1>
                Collaborate
              </h1>
              <div className="clear"></div>
              <div className="nav-bar">
                  {renderButtons()}  
               </div>
          </header>
        </div>
      )
  }

export default NavBar