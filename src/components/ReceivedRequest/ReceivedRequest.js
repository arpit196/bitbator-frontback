import { render } from '@testing-library/react';
import React from 'react'
import '../../App.css';
import { Component } from 'react'
import {Link} from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { Card } from 'react-bootstrap'

class ReceivedRequests extends Component{
 
//const {project, key, openProject} = this.props

/*let classes = cx('react-list-select--item', {
   'is-disabled': props.disabled,
   'is-selected': props.selected,
   'is-focused': props.focused,
})*/

   render(){
      return(
         <div className="react-list-select--item"> 
         <div className="request-item">
         <div className={"request-info", "c"} style={{ width: '40rem', margin: '10px 500px 0px auto' }}>
                  <Card>
                     <Card.Header><h2>Raised By:</h2>
                        <Link to={`/user/${this.props.request.user}`}>{this.props.request.user}</Link></Card.Header>
                     <Card.Body>
                        
                        <h2>For Project:</h2>
                        <Link to={`/projects/${this.props.request.request}`}>{this.props.request.request}</Link>
                     </Card.Body>
                     {this.props.request.message?
                     <Card style={{width: '100px', borderRadius: '10px', margin: 'auto'}}>
                        <Card.Header>
                           Note
                        </Card.Header>
                        <Card.Body>
                           {this.props.request.message}
                        </Card.Body>
                     </Card>
                     :''}
                     <div class="rowC">
                     <div className="pad">
                        <Button onClick={() => {this.props.accept(this.props.request)}}>
                           Accept
                        </Button>
                     </div>

                     <div className="pad" style={{margin: 'auto'}}>
                        <Button onClick={() => {this.props.remove(this.props.request)}}>
                           Decline
                        </Button>
                     </div>
                     </div>
                  </Card>
            </div>  
         </div>
         </div>
         )
   }
}


export default ReceivedRequests