import { render } from '@testing-library/react';
import React from 'react'
import '../../App.css';
import { Component } from 'react'
import {Link} from 'react-router-dom'
import { Card } from 'react-bootstrap'
import 'semantic-ui-css/semantic.min.css'
import { Button } from 'react-bootstrap'
import './SentRequest.css'

class SentRequests extends Component{
 
//const {project, key, openProject} = this.props

/*let classes = cx('react-list-select--item', {
   'is-disabled': props.disabled,
   'is-selected': props.selected,
   'is-focused': props.focused,
})*/
   state = {

   }

   openProject(){
      this.setState({
         projectOpen: true
      })
   }

   render(){
      return(
         <div className="react-list-select--item"> 
         <div className="request-item">
            <div className={"request-info", "c"} style={{ width: '40rem' }}>
                  <Card>
                     <Card.Body>
                        <h2>Raised By You,</h2>
                        <h2>For Project:</h2>
                        {console.log(this.props.request.request)}
                        <Link to={`/projects/${this.props.request.request}`}>{this.props.request.request}</Link>
                     </Card.Body>
                     <div class="rowC">
                     <div className="pad">
                        <Button onClick={() => {this.props.acceptRequest(this.props.project)}}>
                           Send Reminder
                        </Button>
                     </div>

                     <div className="pad" style={{margin: 'auto'}}>
                        <Button onClick={() => {this.props.remove(this.props.project)}}>
                           Withdraw Request
                        </Button>
                     </div>
                     </div>
                  </Card>
            </div>  
            <div className="clear"></div>
         </div>

         </div>
         )
   }
}


export default SentRequests