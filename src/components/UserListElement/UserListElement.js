import { render } from '@testing-library/react';
import React from 'react'
import '../../App.css';
import '../ProjectList/ProjectListElement.css'
import { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { useHistory } from 'react-router-dom'
import { withRouter, Link } from 'react-router-dom'


class UserListElement extends Component{
 
//const {project, key, openProject} = this.props

/*let classes = cx('react-list-select--item', {
   'is-disabled': props.disabled,
   'is-selected': props.selected,
   'is-focused': props.focused,
})*/

state = {
    user: {}
}



constructor(props){
   super(props)

}

renderOnCondition(){
   if(this.props.status === "Already Joined"){
      return <Button onClick={() => {this.props.withdraw(this.props.project)}}>
         Withdraw from Project 
      </Button> 
   }
   else if(this.props.status === "Request Sent"){
      return <Button onClick={() => {this.props.cancelRequest(this.props.project)}}>
         Cancel Request
      </Button>
   }
   else{
      return <Button onClick={() => {this.props.sendJoinRequest(this.props.project)}}>
         Send Request to join
      </Button>
   }
}

    openProfile = (e) => {
        e.preventDefault()
        fetch('http://127.0.0.1:8000/user/' + this.props.user.name)
        .then(res => res.json())
        .then(userData => {
        console.log(userData[0])
        this.setState({
            user: userData[0]
        }, console.log(this.state.user))
        })
        console.log(this.props)
        this.props.history.push("/user/"+this.props.user.name)
    }

   render(){
      return(
      <div> 
         <div style={{margin: '10px'}}
            contenteditable="true" className="react-list-select--item center"
            > 
         {/*<div className={"project-item","box_model"}>
            <div className="project-info">
                  <h2>{this.props.project.name} </h2>
                  <p> {this.props.project.detail}</p>
            </div>  
         <div className="clear"></div>*/}
            <Card onClick={e => this.openProfile(e)} style={{ width: '60rem' }}>
               <Card.Body>
                  <Card.Title><Link to={'/user/'+this.props.user.name}>{this.props.user.name}</Link></Card.Title>
                  <Card.Text>{this.props.user.description}</Card.Text>
                  <Card.Text>Interests:</Card.Text>
                  {this.props.user.interests.length>0 ? 
                     this.props.user.interests.map(interest => {
                     return <Card.Text>{interest}</Card.Text>
                     })
                     :''
                  }
               </Card.Body>
            </Card>
         </div>  
         {
            /*<Tags>this.props.project.tags</Tags>
                <div class="rowC">
               <button class="push_button grey" onClick={() => {this.props.openProject(this.props.project)}}>
                  Open the Project
               </button>
               </div>
            */
         }
      </div>  
      )
   }
}


export default withRouter(UserListElement)