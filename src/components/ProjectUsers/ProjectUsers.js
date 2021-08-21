import React from 'react'
import { Component } from 'react'
import '../../App.css';
import User from '../Users/User'
import {Nav} from 'react-bootstrap'
import './ProjectUsers.css'
import { useHistory } from "react-router-dom";
import { withRouter } from 'react-router';

class ProjectUsers extends Component {



    state = {
        requests: [],
        commits: []
    }

    constructor(props){
        super(props)
        this.UserRoute = this.UserRoute.bind(this)
        this.getCommits = this.getCommits.bind(this)
        //this.getCommits()
    }

    UserRoute(user){
        let path = `/user/`+user; 
        this.props.history.push(path);
    }

    fetchRequest(){

    }

    getCommits(){
        fetch('https://github.com/avkumar19/SIH/commits/master?_pjax=%23js-repo-pjax-container')
        .then(res => {
            console.log(res)
            return res.json()
        })
        .then(commitData => {
            console.log(commitData)
            console.log("Hiii")
            this.setState({
                commits: this.state.commits.concat(commitData)
            })
        })
      }

    render(){
  return(
    <div>
    {
        <ul className="user-list">
            {/*
            users.map(user => {
                return (<li>
                            <h2>Users working on this project: </h2>
                            <button onClick={() => openUser(user)}>
                                {user}
                            </button>
                        </li>) 
            })
            */}
            
            <>
            <Nav className="col-md-12 d-none d-md-block bg-l sidebar span"
            activeKey="/home"
            onSelect={selectedKey => alert(`selected ${selectedKey}`)}
            >
            <div className="sidebar-sticky"></div>
            <h3>Project admin</h3>
            {this.props.admin}
            <h3>Users working on this</h3>
            {this.props.users.map(user => {
                return (<div><Nav.Item>
                            {/*<Nav.Link onClick={() => openUser(user)}>{user}</Nav.Link>*/}
                            <Nav.Link onClick={() => this.UserRoute(user)} >{user}</Nav.Link>
                        </Nav.Item></div>) 
            })}
            <hr></hr>
            <h3>Latest activity</h3>
            {this.props.commits?.map(request => {
                return (
                    <div></div>
                )
            })}

            </Nav>
            </>
        </ul>

    }
    </div>
    )
    }
}

export default withRouter(ProjectUsers)