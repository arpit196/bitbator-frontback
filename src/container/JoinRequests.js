import React, { Component } from 'react'
import ProjectFields from '../components/ProjectFields/ProjectFields'
import ProjectUsers from '../components/ProjectUsers/ProjectUsers'
import SentRequest from '../components/SentRequests/SentRequests'
import ReceivedRequest from '../components/ReceivedRequest/ReceivedRequest'
import Navbar2 from '../components/NavBar/NavBar2'
import { Button } from 'react-bootstrap'
import './JoinRequests.css'
import SearchBar from '../components/SearchBar/SearchBar'
import { FaCentercode } from 'react-icons/fa'
import { Dropdown } from 'react-bootstrap'

class JoinRequest extends Component {
    currentUser = {"projects": [{"name": "collab", "detail": "Application for collaborating on projects"}], "name": "arpit", "description": "MLEng", "requests": [{"user": "abc", "project": "def"}]}
    state = {
      requests: [],
      filterOption: 'project',
      inputValue: "",
      allRequests: []
    }
    
    constructor(props){
      super(props)
      this.search = this.search.bind(this)
      this.searchByProject = this.searchByProject.bind(this)
      this.searchByPeople = this.searchByPeople.bind(this)
      this.getRequests = this.getRequests.bind(this)
      this.containsInput = this.containsInput.bind(this)
      this.getRequests()
      this.searchRequests = this.searchRequests.bind(this)
      this.search = this.search.bind(this)
      this.declineSelected = this.declineSelected.bind(this)
    }
    //publishing To kafka
    /*
    pushDataToKafka(dataToPush){
      try {
        let payloadToKafkaTopic = [{topic: config.KafkaTopic, messages: JSON.stringify(dataToPush) }];
        console.log(payloadToKafkaTopic);
        producer.on('ready', async function() {
          producer.send(payloadToKafkaTopic, (err, data) => {
                console.log('data: ', data);
        });
      
        producer.on('error', function(err) {
          //  handle error cases here
        })
        })
      }
      catch(error) {
        console.log(error);
      }
    }*/
    
    getRequests(){
      fetch('http://127.0.0.1:8000/user/'+ window.currentUser +'/requests')
      .then(res => res.json())
      .then(requestsData => {
       console.log(requestsData)
       requestsData = requestsData.sort(function(a,b){
        if( a === undefined || b === undefined){
          return 0
        }
        var d1 = new Date(a.timestamp).getTime()
        var d2 = new Date(b.timestamp).getTime()
        return (d2 - d1)
      })
       this.setState({
        requests: this.state.requests.concat(requestsData),
        allRequests: this.state.allRequests.concat(requestsData)
       })
      })
      console.log(this.state.requests)

      /*fetch('http://127.0.0.1:8000/user/Ansh/requests')
      .then(res => res.json())
      .then(requestsData => {
       console.log(requestsData)
       this.setState({
        requests: this.state.requests.concat(requestsData)
       })
      })
      console.log(this.state.requests)*/

      this.currentUser.projects.map(project=>{
        fetch('http://127.0.0.1:8000/project/'+ project.name +'/request')
        .then(res => res.json())
        .then(requestsData => {
        console.log(requestsData)
        this.setState({
          requests: this.state.requests.concat(requestsData),
          allRequests: this.state.allRequests.concat(requestsData)
        })
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

    acceptRequest(request){
        //remove request from user
        fetch("http://127.0.0.1:8000/user/"+request.user+"/requests/"+request.request, {  method: "DELETE",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({   user: request.user, project: request.request  })})
        .then(response => {
          console.log(response.status);     
          return response.json();  
        })
        .then(data => console.log(data));

        /*fetch("http://127.0.0.1:8000/user/"+this.currentUser+"/requests/"+request.request, {  method: "DELETE",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({   user: request.user, project: request.request  })})
        .then(response => {
          console.log(response.status);     
          return response.json();  
        })*/

        //add user to project
        fetch("http://127.0.0.1:8000/project/"+request.request+"/user", {  method: "PATCH",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({  project: request.request, user: request.user  })})
        .then(response => {
          console.log(response.status);     
          return response.json();  
        })
        .then(data => console.log(data));

        //add project to user
        fetch("http://127.0.0.1:8000/user/"+window.currentUser || localStorage.getItem("username"), {  method: "PATCH",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({   project: request.request  })})
        .then(response => {
          console.log(response.status);     
          return response.json();  
        })
        .then(data => console.log(data));

        //send notification
        fetch("http://127.0.0.1:8000/user/"+request.user+"/notifications", {  method: "POST",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({   message: "Your request for access to project:"+request.project+" was accepted by" +this.currentUser.name })})
        .then(response => {
          console.log(response.status);     
          return response.json();  
        })
        .then(data => console.log(data));
    }

    removeRequest(request){
        fetch("http://127.0.0.1:8000/user/"+request.user+"/requests/"+request.request, {  method: "DELETE",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({   user: request.user, project: request.request  })})
        .then(response => {
          console.log(response.status);     
          return response.json();  
        })
        .then(data => console.log(data));

        fetch("http://127.0.0.1:8000/user/"+request.user+"/requests", {  method: "DELETE",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({   user: request.user, project: request.project  })})
        .then(response => {
          console.log(response.status);     
          return response.json();  
        })
        .then(data => console.log(data));
    }
    
    declineRequest(request){
        fetch("http://127.0.0.1:8000/user/"+request.user+"/notifications", {  method: "POST",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({   message: "Your request for access to project:"+request.project+" was declined by" +this.currentUser.name  })})
        .then(response => {
          console.log(response.status);     
          return response.json();  
        })
        .then(data => console.log(data));

        fetch("http://127.0.0.1:8000/user/"+request.user+"/requests/"+request.request, {  method: "DELETE",  headers: {    "Content-type": "application/json"  },  body: JSON.stringify({   user: request.user, project: request.request  })})
        .then(response => {
          console.log(response.status);     
          return response.json();  
        })
        .then(data => console.log(data));
    }

    getTotalRequest(){
        return this.state.requests.length
    }

    reqScore(request, word_count){
      var project_name = request.request.split(" ");
        var score = 0
        for(var i=0;i < project_name.length; i++){
          if(word_count[project_name[i].toLowerCase()] > 0){
            score = score + 1
          }
        }
    }

    containsInput(request){
      if(this.state.filterOption === "project"){
        return request.request.includes(this.state.inputValue)
      }
      else{
        return request.user.includes(this.state.inputValue)
      }
    }

    searchRequests(){
      var input_list = this.state.inputValue.split(" ")
      var word_count = {}

      if(input_list.length < 2){
        {console.log(this.state.requests)}
        var newReqs = this.state.allRequests.filter(this.containsInput)
        this.setState({
          requests: newReqs
        })
      }
      console.log(this.state.requests)
      for(var i=0;i < input_list.length; i++){
        if((word_count[input_list[i].toLowerCase()] === 0)) { (word_count[input_list[i].toLowerCase()] = (word_count[input_list[i].toLowerCase()]) + 1) } 
      }
      this.state.requests.sort((a,b) => this.reqScore(b, word_count) - this.reqScore(a, word_count))
        /*this.state.requests.map(request => {
          this.setState({
            requests
            })
        })*/
    }

    search(e){
        this.setState({
          inputValue: e.target.value
        },()=>this.searchRequests())
    }

    searchByProject(){
        this.setState({
          filterOption: 'project'
        })
    }

    searchByPeople(){
      this.setState({
        filterOption: 'user'
      })
    }

    declineSelected(){
      {this.state.requests.map(request=>{
        this.declineRequest(request)
      })}
    }

    showDeclineButton(){
      if(this.state.requests.length > 0){
        return <div class="top-right-element"><button onClick={this.declineSelected} class="btn-reject">Decline all Requests</button></div>
      }
      else{
        return ''
      }
    }

    render() {
        return(
          <div>
              <div className="project-details">
                  <Navbar2 notification={true} request={true}></Navbar2>
                  {this.showDeclineButton()}
                  <div class="rowC">
                    <div style={{ width: '40rem', justifyContent: 'center', marginLeft: '350px'}}>
                      <SearchBar inputValue={this.state.inputValue} onChange={(e)=>this.search(e)}
                                      />
                    </div>
                    <Dropdown class="drpdown">
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                          Filter by:
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item onClick={this.searchByProject}>Projects</Dropdown.Item>
                          <Dropdown.Item onClick={this.searchByPeople}>People</Dropdown.Item>
                          <Dropdown.Item onClick={this.searchByBoth}>Both</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <h1>Requests received: </h1>
                  {this.state.requests.map(request => {
                      if(request.user !== window.currentUser){
                          return <ReceivedRequest request={request} accept={(request)=>this.acceptRequest(request)} decline={(request)=>this.declineRequest(request)}/>
                      }
                  })}
                  <h1>Your pending requests: </h1>
                  {this.state.requests.map(request => {
                      if(request.user === window.currentUser){
                          //return <SentRequest users={this.state.users} remove={this.removeRequest}/>
                          return <SentRequest request={request} remove={this.removeRequest}/>
                      }
                  })}
              </div>
          </div>
        )
    }
}

export default JoinRequest