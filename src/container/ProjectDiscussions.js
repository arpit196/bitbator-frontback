import { publish, subscribe } from 'pubsub-js'
import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import '../App.js';
import { autoBind } from 'react-autobind/lib/autoBind'
import Urlify from 'urlify'
import Linkify from 'react-linkify';
import {IoIosAirplane} from 'react-icons/io'

class ProjectDiscussions extends Component {
    state = {
      currentUser: 'arpit',
      users: [],
      discussions: [],
      requests: [],
      inputValue: ''
    }

    /*urlify = Urlify.create(
      {
        addEToUmlauts:true,
        szToSs:true,
        spaces:"_",
        nonPrintable:"_",
        trim:true
      }
    )*/
    
    constructor(props){
      super(props)
      this.updateInputValue = this.updateInputValue.bind(this);
      this.publishMessage = this.publishMessage.bind(this);
      this.subscriber = this.subscriber.bind(this);
      this.publishMessage = this.publishMessage.bind(this);
    }

    updateInputValue(evt){
      evt.preventDefault();
      this.setState({
        inputValue: evt.target.value
      });
    }

    componentDidMount(){
      /*fetch('http://127.0.0.1:8000/project/'+this.props.project+'/discussions')
      .then(res => res.json())
      .then(discussionsData => {
       console.log(discussionsData)
       this.setState({
        discussions: discussionsData
       })
      })*/

      this.token = subscribe('notifications-channel', this.subscriber)
      console.log(this.props)
      fetch("http://127.0.0.1:8000/project/" + this.props.project + "/discussions")
      .then(response => {    
        return response.json();  
      })
      .then(data => {
        console.log(data)
        data.map(message=>{
          this.setState({
            discussions: this.state.discussions.concat({message: message.message, user: message.user})
          })
        }
      )})
    }

    urlify(text) {
      var urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.replace(urlRegex, function(url) {
        return <a href={url}>{url}</a>;
      })
    }

    componentDidUpdate(){
      subscribe("notifications-channel", data => {
        if(!data.message === ""){
          this.setState({
            discussions: this.state.discussions.concat(data)
          })  
        }
      })
    }

    /*getProjectUsers(){
      fetch('http://127.0.0.1:8000/project/'+this.props.project.name+'/users')
      .then(res => res.json())
      .then(usersData => {
        //console.log("yuppp"+usersData[0].projects[0].name)
        console.log(this.props.project.name)
       var userList = []
       usersData.map(user => 
        {return userList.push(user)}
        )
       this.setState({
         users: userList
       })
       console.log(this.state.users)
      })
    }*/
    
    publishMessage(e){
      e.preventDefault();
      this.setState({inputValue: ""})
      const msg = this.state.inputValue
      publish("notifications-channel", {message: msg, user: window.currentUser ,project:this.props.project})
      fetch("http://127.0.0.1:8000/project/" + this.props.project + "/discussions", {  method: "POST",  headers: {    "Content-type": "application/json"  }, body: JSON.stringify({   message: msg, user: window.currentUser  })})
      .then(response => {    
        return response.json();  
      })
      .then(data => this.setState({
        requests: this.state.requests.concat(data)
      }));
    }

    subscriber(msg, data){
      // Update the UI with a new copy of all messages.
      this.setState ({
        discussions: this.state.discussions.concat(data), 
      });
    }

    render() {
        return(
          <div class="rowR11">
              <div className="discussions-details">
                  {this.state.discussions.map(discussion => { 
                   return <Card style={{backgroundColor: 'RGB(37,211,102)', color: 'white', width: '800px', margin: '10px 10px 10px 10px', float: 'left'? discussion.user===window.currentUser: 'right'}}>
                     {
                      discussion.user===window.currentUser?
                        <Card.Header style={{backgroundColor: 'RGB(37,211,102)',  borderColor: 'RGB(37,211,102)', color: 'grey', width: '800px', textAlign: 'left', borderRadius: '10px'}}>{discussion.user}</Card.Header>
                     :
                     <Card.Header style={{backgroundColor: 'RGB(37,211,102)', borderColor: 'RGB(37,211,102)', color: 'grey', width: '800px', textAlign: 'left', borderRadius: '10px', marginRight: '10px'}}>{discussion.user}</Card.Header>
                     }
                     <div><Linkify>{discussion.message}</Linkify></div>
                    </Card>        
                   })
                  }
              </div>
              <div class="rowC" style={{bottom: '30px', left: '100px', position: 'absolute'}}>
                  <Form.Group controlId="formBasicEmail">
                    <div class="rowC">
                    <Form.Control style={{width: '1000px'}} value={this.state.inputValue} onChange={this.updateInputValue} type="email" placeholder="Enter message relevant to the project.." />
                    <Button style={{margin: '10px', borderRadius: '50%'}} onClick={this.publishMessage} variant="primary" type="submit">
                      <IoIosAirplane />
                    </Button>
                    </div>
                  </Form.Group>
              </div>
          </div>
        )
    }
}

export default ProjectDiscussions