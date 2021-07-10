import React, { Component } from 'react'
import ProjectFields from '../components/ProjectFields/ProjectFields'
import ProjectUsers from '../components/ProjectUsers/ProjectUsers'
import SentRequest from '../components/SentRequests/SentRequests'
import ReceivedRequest from '../components/ReceivedRequest/ReceivedRequest'
import { Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import autoBind from 'react-autobind/lib/autoBind'
import Navbar2 from '../components/NavBar/NavBar2'

class Notifications extends Component {
  currentUser = 'arpit'  
  state = {
      notifications: [],
      project: {}
    }
    
    constructor(props){
      super(props)
      this.openProject = this.openProject.bind(this)
      autoBind(this)
    }

    componentDidMount(){
      fetch('http://127.0.0.1:8000/users/'+ this.currentUser +'/notifications')
      .then(res => res.json())
      .then(notificationsData => {
       console.log(notificationsData)
       this.setState({
        notifications: notificationsData
       })
      })
    }

    /*getProjectUsers(){
      fetch('http://127.0.0.1:8000/users/arpit')
      .then(res => res.json())
      .then(usersData => {
        console.log("yuppp"+usersData[0].projects[0].name)
        console.log(this.props.project.name)
       var userList = []
       usersData.map(user => 
        {return (user.projects[0].name===this.props.project.name) ? userList.push(user): ""}
        )
       this.setState({
         users: userList
       })
       console.log(userList)
      })
    }*/

    openProject(project){
      this.setState({
        project: project
      })
    }

    render() {
        return(
          <div>
              <div className="project-details">
                <div style={{color: "white", fontSize: "medium"}}><Navbar2 notification={true} request={true} notifications={this.state.notifications}/></div>
                  
                  {this.state.notifications.map(request => {
                      <Card>
                        <Card.Body>
                        { request.project ?
                          <>
                          <Link to={"/user/"+request.user}>{request.user}</Link>
                          <p>sent a request to join your project</p>
                          <Link className="navbar-item"
                            activeClassName="is-active"
                            onClick = {()=>this.openProject(request.project)}>
                            {request.project}
                          </Link>
                          <Button icon="accept"></Button>
                          <Button icon="reject"></Button>
                          </>
                          : ''
                        }
                        { request.discussion ?
                          <>
                          <p>You were mentioned in</p>
                          <Link className="navbar-item"
                            activeClassName="is-active"
                            onClick = {()=>this.openProject(request.project)}>
                            {request.project}
                          </Link>
                          <Link>{request.user}</Link>
                          </>
                          : ''
                        }
                        </Card.Body>
                      </Card>
                  })}
              </div>
          </div>
        )
    }
}

export default Notifications