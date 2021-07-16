import { render } from '@testing-library/react';
import React from 'react'
import '../../App.css';
import '../ProjectList/ProjectListElement.css'
import { Component } from 'react'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import {NavLink} from 'react-bootstrap'
import { FaPlus } from 'react-icons/fa';

class ProjectListElement extends Component{
 
//const {project, key, openProject} = this.props

/*let classes = cx('react-list-select--item', {
   'is-disabled': props.disabled,
   'is-selected': props.selected,
   'is-focused': props.focused,
})*/
renderOnCondition(){
   console.log(this.props.project)
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
   else if(this.props.project.allowRequest){
      return <Button style={{borderRadius: '20px', float: 'right', backgroundColor: 'orange'}} onClick={() => {this.props.sendJoinRequest(this.props.project)}}>
         Join Project <FaPlus style={{margin: '3px'}}></FaPlus> 
      </Button>
   }
}

   render(){
      return(
      <div> 
         <div 
            style={{margin: '5px 5px 5px 5px'}} contenteditable="true" className="react-list-select--item center"
            > 
         {/*<div className={"project-item","box_model"}>
            <div className="project-info">
                  <h2>{this.props.project.name} </h2>
                  <p> {this.props.project.detail}</p>
            </div>  
         <div className="clear"></div>*/}
         {console.log(this.props.project.tags)}
            <Card style={{ width: '45rem'}}>
               <Card.Body>
                  <Card.Title style={{color: 'blue'}}><Link className={"project-title"} to={`/projects/${this.props.project.name}`}><h2>{this.props.project.name}</h2></Link></Card.Title>
                  <Card.Text>{this.props.project.detail}</Card.Text>
                  <div class="rowC">
                  {this.props.project.tags && this.props.project.tags.map(tag => {
                     return (<div right="true">
                        <p onClick={()=>this.props.putTag(tag.name)} className={"tag"}>{tag.name}</p>
                     </div>)
                  })}
                  </div>
                  
                  <div class="rowC" style={{float: 'right'}}>
               {/*<button class="push_button grey" onClick={() => {this.props.openProject(this.props.project)}}>
                  Open the Project
                  </button>*/}
                     <div>
                        {this.renderOnCondition()}
                     </div>
                  </div>
               </Card.Body>
            </Card>
         </div>  
         {
            /*<Tags>this.props.project.tags</Tags>*/
         }
      </div>  
      )
   }
}


export default ProjectListElement